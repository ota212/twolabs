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
import { MonoLabel } from "@/components/mono-label";
import { EditorialHeading, Italic } from "@/components/editorial-heading";
import { Reveal } from "@/components/reveal";
import { PRODUCT_CONTENT } from "@/lib/product-content";

export const dynamic = "force-dynamic";

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

  if (!content) {
    return <FallbackLayout product={product} />;
  }

  const priceInBRL = (product.price_cents / 100).toFixed(2);

  return (
    <>
      <JsonLd
        schema={{
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
        }}
      />

      {/* ─── HERO ─── */}
      <section className="pt-[140px] pb-20 px-10 border-b border-navy/10">
        <div className="max-w-[1400px] mx-auto">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Produtos", href: "/produtos" },
              { label: product.name },
            ]}
          />
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-16 items-center mt-8">
            <div>
              <Reveal>
                {product.category && (
                  <MonoLabel>[ {product.category} ]</MonoLabel>
                )}
              </Reveal>
              <Reveal delay={1}>
                <EditorialHeading as="h1" size="xl" className="mt-6">
                  {product.name}
                </EditorialHeading>
              </Reveal>
              <Reveal delay={2}>
                <p className="mt-8 text-xl text-muted leading-relaxed max-w-[540px]">
                  {content.tagline}
                </p>
              </Reveal>
              <Reveal delay={3}>
                <div className="mt-12 flex items-baseline gap-4">
                  <span
                    className="font-serif italic text-navy"
                    style={{ fontSize: "clamp(48px, 6vw, 80px)", letterSpacing: "-0.02em", lineHeight: 1 }}
                  >
                    {formatPrice(product.price_cents)}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted">
                    pagamento único
                  </span>
                </div>
                <div className="mt-8 max-w-sm">
                  <BuyButton productId={product.id} />
                </div>
                <div className="mt-5 flex items-center gap-2 text-sm text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-electric-blue" />
                  7 dias de garantia incondicional
                </div>
              </Reveal>
            </div>

            <Reveal delay={2}>
              {content.heroImage ? (
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={content.heroImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-cream-2 grid place-items-center">
                  <svg className="w-24 h-24 text-navy/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── GALLERY ─── */}
      {content.gallery.length > 0 && (
        <section className="px-10 py-24 border-b border-navy/10">
          <div className="max-w-[1400px] mx-auto">
            <Reveal className="mb-12">
              <MonoLabel>[ galeria ]</MonoLabel>
              <EditorialHeading size="lg" className="mt-5">
                Veja <Italic>por dentro</Italic>.
              </EditorialHeading>
            </Reveal>
            <ImageGallery images={content.gallery} />
          </div>
        </section>
      )}

      {/* ─── HIGHLIGHTS ─── */}
      <section className="bg-cream-2 px-10 py-24 border-b border-navy/10">
        <div className="max-w-[1400px] mx-auto">
          <Reveal className="mb-16">
            <MonoLabel>[ destaques ]</MonoLabel>
            <EditorialHeading size="lg" className="mt-5">
              O que <Italic accent>você recebe</Italic>.
            </EditorialHeading>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.highlights.map((h, i) => (
              <Reveal key={i} delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
                <HighlightCard
                  icon={h.icon}
                  title={h.title}
                  description={h.description}
                  number={String(i + 1).padStart(2, "0")}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DETAILED SECTIONS ─── */}
      {content.sections.map((section, i) => (
        <section key={i} className="px-10 py-24 md:py-32 border-b border-navy/10">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16">
            <Reveal>
              <MonoLabel>[ 0{i + 1} ]</MonoLabel>
            </Reveal>
            <Reveal delay={1}>
              <EditorialHeading size="lg">{section.title}</EditorialHeading>
              <p className="mt-8 text-xl text-muted leading-relaxed max-w-[640px]">
                {section.content}
              </p>
              {section.items && (
                <div className="mt-10 space-y-1">
                  {section.items.map((item, j) => {
                    const [bold, ...rest] = item.split(" — ");
                    const label = bold.replace(/\*\*/g, "");
                    const desc = rest.join(" — ");
                    return (
                      <div
                        key={j}
                        className="grid grid-cols-[40px_1fr] gap-6 py-6 border-t border-navy/15 last:border-b"
                      >
                        <span className="font-mono text-sm text-electric-blue">
                          {String(j + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <span
                            className="font-serif italic"
                            style={{ fontSize: "clamp(20px, 1.6vw, 26px)", letterSpacing: "-0.01em" }}
                          >
                            {label}
                          </span>
                          {desc && (
                            <p className="mt-2 text-base text-muted leading-relaxed">
                              {desc}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Reveal>
          </div>
        </section>
      ))}

      {/* ─── AUDIENCE ─── */}
      <section className="bg-cream-2 px-10 py-24 md:py-32 border-b border-navy/10">
        <div className="max-w-[1400px] mx-auto">
          <Reveal className="mb-16">
            <MonoLabel>[ público ]</MonoLabel>
            <EditorialHeading size="xl" className="mt-5">
              Para <Italic>quem</Italic> é.
            </EditorialHeading>
          </Reveal>
          <div className="space-y-1">
            {content.audience.map((item, i) => (
              <Reveal
                key={i}
                delay={Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}
                className="grid grid-cols-[40px_1fr] gap-6 py-8 border-t border-navy/20 last:border-b"
              >
                <span className="font-mono text-sm text-electric-blue">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-lg md:text-xl text-navy leading-relaxed">{item}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REQUIREMENTS ─── */}
      {content.requirements && (
        <section className="px-10 py-12 border-b border-navy/10">
          <div className="max-w-[1400px] mx-auto text-center">
            <p className="text-sm text-muted">
              <span className="font-mono tracking-wider uppercase text-xs">
                Requisitos
              </span>{" "}
              — {content.requirements}
            </p>
          </div>
        </section>
      )}

      {/* ─── TESTIMONIALS ─── */}
      {content.testimonials && content.testimonials.length > 0 && (
        <section className="px-10 py-24 md:py-32 border-b border-navy/10">
          <div className="max-w-[1400px] mx-auto">
            <Reveal className="mb-16">
              <MonoLabel>[ depoimentos ]</MonoLabel>
              <EditorialHeading size="lg" className="mt-5">
                Quem <Italic>usa</Italic> fala.
              </EditorialHeading>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.testimonials.map((t, i) => (
                <Reveal key={i} delay={Math.min(i + 1, 3) as 1 | 2 | 3}>
                  <TestimonialCard name={t.name} role={t.role} text={t.text} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FAQ ─── */}
      <section className="px-10 py-24 md:py-32 border-b border-navy/10">
        <div className="max-w-[1000px] mx-auto">
          <Reveal className="mb-12">
            <MonoLabel>[ dúvidas ]</MonoLabel>
            <EditorialHeading size="lg" className="mt-5">
              Perguntas <Italic>frequentes</Italic>.
            </EditorialHeading>
          </Reveal>
          <Reveal delay={1}>
            <FaqAccordion items={content.faq} />
          </Reveal>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="bg-navy text-cream px-10 py-24 md:py-32 text-center">
        <Reveal className="max-w-[800px] mx-auto">
          <EditorialHeading as="h2" size="xl">
            Pronto pra <Italic accent>começar</Italic>?
          </EditorialHeading>
          <p className="mt-6 text-lg text-cream/60 italic font-serif max-w-md mx-auto">
            {content.closingLine}
          </p>
          <p
            className="mt-10 font-serif italic"
            style={{ fontSize: "clamp(48px, 6vw, 80px)", letterSpacing: "-0.02em", lineHeight: 1 }}
          >
            {formatPrice(product.price_cents)}
          </p>
          <p className="mt-3 font-mono text-xs uppercase tracking-wider text-cream/50">
            Pagamento único · Acesso imediato
          </p>
          <div className="mt-10 max-w-xs mx-auto">
            <BuyButton productId={product.id} />
          </div>
          <p className="mt-5 text-cream/40 text-sm">7 dias de garantia incondicional</p>
        </Reveal>
      </section>
    </>
  );
}

/* ─── Fallback ─── */
function FallbackLayout({ product }: { product: Product }) {
  return (
    <section className="pt-[140px] pb-24 px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="relative aspect-[4/3] bg-cream-2 overflow-hidden">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-navy/20">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            )}
          </div>
          <div>
            {product.category && <MonoLabel>[ {product.category} ]</MonoLabel>}
            <EditorialHeading as="h1" size="xl" className="mt-6">
              {product.name}
            </EditorialHeading>
            <p
              className="mt-10 font-serif italic text-electric-blue"
              style={{ fontSize: "clamp(40px, 5vw, 64px)", letterSpacing: "-0.02em", lineHeight: 1 }}
            >
              {formatPrice(product.price_cents)}
            </p>
            <div className="mt-8 max-w-sm">
              <BuyButton productId={product.id} />
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-electric-blue" />
              7 dias de garantia incondicional
            </div>
          </div>
        </div>
        {product.description && (
          <div className="mt-24 max-w-[780px]">
            <MonoLabel>[ sobre ]</MonoLabel>
            <EditorialHeading size="lg" className="mt-5 mb-8">
              Sobre o <Italic>produto</Italic>.
            </EditorialHeading>
            <div className="prose prose-navy max-w-none text-lg text-muted leading-relaxed">
              <ReactMarkdown>{product.description}</ReactMarkdown>
            </div>
          </div>
        )}
        <div className="mt-24 max-w-[1000px]">
          <MonoLabel>[ dúvidas ]</MonoLabel>
          <EditorialHeading size="lg" className="mt-5 mb-8">
            Perguntas <Italic>frequentes</Italic>.
          </EditorialHeading>
          <FaqAccordion />
        </div>
      </div>
    </section>
  );
}
