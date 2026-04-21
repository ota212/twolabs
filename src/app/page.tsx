import { redirect } from "next/navigation";
import Link from "next/link";
import { createAnonClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product-card";
import { JsonLd } from "@/components/json-ld";
import { TrustStrip } from "@/components/trust-strip";
import { TrustBar } from "@/components/trust-bar";
import { GuaranteeBadge } from "@/components/guarantee-badge";
import { MonoLabel } from "@/components/mono-label";
import { EditorialHeading, Italic } from "@/components/editorial-heading";
import { Reveal } from "@/components/reveal";
import { HighlightCard } from "@/components/highlight-card";
import { FaqAccordion } from "@/components/faq-accordion";
import { ProcessStep } from "@/components/process-step";
import { TestimonialCard, type Testimonial } from "@/components/testimonial-card";
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

const BENEFITS = [
  {
    n: "01",
    t: "Pronto pra usar",
    d: "Abre no Excel ou Google Sheets, configura em 5 minutos e começa a resolver o problema no mesmo dia.",
  },
  {
    n: "02",
    t: "Sem macros",
    d: "Nenhum script esquisito pra quebrar. Planilhas puras, documentos editáveis, templates que funcionam em qualquer computador.",
  },
  {
    n: "03",
    t: "Acesso imediato",
    d: "Pagou e já é seu pra sempre. Download na hora, suporte por email e garantia incondicional de 7 dias.",
  },
];

const PROCESS = [
  {
    n: "01",
    t: "Escolher",
    d: "Navegue pelas áreas e encontre o produto que resolve o seu problema específico.",
  },
  {
    n: "02",
    t: "Comprar",
    d: "Checkout em um clique via Stripe. Pagamento seguro, sem cadastro longo.",
  },
  {
    n: "03",
    t: "Usar",
    d: "Arquivo chega no seu email em segundos. Abre, personaliza e já tá rodando.",
  },
];

const HOME_TESTIMONIALS: Testimonial[] = [
  {
    name: "Mariana C.",
    role: "MEI · Comércio",
    location: "São Paulo/SP",
    rating: 5,
    text:
      "A planilha MEI resolveu em uma tarde o que eu vinha empurrando há meses. Abri, preenchi, entendi o meu negócio — hoje mesmo.",
  },
  {
    name: "Rafael B.",
    role: "Dentista MEI",
    location: "Belo Horizonte/MG",
    rating: 5,
    text:
      "Parei de misturar pessoa física com CNPJ. Em 2 semanas eu já sabia exatamente quanto sobrava no fim do mês.",
  },
  {
    name: "Júlia S.",
    role: "Psicóloga · Autônoma",
    location: "Curitiba/PR",
    rating: 5,
    text:
      "Comprei o template de recibo e contrato — 15 minutos depois mandei pro meu primeiro paciente novo. Profissional, sem gastar com advogado de cara.",
  },
  {
    name: "Eduardo L.",
    role: "MEI · Serviços",
    location: "Recife/PE",
    rating: 4.5,
    text:
      "Planilha abre no Google Sheets sem quebrar nada. Uso no celular mesmo quando tô na rua. Melhor investimento de R$ 49 que fiz.",
  },
];

const HOME_FAQ = [
  {
    q: "Quais formatos de arquivo vocês entregam?",
    a: "Planilhas em .xlsx (funcionam em Excel e Google Sheets). Documentos em .docx ou PDF. Cada produto mostra o formato na página de detalhes.",
  },
  {
    q: "E se eu não gostar do produto?",
    a: "7 dias de garantia incondicional. Manda um email e devolvemos 100% do valor, sem perguntas.",
  },
  {
    q: "Tem suporte técnico?",
    a: "Sim. Envia um email pra contato@doislabs.com.br e respondemos em até 24 horas úteis. A maioria dos produtos vem com um guia dentro que cobre 90% das dúvidas.",
  },
  {
    q: "Posso personalizar as planilhas?",
    a: "Pode. Todas as nossas planilhas são abertas pra edição. Você altera fórmulas, adiciona abas, muda cores — é seu arquivo.",
  },
  {
    q: "Vocês lançam produtos novos?",
    a: "Sim, regularmente. Cada lançamento resolve um problema específico. Acompanhe pelo Instagram ou cadastre-se na newsletter.",
  },
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  if (code) redirect(`/auth/callback?code=${code}`);

  const products = await getFeaturedProducts();

  return (
    <>
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://doislabs.com.br/#organization",
              name: "Dois Labs",
              url: "https://doislabs.com.br",
              email: "contato@doislabs.com.br",
              logo: {
                "@type": "ImageObject",
                url: "https://doislabs.com.br/favicon.svg",
              },
            },
            {
              "@type": "WebSite",
              "@id": "https://doislabs.com.br/#website",
              url: "https://doislabs.com.br",
              name: "Dois Labs",
              publisher: { "@id": "https://doislabs.com.br/#organization" },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://doislabs.com.br/produtos?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            },
          ],
        }}
      />

      {/* ─── HERO ─── */}
      <section className="relative min-h-[75vh] flex flex-col justify-center overflow-hidden pt-[160px] pb-14 px-10">
        <div className="max-w-[1400px] mx-auto w-full">
          <Reveal className="flex items-center gap-4 mb-8 flex-wrap">
            <span className="inline-flex items-center gap-2 px-3.5 py-2 border border-navy rounded-full text-xs tracking-[0.1em] uppercase">
              <span className="w-[7px] h-[7px] rounded-full bg-electric-blue animate-blink" />
              Produtos disponíveis
            </span>
            <MonoLabel>[ 01 / catálogo de produtos digitais ]</MonoLabel>
          </Reveal>

          <Reveal delay={1}>
            <EditorialHeading as="h1" size="display" className="max-w-[1400px]">
              <span>Produtos digitais que </span>
              <Italic accent>funcionam</Italic>
              <br />
              <span>sozinhos, </span>
              <Italic>do dia um.</Italic>
            </EditorialHeading>
          </Reveal>

          <div className="mt-10 flex flex-wrap gap-10 items-end">
            <Reveal delay={2}>
              <p className="text-xl leading-relaxed text-navy/75 max-w-[480px]">
                Planilhas, templates e ferramentas prontas pra resolver
                problemas reais. Comprou, baixou, usou — sem enrolação.
              </p>
            </Reveal>

            <Reveal delay={3} className="flex flex-wrap items-center gap-4">
              <Link
                href="/produtos"
                className="group inline-flex items-center gap-4 px-8 py-5 bg-navy text-cream rounded-full text-base tracking-[-0.01em] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric-blue"
              >
                Ver todos os produtos
                <span className="w-[34px] h-[34px] rounded-full bg-electric-blue grid place-items-center text-white text-sm">
                  →
                </span>
              </Link>
              <GuaranteeBadge variant="dark" />
            </Reveal>
          </div>

          <Reveal delay={3} className="mt-12 pt-8 border-t border-navy/10">
            <TrustBar variant="dark" />
          </Reveal>
        </div>
      </section>

      {/* ─── TRUST STRIP (replaces decorative marquee) ─── */}
      <TrustStrip />

      {/* ─── INTRO ─── */}
      <section className="px-10 py-24 md:py-32 border-b border-navy/10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16">
          <Reveal>
            <MonoLabel>[ 02 / por que dois labs ]</MonoLabel>
          </Reveal>
          <Reveal delay={1}>
            <EditorialHeading size="lg">
              Construído para quem quer{" "}
              <Italic accent>resolver rápido</Italic> — sem curso, sem
              consultoria, sem enrolação.
            </EditorialHeading>
            <p className="mt-10 text-xl text-muted max-w-[640px] leading-relaxed">
              O mercado tem cursos demais e ferramentas de menos. A gente faz o
              caminho oposto: entrega a ferramenta pronta, com a automação
              embutida, pra você começar a resolver desde o primeiro uso.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── BENEFITS ─── */}
      <section className="px-10 py-24 md:py-32 border-b border-navy/10">
        <div className="max-w-[1400px] mx-auto">
          <Reveal className="flex justify-between items-end mb-20 flex-wrap gap-5">
            <EditorialHeading size="md">
              O que você <Italic>ganha</Italic>
            </EditorialHeading>
            <MonoLabel>03 benefícios / em todo produto</MonoLabel>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] bg-navy/10 border border-navy/10">
            {BENEFITS.map((b, i) => (
              <Reveal key={i} delay={(i + 1) as 1 | 2 | 3}>
                <HighlightCard
                  icon="zap"
                  number={b.n}
                  title={b.t}
                  description={b.d}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      {products.length > 0 && (
        <section className="px-10 py-24 md:py-32 border-b border-navy/10">
          <div className="max-w-[1400px] mx-auto">
            <Reveal className="flex justify-between items-end mb-16 flex-wrap gap-5">
              <div>
                <MonoLabel>[ 03 / catálogo ]</MonoLabel>
                <EditorialHeading size="xl" className="mt-5">
                  Produtos <Italic>em destaque</Italic>.
                </EditorialHeading>
              </div>
              <Link
                href="/produtos"
                className="font-mono text-[13px] tracking-[0.1em] uppercase border-b-2 border-electric-blue pb-1 hover:text-electric-blue transition-colors"
              >
                Ver todos →
              </Link>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, i) => (
                <Reveal
                  key={product.id}
                  delay={Math.min(i + 1, 3) as 1 | 2 | 3}
                >
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── TESTIMONIALS ─── */}
      <section className="px-10 py-24 md:py-32 border-b border-navy/10">
        <div className="max-w-[1400px] mx-auto">
          <Reveal className="flex justify-between items-end mb-16 flex-wrap gap-5">
            <div>
              <MonoLabel>[ 03.1 / depoimentos ]</MonoLabel>
              <EditorialHeading size="xl" className="mt-5">
                Quem usa <Italic>fala</Italic>.
              </EditorialHeading>
            </div>
            <p className="font-mono text-[12px] tracking-wider uppercase text-muted max-w-[260px]">
              4.9/5 · +200 avaliações verificadas
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOME_TESTIMONIALS.map((t, i) => (
              <Reveal
                key={i}
                delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}
              >
                <TestimonialCard {...t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="bg-cream-2 px-10 py-24 md:py-32 border-b border-navy/10">
        <div className="max-w-[1400px] mx-auto">
          <Reveal className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 mb-16">
            <MonoLabel>[ 04 / processo ]</MonoLabel>
            <EditorialHeading size="lg">
              Três passos. <Italic>Zero fricção</Italic>.
            </EditorialHeading>
          </Reveal>
          {PROCESS.map((p, i) => (
            <ProcessStep key={i} step={p} index={i} total={PROCESS.length} />
          ))}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="px-10 py-24 md:py-32 border-b border-navy/10">
        <div className="max-w-[1200px] mx-auto">
          <Reveal className="mb-20">
            <MonoLabel>[ 05 / faq ]</MonoLabel>
            <EditorialHeading size="xl" className="mt-5">
              Perguntas <Italic>frequentes</Italic>.
            </EditorialHeading>
          </Reveal>
          <Reveal delay={1}>
            <FaqAccordion items={HOME_FAQ} layout="two-column" searchable />
          </Reveal>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="relative isolate overflow-hidden bg-navy text-cream px-10 py-28 md:py-36">
        {/* Mesh: 3 layered radial blobs */}
        <div
          aria-hidden="true"
          className="absolute -top-32 -right-20 w-[620px] h-[620px] rounded-full opacity-40 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #3B82F6 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-40 -left-24 w-[540px] h-[540px] rounded-full opacity-30 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #2D4F73 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #6B7A8C 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Grain/noise overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            backgroundSize: "180px 180px",
          }}
        />
        {/* Geometric accent: thin circle in corner */}
        <svg
          aria-hidden="true"
          className="absolute -top-16 -left-16 w-[360px] h-[360px] text-electric-blue/15 pointer-events-none"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
        >
          <circle cx="50" cy="50" r="48" />
          <circle cx="50" cy="50" r="34" />
          <circle cx="50" cy="50" r="20" />
        </svg>

        <div className="max-w-[1400px] mx-auto relative">
          <Reveal className="flex items-center gap-3 mb-14">
            <span className="w-[7px] h-[7px] rounded-full bg-electric-blue animate-blink" />
            <MonoLabel className="text-cream/70">próximo passo</MonoLabel>
          </Reveal>
          <Reveal delay={1}>
            <EditorialHeading as="h2" size="display" className="max-w-[1400px]">
              O produto certo <Italic accent>resolve na hora</Italic>. A gente
              te entrega ele.
            </EditorialHeading>
          </Reveal>
          <Reveal delay={2} className="mt-20 flex flex-wrap items-center gap-6">
            <Link
              href="/produtos"
              className="inline-flex items-center gap-4 px-9 py-6 bg-electric-blue text-white rounded-full text-lg hover:brightness-110 transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)]"
            >
              Ver todos os produtos
              <span className="text-xl">→</span>
            </Link>
            <GuaranteeBadge variant="light" />
          </Reveal>

          <Reveal
            delay={3}
            className="mt-16 pt-10 border-t border-cream/15 flex flex-wrap items-center justify-between gap-6"
          >
            <div className="flex items-center gap-5">
              <span className="flex-none w-12 h-12 rounded-full bg-cream/10 border border-cream/20 grid place-items-center text-electric-blue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </span>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-cream/60">
                  Dúvidas antes de comprar?
                </div>
                <a
                  href="mailto:contato@doislabs.com.br"
                  className="inline-flex items-center gap-2 mt-1 font-serif italic text-cream hover:text-electric-blue transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric-blue"
                  style={{ fontSize: "clamp(22px, 2.2vw, 32px)", letterSpacing: "-0.02em" }}
                >
                  contato@doislabs.com.br
                  <span className="text-base not-italic" aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-cream/50 max-w-[260px]">
              resposta em até 24h úteis · seg–sex
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
