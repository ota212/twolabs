"use client";

import { useState } from "react";

export function BuyButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Erro ao iniciar pagamento. Tente novamente.");
        setLoading(false);
      }
    } catch {
      setError("Erro ao iniciar pagamento. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full min-h-[52px] bg-electric-blue text-white font-medium py-4 rounded-full text-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric-blue shadow-[0_10px_30px_-10px_rgba(232,93,58,0.55)]"
        aria-busy={loading}
      >
        {loading ? "Redirecionando..." : "Comprar Agora"}
      </button>
      {error && (
        <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
