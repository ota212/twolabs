import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { AdminMetrics, RecentPurchase } from "@/types";

// Verify admin role from Bearer token (defense in depth — proxy also checks)
async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;

  const token = authHeader.split(" ")[1];
  const userClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user }, error } = await userClient.auth.getUser();
  if (error || !user) return false;
  return user.app_metadata?.role === "admin";
}

export async function GET(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const supabase = createServiceRoleClient();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
  const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString();

  // Fetch all completed purchases with product info
  const { data: allPurchases } = await supabase
    .from("purchases")
    .select("*, product:products(name, price_cents)")
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  const purchases = allPurchases ?? [];

  // Revenue helpers
  function sumRevenue(since?: string) {
    const filtered = since
      ? purchases.filter((p) => p.created_at >= since)
      : purchases;
    return filtered.reduce((sum, p) => sum + (p.product?.price_cents ?? 0), 0);
  }

  function countPurchases(since?: string) {
    return since
      ? purchases.filter((p) => p.created_at >= since).length
      : purchases.length;
  }

  // Revenue by product
  const byProduct: Record<string, { name: string; revenue: number }> = {};
  for (const p of purchases) {
    const name = p.product?.name ?? "Desconhecido";
    if (!byProduct[name]) byProduct[name] = { name, revenue: 0 };
    byProduct[name].revenue += p.product?.price_cents ?? 0;
  }

  // Daily revenue (last 30 days)
  const dailyMap: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    dailyMap[key] = 0;
  }
  for (const p of purchases) {
    const key = p.created_at.slice(0, 10);
    if (key in dailyMap) {
      dailyMap[key] += p.product?.price_cents ?? 0;
    }
  }

  // User count via admin API
  let userCount = 0;
  try {
    const { data } = await supabase.auth.admin.listUsers({ perPage: 1 });
    // The total is in the response — Supabase returns total count even with perPage: 1
    userCount = (data as { users: unknown[]; total?: number })?.total ?? data?.users?.length ?? 0;
  } catch {
    userCount = 0;
  }

  // Recent purchases with user emails
  const recentPurchases: RecentPurchase[] = [];
  const recentSlice = purchases.slice(0, 20);
  for (const p of recentSlice) {
    let email = "—";
    try {
      const { data } = await supabase.auth.admin.getUserById(p.user_id);
      email = data?.user?.email ?? "—";
    } catch { /* ignore */ }

    recentPurchases.push({
      id: p.id,
      userEmail: email,
      productName: p.product?.name ?? "—",
      priceCents: p.product?.price_cents ?? 0,
      status: p.status,
      createdAt: p.created_at,
    });
  }

  const metrics: AdminMetrics = {
    revenue: {
      today: sumRevenue(todayStart),
      week: sumRevenue(weekAgo),
      month: sumRevenue(monthAgo),
      total: sumRevenue(),
    },
    purchases: {
      today: countPurchases(todayStart),
      week: countPurchases(weekAgo),
      month: countPurchases(monthAgo),
      total: countPurchases(),
    },
    userCount,
    revenueByProduct: Object.values(byProduct),
    dailyRevenue: Object.entries(dailyMap).map(([date, revenue]) => ({ date, revenue })),
    recentPurchases,
  };

  return NextResponse.json(metrics);
}
