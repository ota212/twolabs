import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { createAnonClient } from "@/lib/supabase/server";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { BuyButton } from "@/components/buy-button";
import { FaqAccordion } from "@/components/faq-accordion";
import { ImageGallery } from "@/components/image-gallery";
import { HighlightCard } from "@/components/highlight-card";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumb } from "@/components/breadcrumb";
import { TestimonialCard } from "@/components/testimonial-card";
import { FadeIn } from "@/components/fade-in";
import { PRODUCT_CONTENT } from "@/lib/product-content";

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
  if (!product) return { title: "Produto não encontrado" };
  const content = PRODUCT_CONTENT[slug];
  const description = content?.tagline ?? product.description?.slice(0, 160) ?? undefined;
  const image = content?.heroImage ?? null;
  return {
    title: product.name,
    description,
    alternates: { canonical: `https://doislabs.com.br/produtos/${slug}` },
    openGraph: {
      title: product.name,
      description: description ?? undefined,
      url: `https://doislabs.com.br/produtos/${slug}`,
      ...(image && { images: [{ url: image, width: 1200, height: 630, alt: product.name }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: description ?? undefined,
      ...(image && { images: [image] }),
    },
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

  const content = PRODUCT_CONTENT[slug];

  // DEBUG: log para diagnóstico (remover depois)
  console.log("[ProductPage] slug:", slug, "| content keys:", Object.keys(PRODUCT_CONTENT).join(", "), "| found:", !!content);

  // Fallback: se não tem conteúdo estruturado, renderiza layout simples
  if (!content) {
    return <FallbackLayout product={product} />;
  }

  const priceInBRL = (product.price_cents / 100).toFixed(2);

  return (
    <>
      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: content?.tagline ?? product.description ?? undefined,
        image: content?.heroImage ? `https://doislabs.com.br${content.heroImage}` : undefined,
        url: `https://doislabs.com.br/produtos/${slug}`,
        brand: { "@type": "Brand", name: "Dois Labs" },
        offers: {
          "@type": "Offer",
          price: priceInBRL,
          priceCurrency: "BRL",
          availability: "https://schema.org/InStock",
          seller: { "@type": "Organization", name: "Dois Labs" },
        },
      }} />

      {/* ─── Hero ─── */}
      <section className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "Produtos", href: "/produtos" },
            { label: product.name },
          ]} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {product.category && (
                <span className="inline-block text-xs uppercase tracking-widest text-electric-blue font-bold mb-4">
                  {product.category}
                </span>
              )}
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                {product.name}
              </h1>
              <p className="mt-4 text-lg text-white/80 leading-relaxed">
                {content.tagline}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <p className="text-4xl font-bold text-white">
                  {formatPrice(product.price_cents)}
                </p>
              </div>
              <div className="mt-6 max-w-sm">
                <BuyButton productId={product.id} />
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-white/50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                7 dias de garantia incondicional
              </div>
            </div>

            {/* Hero image */}
            <div className="hidden lg:block">
              {content.heroImage ? (
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={content.heroImage}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg shadow-2xl"
                    sizes="(max-width: 1024px) 0px, 50vw"
                    priority
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-white/5 rounded-lg flex items-center justify-center">
                  <svg className="w-24 h-24 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Gallery ─── */}
      {content.gallery.length > 0 && (
        <section className="bg-cream">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold mb-6">Veja por dentro</h2>
            <ImageGallery images={content.gallery} />
          </div>
        </section>
      )}

      {/* ─── Highlights ─── */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.highlights.map((h, i) => (
              <FadeIn key={i} delay={i * 80}>
                <HighlightCard icon={h.icon} title={h.title} description={h.description} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Detailed sections ─── */}
      {content.sections.map((section, i) => (
        <section key={i} className="bg-cream">
          <div className="max-w-3xl mx-auto px-4 py-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{section.title}</h2>
            <p className="text-navy/70 text-lg mb-8">{section.content}</p>
            {section.items && (
              <div className="space-y-4">
                {section.items.map((item, j) => {
                  const [bold, ...rest] = item.split(" — ");
                  const label = bold.replace(/\*\*/g, "");
                  const desc = rest.join(" — ");
                  return (
                    <div key={j} className="flex gap-3">
                      <svg className="w-5 h-5 text-electric-blue flex-none mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <span className="font-bold">{label}</span>
                        {desc && <span className="text-navy/60"> — {desc}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      ))}

      {/* ─── Audience ─── */}
      <section className="bg-navy/5">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Para quem é</h2>
          <div className="space-y-4">
            {content.audience.map((item, i) => (
              <div key={i} className="flex gap-3">
                <svg className="w-5 h-5 text-green-600 flex-none mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-navy/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Requirements ─── */}
      {content.requirements && (
        <section className="bg-white">
          <div className="max-w-3xl mx-auto px-4 py-12 text-center">
            <p className="text-navy/50 text-sm">
              <span className="font-bold">Requisitos:</span> {content.requirements}
            </p>
          </div>
        </section>
      )}

      {/* ─── Testimonials ─── */}
      {content.testimonials && content.testimonials.length > 0 && (
        <section className="bg-cream">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">O que dizem quem usa</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.testimonials.map((t, i) => (
                <FadeIn key={i} delay={i * 100}>
                  <TestimonialCard name={t.name} role={t.role} text={t.text} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA Final ─── */}
      <section className="bg-navy text-white">
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <p className="text-3xl font-bold mb-2">{formatPrice(product.price_cents)}</p>
          <p className="text-white/50 text-sm mb-6">Pagamento único · Acesso imediato</p>
          <div className="max-w-xs mx-auto">
            <BuyButton productId={product.id} />
          </div>
          <p className="mt-4 text-white/40 text-sm">7 dias de garantia incondicional</p>
          <p className="mt-8 text-white/50 italic text-sm max-w-md mx-auto">
            {content.closingLine}
          </p>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="bg-cream">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>
          <FaqAccordion items={content.faq} />
        </div>
      </section>
    </>
  );
}

/* ─── Fallback para produtos sem conteúdo estruturado ─── */
function FallbackLayout({ product }: { product: Product }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-[4/3] bg-navy/5 rounded-lg overflow-hidden">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-navy/20">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
        </div>
        <div>
          {product.category && (
            <span className="text-sm uppercase tracking-wider text-navy/50 font-bold">{product.category}</span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mt-2">{product.name}</h1>
          <p className="text-3xl font-bold text-electric-blue mt-4">{formatPrice(product.price_cents)}</p>
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
      {product.description && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Sobre o produto</h2>
          <div className="prose prose-navy max-w-none">
            <ReactMarkdown>{product.description}</ReactMarkdown>
          </div>
        </div>
      )}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>
        <FaqAccordion />
      </div>
    </div>
  );
}
