import Link from "next/link";
import { createAnonClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product-card";
import { Product } from "@/types";

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
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 py-24 md:py-32">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
            Produtos digitais que rodam sozinhos.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl">
            Ferramentas prontas para usar. Automatizadas com IA, feitas para quem
            quer resultados sem complicação.
          </p>
          <Link
            href="/produtos"
            className="inline-block mt-8 bg-electric-blue text-white font-bold px-8 py-3 rounded hover:bg-electric-blue/90 transition-colors"
          >
            Ver Produtos
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Dois Labs</h2>
          <p className="text-navy/70 max-w-2xl mx-auto text-lg">
            Somos Leo e Otávio. Construímos produtos digitais automatizados que
            resolvem problemas reais — sem enrolação.
          </p>
        </div>
      </section>
    </>
  );
}
