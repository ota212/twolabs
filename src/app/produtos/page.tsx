import type { Metadata } from "next";
import { createAnonClient } from "@/lib/supabase/server";
import { Product } from "@/types";
import { CatalogClient } from "./catalog-client";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Produtos",
  description: "Todos os produtos digitais da Dois Labs. Prontos para usar, automatizados, com acesso imediato após a compra.",
  alternates: { canonical: "https://doislabs.com.br/produtos" },
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Produtos</h1>
      <p className="text-navy/60 mb-10">Explore por área ou use os filtros para encontrar o que precisa.</p>
      <CatalogClient products={products} />
    </div>
  );
}
