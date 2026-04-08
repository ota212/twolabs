"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Purchase } from "@/types";
import { formatPrice } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

export default function MinhaContaPage() {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
      if (user) loadPurchases(user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) loadPurchases(currentUser.id);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function loadPurchases(userId: string) {
    const { data } = await supabase
      .from("purchases")
      .select("*, product:products(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setPurchases((data as Purchase[]) ?? []);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/minha-conta` },
    });
    if (!error) setMagicLinkSent(true);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setPurchases([]);
  }

  async function handleDownload(purchaseId: string) {
    setDownloading(purchaseId);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const res = await fetch(`/api/download/${purchaseId}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setDownloading(null);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center text-navy/50">
        Carregando...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-2">Minha Conta</h1>
        <p className="text-navy/70 mb-8">
          Entre com seu email para acessar seus produtos.
        </p>

        {magicLinkSent ? (
          <div className="bg-green-50 border border-green-200 rounded p-6 text-center">
            <p className="font-bold text-green-800 mb-1">Link enviado!</p>
            <p className="text-green-700 text-sm">
              Verifique seu email e clique no link para entrar.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-navy/10 rounded px-4 py-3 bg-white focus:outline-none focus:border-electric-blue transition-colors"
            />
            <button
              type="submit"
              className="w-full bg-electric-blue text-white font-bold py-3 rounded hover:bg-electric-blue/90 transition-colors"
            >
              Enviar link de acesso
            </button>
          </form>
        )}
      </div>
    );
  }

  // Logged in
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Minha Conta</h1>
          <p className="text-navy/60 text-sm mt-1">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-navy/50 hover:text-navy transition-colors"
        >
          Sair
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Meus Produtos</h2>

      {purchases.length === 0 ? (
        <p className="text-navy/50 py-8">Voce ainda nao tem compras.</p>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="bg-white border border-navy/5 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-bold">{purchase.product?.name ?? "Produto"}</p>
                <p className="text-sm text-navy/50">
                  {new Date(purchase.created_at).toLocaleDateString("pt-BR")} ·{" "}
                  {purchase.product ? formatPrice(purchase.product.price_cents) : ""}
                </p>
              </div>
              <button
                onClick={() => handleDownload(purchase.id)}
                disabled={downloading === purchase.id}
                className="bg-navy text-white text-sm font-bold px-4 py-2 rounded hover:bg-navy/90 transition-colors disabled:opacity-50"
              >
                {downloading === purchase.id ? "..." : "Baixar"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
