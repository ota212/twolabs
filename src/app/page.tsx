import Link from "next/link";
import Image from "next/image";
import { createAnonClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product-card";
import { JsonLd } from "@/components/json-ld";
import { Product } from "@/types";

export const metadata = {
  alternates: { canonical: "https://doislabs.com.br" },
};

export const revalidate = 60;

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3);
  return (data as Product[]) ?? [];
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <>
      <JsonLd schema={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://doislabs.com.br/#organization",
            name: "Dois Labs",
            url: "https://doislabs.com.br",
            email: "contato@doislabs.com.br",
            logo: { "@type": "ImageObject", url: "https://doislabs.com.br/favicon.svg" },
          },
          {
            "@type": "WebSite",
            "@id": "https://doislabs.com.br/#website",
            url: "https://doislabs.com.br",
            name: "Dois Labs",
            publisher: { "@id": "https://doislabs.com.br/#organization" },
            potentialAction: {
              "@type": "SearchAction",
              target: { "@type": "EntryPoint", urlTemplate: "https://doislabs.com.br/produtos?q={search_term_string}" },
              "query-input": "required name=search_term_string",
            },
          },
        ],
      }} />

      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Produtos digitais que trabalham por você.
              </h1>
              <p className="mt-6 text-lg text-white/80 leading-relaxed">
                Ferramentas prontas para usar, construídas com automação e IA. Do problema à solução — sem enrolação.
              </p>
              <Link
                href="/produtos"
                className="inline-block mt-8 bg-electric-blue text-white font-bold px-8 py-3 rounded hover:bg-electric-blue/90 transition-colors"
              >
                Ver Produtos
              </Link>
            </div>
            <div className="hidden lg:block relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/images/planilha/hero.jpg"
                alt="Planilha Financeira para Psicólogos"
                fill
                className="object-cover"
                priority
                sizes="50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-white border-b border-navy/5">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-sm text-navy/60">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Pagamento seguro via Stripe
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              7 dias de garantia incondicional
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Acesso imediato após a compra
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Nossos Produtos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/produtos" className="text-electric-blue font-bold hover:underline">
              Ver todos os produtos →
            </Link>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Dois Labs</h2>
          <p className="text-navy/70 max-w-2xl mx-auto text-lg">
            Construímos produtos digitais automatizados que
            resolvem problemas reais — sem enrolação.
          </p>
        </div>
      </section>
    </>
  );
}
