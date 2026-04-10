import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase/server";

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
  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 100), 500);
  const offset = Number(url.searchParams.get("offset") ?? 0);
  const period = url.searchParams.get("period"); // today | week | month | null

  let query = supabase
    .from("purchases")
    .select("*, product:products(name, price_cents)", { count: "exact" })
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (period) {
    const now = new Date();
    let since: string;
    if (period === "today") {
      since = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    } else if (period === "week") {
      since = new Date(now.getTime() - 7 * 86400000).toISOString();
    } else {
      since = new Date(now.getTime() - 30 * 86400000).toISOString();
    }
    query = query.gte("created_at", since);
  }

  const { data: purchases, count } = await query;

  // Enrich with user emails
  const enriched = [];
  for (const p of purchases ?? []) {
    let email = "—";
    try {
      const { data } = await supabase.auth.admin.getUserById(p.user_id);
      email = data?.user?.email ?? "—";
    } catch { /* ignore */ }
    enriched.push({
      id: p.id,
      userEmail: email,
      productName: p.product?.name ?? "—",
      priceCents: p.product?.price_cents ?? 0,
      status: p.status,
      createdAt: p.created_at,
    });
  }

  return NextResponse.json({ purchases: enriched, total: count ?? 0 });
}
