"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import type { AdminMetrics } from "@/types";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";

const COLORS = ["#3B82F6", "#1A3A5C", "#10B981", "#F59E0B", "#EF4444"];

export default function AdminOverview() {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch("/api/admin/metrics", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) setMetrics(await res.json());
      setLoading(false);
    }
    load();
  }, [supabase]);

  if (loading) return <Loading />;
  if (!metrics) return <p className="text-navy/50">Erro ao carregar métricas.</p>;

  const dailyForChart = metrics.dailyRevenue.map((d) => ({
    date: d.date.slice(5), // MM-DD
    revenue: d.revenue / 100,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Visão Geral</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Receita Hoje" value={formatPrice(metrics.revenue.today)} />
        <StatCard label="Receita 7 dias" value={formatPrice(metrics.revenue.week)} />
        <StatCard label="Receita 30 dias" value={formatPrice(metrics.revenue.month)} />
        <StatCard label="Usuários" value={String(metrics.userCount)} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-navy/5 p-5">
          <h2 className="text-sm font-bold text-navy/60 mb-4">Receita diária (30 dias)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyForChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${v}`} />
                <Tooltip formatter={(v) => [`R$ ${Number(v).toFixed(2)}`, "Receita"]} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by product */}
        <div className="bg-white rounded-xl border border-navy/5 p-5">
          <h2 className="text-sm font-bold text-navy/60 mb-4">Receita por produto</h2>
          {metrics.revenueByProduct.length > 0 ? (
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.revenueByProduct.map((p) => ({ ...p, revenue: p.revenue / 100 }))}
                    dataKey="revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(props: PieLabelRenderProps) => {
                      const name = String(props.name ?? "");
                      const percent = Number(props.percent ?? 0);
                      return `${name.split(" ").slice(0, 2).join(" ")} (${(percent * 100).toFixed(0)}%)`;
                    }}
                    labelLine={false}
                  >
                    {metrics.revenueByProduct.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`R$ ${Number(v).toFixed(2)}`, "Receita"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-navy/30 text-sm text-center py-12">Sem dados</p>
          )}
        </div>
      </div>

      {/* Recent purchases table */}
      <div className="bg-white rounded-xl border border-navy/5 overflow-hidden">
        <div className="p-5 border-b border-navy/5">
          <h2 className="text-sm font-bold text-navy/60">Últimas compras</h2>
        </div>
        {metrics.recentPurchases.length === 0 ? (
          <p className="text-navy/30 text-sm text-center py-12">Nenhuma compra registrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-navy/50 text-xs uppercase">
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Produto</th>
                  <th className="px-5 py-3">Valor</th>
                  <th className="px-5 py-3">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {metrics.recentPurchases.map((p) => (
                  <tr key={p.id} className="hover:bg-navy/[0.02]">
                    <td className="px-5 py-3 font-medium">{p.userEmail}</td>
                    <td className="px-5 py-3 text-navy/70">{p.productName}</td>
                    <td className="px-5 py-3">{formatPrice(p.priceCents)}</td>
                    <td className="px-5 py-3 text-navy/50">
                      {new Date(p.createdAt).toLocaleDateString("pt-BR")}
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-navy/5 p-5">
      <p className="text-xs font-bold text-navy/50 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-navy">{value}</p>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center py-24 text-navy/40">
      Carregando métricas...
    </div>
  );
}
