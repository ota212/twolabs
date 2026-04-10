"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      router.replace("/minha-conta");
      return;
    }

    const supabase = createBrowserSupabaseClient();
    supabase.auth
      .exchangeCodeForSession(code)
      .then(() => router.replace("/minha-conta"))
      .catch(() => router.replace("/minha-conta?error=auth"));
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen text-navy/50">
      Autenticando...
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-navy/50">Autenticando...</div>}>
      <AuthCallbackInner />
    </Suspense>
  );
}
