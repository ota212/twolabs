"use client";

import { useState } from "react";

export function BuyButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="w-full bg-electric-blue text-white font-bold py-4 rounded text-lg hover:bg-electric-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Redirecionando..." : "Comprar Agora"}
    </button>
  );
}
