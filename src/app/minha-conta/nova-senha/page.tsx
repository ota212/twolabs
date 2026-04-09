"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function NovaSenhaPage() {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Supabase processa o token do hash da URL automaticamente via onAuthStateChange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // Verifica se já tem sessão ativa (caso o token já tenha sido processado)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setError("Não foi possível atualizar a senha. O link pode ter expirado.");
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/minha-conta"), 2500);
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Senha definida!</h1>
        <p className="text-navy/60">Redirecionando para sua conta…</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center text-navy/50">
        Verificando link…
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-2">Definir nova senha</h1>
      <p className="text-navy/60 mb-8">Escolha uma senha para sua conta.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy/70 mb-1">Nova senha</label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-navy/10 rounded px-4 py-3 bg-white focus:outline-none focus:border-electric-blue transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy/70 mb-1">Confirmar senha</label>
          <input
            type="password"
            placeholder="Repita a senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full border border-navy/10 rounded px-4 py-3 bg-white focus:outline-none focus:border-electric-blue transition-colors"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-electric-blue text-white font-bold py-3 rounded hover:bg-electric-blue/90 transition-colors disabled:opacity-60"
        >
          {submitting ? "Salvando…" : "Salvar senha"}
        </button>
      </form>
    </div>
  );
}
