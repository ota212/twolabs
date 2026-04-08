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
