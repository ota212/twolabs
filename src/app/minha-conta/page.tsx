"use client";

import { useState, useEffect, useRef } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Purchase } from "@/types";
import { formatPrice } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

type AuthMode = "login" | "signup" | "magic";

export default function MinhaContaPage() {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // form state
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // post-action states
  const [signupSent, setSignupSent] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // purchases
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
      if (user) loadPurchases(user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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

  function switchMode(next: AuthMode) {
    setMode(next);
    setAuthError(null);
    setPassword("");
    setConfirmPassword("");
  }

  // ── Google OAuth ─────────────────────────────────────────────────────────────
  async function handleGoogleAuth() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/minha-conta` },
    });
  }

  // ── Password login ────────────────────────────────────────────────────────────
  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) setAuthError("Email ou senha incorretos.");
  }

  // ── Sign up ───────────────────────────────────────────────────────────────────
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);

    if (password.length < 6) {
      setAuthError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setAuthError("As senhas não coincidem.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/minha-conta` },
    });
    setSubmitting(false);

    if (error) {
      setAuthError("Não foi possível criar a conta. Tente novamente.");
    } else {
      setSignupSent(true);
    }
  }

  // ── Magic link ────────────────────────────────────────────────────────────────
  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/minha-conta` },
    });
    setSubmitting(false);
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

  // ── Forgot password ───────────────────────────────────────────────────────────
  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/minha-conta/nova-senha`,
    });
    setSubmitting(false);
    if (!error) setResetSent(true);
    else setAuthError("Não foi possível enviar o email. Tente novamente.");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setPurchases([]);
  }

  async function handleDownload(purchaseId: string) {
    setDownloading(purchaseId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/download/${purchaseId}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setDownloading(null);
    }
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center text-navy/50">
        Carregando...
      </div>
    );
  }

  // ── Logged in ────────────────────────────────────────────────────────────────
  if (user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Minha Conta</h1>
            <p className="text-navy/60 text-sm mt-1">{user.email}</p>
          </div>
          <button onClick={handleLogout} className="text-sm text-navy/50 hover:text-navy transition-colors">
            Sair
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4">Meus Produtos</h2>

        {purchases.length === 0 ? (
          <p className="text-navy/50 py-8">Você ainda não tem compras.</p>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="bg-white border border-navy/5 rounded-lg p-4 flex items-center justify-between">
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

  // ── Not logged in ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-2">Minha Conta</h1>
      <p className="text-navy/60 mb-8">Acesse seus produtos comprados.</p>

      {/* ── Reset password ── */}
      {showReset ? (
        resetSent ? (
          <ConfirmationCard
            title="Email enviado!"
            body={<>Verifique sua caixa de entrada em <strong>{email}</strong> e clique no link para definir sua senha.</>}
            action={{ label: "Voltar ao login", onClick: () => { setShowReset(false); setResetSent(false); } }}
          />
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-navy/60 text-sm -mt-4 mb-2">
              Digite seu email e enviaremos um link para redefinir sua senha.
            </p>
            <EmailField value={email} onChange={setEmail} />
            {authError && <p className="text-red-600 text-sm">{authError}</p>}
            <SubmitButton submitting={submitting} label="Enviar link" loadingLabel="Enviando…" />
            <button type="button" onClick={() => { setShowReset(false); setAuthError(null); }} className="w-full text-sm text-navy/40 hover:text-navy/70 transition-colors">
              ← Voltar ao login
            </button>
          </form>
        )

      /* ── Sign-up email sent ── */
      ) : signupSent ? (
        <ConfirmationCard
          title="Confirme seu email!"
          body={<>Enviamos um link de confirmação para <strong>{email}</strong>. Clique nele para ativar sua conta.</>}
          action={{ label: "Voltar ao login", onClick: () => { setSignupSent(false); switchMode("login"); } }}
        />

      /* ── Magic link sent ── */
      ) : magicLinkSent ? (
        <ConfirmationCard
          title="Link enviado!"
          body={<>Verifique sua caixa de entrada em <strong>{email}</strong>. Clique no link para entrar.</>}
          action={
            resendCountdown > 0
              ? { label: `Reenviar em ${resendCountdown}s`, onClick: () => {}, disabled: true }
              : { label: "Reenviar link", onClick: () => handleMagicLink({ preventDefault: () => {} } as React.FormEvent) }
          }
          muted
        />

      /* ── Auth forms ── */
      ) : (
        <div>
          {/* Google OAuth */}
          <button
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 border border-navy/15 bg-white hover:bg-navy/5 transition-colors rounded-lg py-3 font-medium text-navy/80 mb-4"
          >
            <GoogleIcon />
            Continuar com Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-navy/10" />
            <span className="text-xs text-navy/40">ou</span>
            <div className="flex-1 h-px bg-navy/10" />
          </div>

          {/* Tabs */}
          <div className="flex border border-navy/10 rounded-lg overflow-hidden mb-5">
            {(["login", "signup", "magic"] as AuthMode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  mode === m ? "bg-navy text-white" : "bg-white text-navy/50 hover:text-navy"
                }`}
              >
                {m === "login" ? "Entrar" : m === "signup" ? "Criar conta" : "Sem senha"}
              </button>
            ))}
          </div>

          {/* Login form */}
          {mode === "login" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <EmailField value={email} onChange={setEmail} />
              <PasswordField label="Senha" value={password} onChange={setPassword} placeholder="••••••••" />
              {authError && <p className="text-red-600 text-sm">{authError}</p>}
              <SubmitButton submitting={submitting} label="Entrar" loadingLabel="Entrando…" />
              <button
                type="button"
                onClick={() => { setShowReset(true); setAuthError(null); }}
                className="w-full text-sm text-navy/40 hover:text-navy/70 transition-colors"
              >
                Esqueci minha senha
              </button>
            </form>
          )}

          {/* Sign-up form */}
          {mode === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <EmailField value={email} onChange={setEmail} />
              <PasswordField label="Senha" value={password} onChange={setPassword} placeholder="Mínimo 6 caracteres" />
              <PasswordField label="Confirmar senha" value={confirmPassword} onChange={setConfirmPassword} placeholder="Repita a senha" />
              {authError && <p className="text-red-600 text-sm">{authError}</p>}
              <SubmitButton submitting={submitting} label="Criar conta" loadingLabel="Criando…" />
              <p className="text-center text-xs text-navy/40">
                Já tem uma conta?{" "}
                <button type="button" onClick={() => switchMode("login")} className="underline text-navy/60">
                  Entrar
                </button>
              </p>
            </form>
          )}

          {/* Magic link form */}
          {mode === "magic" && (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <EmailField value={email} onChange={setEmail} />
              {authError && <p className="text-red-600 text-sm">{authError}</p>}
              <SubmitButton submitting={submitting} label="Enviar link de acesso" loadingLabel="Enviando…" />
              <p className="text-center text-xs text-navy/40">Sem senha — enviamos um link direto para seu email.</p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function EmailField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy/70 mb-1">Email</label>
      <input
        type="email"
        placeholder="seu@email.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full border border-navy/10 rounded px-4 py-3 bg-white focus:outline-none focus:border-electric-blue transition-colors"
      />
    </div>
  );
}

function PasswordField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy/70 mb-1">{label}</label>
      <input
        type="password"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full border border-navy/10 rounded px-4 py-3 bg-white focus:outline-none focus:border-electric-blue transition-colors"
      />
    </div>
  );
}

function SubmitButton({ submitting, label, loadingLabel }: { submitting: boolean; label: string; loadingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="w-full bg-electric-blue text-white font-bold py-3 rounded hover:bg-electric-blue/90 transition-colors disabled:opacity-60"
    >
      {submitting ? loadingLabel : label}
    </button>
  );
}

function ConfirmationCard({
  title, body, action, muted = false,
}: {
  title: string;
  body: React.ReactNode;
  action: { label: string; onClick: () => void; disabled?: boolean };
  muted?: boolean;
}) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="font-bold text-green-800 mb-2">{title}</p>
      <p className={`text-sm mb-4 ${muted ? "text-green-700" : "text-green-700"}`}>{body}</p>
      <button
        onClick={action.onClick}
        disabled={action.disabled}
        className="text-sm text-green-700 underline disabled:no-underline disabled:text-green-500"
      >
        {action.label}
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}
