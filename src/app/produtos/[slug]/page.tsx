import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { createAnonClient } from "@/lib/supabase/server";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { BuyButton } from "@/components/buy-button";
import { FaqAccordion } from "@/components/faq-accordion";

export const revalidate = 60;

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data as Product | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Produto nao encontrado" };
  return {
    title: product.name,
    description: product.description?.slice(0, 160) ?? undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-[4/3] bg-navy/5 rounded-lg overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-navy/20">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <span className="text-sm uppercase tracking-wider text-navy/50 font-bold">
              {product.category}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mt-2">{product.name}</h1>
          <p className="text-3xl font-bold text-electric-blue mt-4">
            {formatPrice(product.price_cents)}
          </p>

          <div className="mt-6">
            <BuyButton productId={product.id} />
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-navy/60">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            7 dias de garantia incondicional
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Sobre o produto</h2>
          <div className="prose prose-navy max-w-none">
            <ReactMarkdown>{product.description}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>
        <FaqAccordion />
      </div>
    </div>
  );
}
