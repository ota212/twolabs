import type { Metadata } from "next";
import { createAnonClient } from "@/lib/supabase/server";
import { Product } from "@/types";
import { CatalogClient } from "./catalog-client";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Produtos",
  description: "Todos os produtos digitais da Dois Labs.",
};

async function getAllProducts(): Promise<Product[]> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return (data as Product[]) ?? [];
}

export default async function ProdutosPage() {
  const products = await getAllProducts();
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))] as string[];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Produtos</h1>
      <CatalogClient products={products} categories={categories} />
    </div>
  );
}
