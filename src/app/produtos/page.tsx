import type { Metadata } from "next";
import { createAnonClient } from "@/lib/supabase/server";
import { Product } from "@/types";
import { CatalogClient } from "./catalog-client";
import { MonoLabel } from "@/components/mono-label";
import { EditorialHeading, Italic } from "@/components/editorial-heading";
import { Reveal } from "@/components/reveal";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Produtos",
  description:
    "Todos os produtos digitais da Dois Labs. Prontos para usar, automatizados, com acesso imediato após a compra.",
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
    <>
      {/* ─── HEADER ─── */}
      <section className="pt-[140px] md:pt-[180px] pb-16 px-5 md:px-10 border-b border-navy/10">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <MonoLabel>[ catálogo ]</MonoLabel>
          </Reveal>
          <Reveal delay={1}>
            <EditorialHeading as="h1" size="xl" className="mt-6 max-w-[1200px]">
              Produtos <Italic accent>prontos</Italic> pra usar.
            </EditorialHeading>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-6 text-xl text-muted max-w-[640px] leading-relaxed">
              Explore por área ou use os filtros para encontrar o que você
              precisa.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── CATALOG ─── */}
      <section className="px-5 md:px-10 py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto">
          <CatalogClient products={products} />
        </div>
      </section>
    </>
  );
}
