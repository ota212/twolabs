"use client";

import { useState, useEffect, useRef } from "react";
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
  const [authError, setAuthError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/minha-conta` },
    });
    if (!error) {
      setMagicLinkSent(true);
      setResendCountdown(30);
      countdownRef.current = setInterval(() => {
        setResendCountdown((c) => {
          if (c <= 1) { clearInterval(countdownRef.current!); return 0; }
          return c - 1;
        });
      }, 1000);
    } else {
      setAuthError("Não foi possível enviar o link. Tente novamente.");
    }
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
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="font-bold text-green-800 mb-1">Link enviado!</p>
            <p className="text-green-700 text-sm mb-1">
              Verifique sua caixa de entrada em <strong>{email}</strong>
            </p>
            <p className="text-green-600 text-xs mb-4">Clique no link do email para entrar — sem senha.</p>
            <button
              onClick={(e) => { e.preventDefault(); if (resendCountdown === 0) handleLogin(e as unknown as React.FormEvent); }}
              disabled={resendCountdown > 0}
              className="text-sm text-green-700 underline disabled:no-underline disabled:text-green-500"
            >
              {resendCountdown > 0 ? `Reenviar em ${resendCountdown}s` : "Reenviar link"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy/70 mb-1">Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-navy/10 rounded px-4 py-3 bg-white focus:outline-none focus:border-electric-blue transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-electric-blue text-white font-bold py-3 rounded hover:bg-electric-blue/90 transition-colors"
            >
              Enviar link de acesso
            </button>
            <p className="text-center text-xs text-navy/40">Sem senha — enviamos um link direto para seu email.</p>
            {authError && (
              <p className="text-red-600 text-sm text-center">{authError}</p>
            )}
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
        <p className="text-navy/50 py-8">Você ainda não tem compras.</p>
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
