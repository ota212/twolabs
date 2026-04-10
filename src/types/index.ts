export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  category: string | null;
  image_url: string | null;
  file_path: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  product_id: string;
  stripe_session_id: string;
  status: string;
  created_at: string;
  product?: Product;
}

// ── Admin types ────────────────────────────────────────────────────────────────

export interface AdminMetrics {
  revenue: { today: number; week: number; month: number; total: number };
  purchases: { today: number; week: number; month: number; total: number };
  userCount: number;
  revenueByProduct: { name: string; revenue: number }[];
  dailyRevenue: { date: string; revenue: number }[];
  recentPurchases: RecentPurchase[];
}

export interface RecentPurchase {
  id: string;
  userEmail: string;
  productName: string;
  priceCents: number;
  status: string;
  createdAt: string;
}
