"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import type { RecentPurchase } from "@/types";

type Period = "today" | "week" | "month" | "all";

export default function VendasPage() {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [purchases, setPurchases] = useState<RecentPurchase[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const params = new URLSearchParams({ limit: "200" });
      if (period !== "all") params.set("period", period);
      const res = await fetch(`/api/admin/vendas?${params}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPurchases(data.purchases);
        setTotal(data.total);
      }
      setLoading(false);
    }
    load();
  }, [supabase, period]);

  const filtered = search
    ? purchases.filter(
        (p) =>
          p.userEmail.toLowerCase().includes(search.toLowerCase()) ||
          p.productName.toLowerCase().includes(search.toLowerCase())
      )
    : purchases;

  const totalRevenue = filtered.reduce((s, p) => s + p.priceCents, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Vendas</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por email ou produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-navy/10 rounded-lg px-4 py-2 bg-white focus:outline-none focus:border-electric-blue text-sm sm:w-72"
        />
        <div className="flex gap-2">
          {(["all", "today", "week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                period === p
                  ? "bg-navy text-white"
                  : "bg-white border border-navy/10 text-navy/60 hover:border-navy/30"
              }`}
            >
              {p === "all" ? "Tudo" : p === "today" ? "Hoje" : p === "week" ? "7 dias" : "30 dias"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex gap-6 mb-4 text-sm text-navy/60">
        <span><strong className="text-navy">{filtered.length}</strong> vendas{total > filtered.length ? ` de ${total}` : ""}</span>
        <span>Total: <strong className="text-navy">{formatPrice(totalRevenue)}</strong></span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-navy/5 overflow-hidden">
        {loading ? (
          <p className="text-navy/40 text-sm text-center py-12">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-navy/30 text-sm text-center py-12">Nenhuma venda encontrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-navy/50 text-xs uppercase border-b border-navy/5">
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Produto</th>
                  <th className="px-5 py-3">Valor</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-navy/[0.02]">
                    <td className="px-5 py-3 font-medium">{p.userEmail}</td>
                    <td className="px-5 py-3 text-navy/70">{p.productName}</td>
                    <td className="px-5 py-3">{formatPrice(p.priceCents)}</td>
                    <td className="px-5 py-3">
                      <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-navy/50">
                      {new Date(p.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
