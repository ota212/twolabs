import { redirect } from "next/navigation";
import Link from "next/link";
import { createAnonClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product-card";
import { JsonLd } from "@/components/json-ld";
import { Marquee } from "@/components/marquee";
import { MonoLabel } from "@/components/mono-label";
import { EditorialHeading, Italic } from "@/components/editorial-heading";
import { Reveal } from "@/components/reveal";
import { HighlightCard } from "@/components/highlight-card";
import { FaqAccordion } from "@/components/faq-accordion";
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
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-[180px] pb-20 px-10">
        <div className="max-w-[1400px] mx-auto w-full">
          <Reveal className="flex items-center gap-4 mb-10 flex-wrap">
            <span className="inline-flex items-center gap-2 px-3.5 py-2 border border-navy rounded-full text-xs tracking-[0.1em] uppercase">
              <span className="w-[7px] h-[7px] rounded-full bg-electric-blue animate-blink" />
              Produtos disponíveis
            </span>
            <MonoLabel>[ 01 / marketplace de produtos digitais ]</MonoLabel>
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

          <div className="mt-16 flex flex-wrap gap-12 items-end">
            <Reveal delay={2}>
              <p className="text-xl leading-relaxed text-muted max-w-[480px]">
                Planilhas, templates e ferramentas prontas pra resolver
                problemas reais. Comprou, baixou, usou — sem enrolação.
              </p>
            </Reveal>

            <Reveal delay={3} className="flex flex-col gap-3">
              <Link
                href="/produtos"
                className="group inline-flex items-center gap-4 px-8 py-5 bg-navy text-cream rounded-full text-base tracking-[-0.01em] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Ver todos os produtos
                <span className="w-[34px] h-[34px] rounded-full bg-electric-blue grid place-items-center text-white text-sm">
                  →
                </span>
              </Link>
              <span className="font-mono text-[11px] text-muted pl-2">
                Pagamento único · Acesso imediato · Garantia de 7 dias.
              </span>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── TICKER ─── */}
      <section className="bg-navy text-cream border-y border-navy">
        <div
          className="py-7 font-serif italic"
          style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.02em" }}
        >
          <Marquee speed={45}>
            <span>Comprar</span>
            <span className="text-electric-blue mx-8">·</span>
            <span>Baixar</span>
            <span className="text-electric-blue mx-8">·</span>
            <span>Usar</span>
            <span className="text-electric-blue mx-8">·</span>
            <span>Automatizar</span>
            <span className="text-electric-blue mx-8">·</span>
            <span>Resolver</span>
            <span className="text-electric-blue mx-8">·</span>
          </Marquee>
        </div>
      </section>

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

      {/* ─── QUOTE ─── */}
      <section className="bg-navy text-cream px-10 py-24 md:py-32">
        <Reveal className="max-w-[1200px] mx-auto">
          <div className="flex gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="text-2xl text-electric-blue">
                ★
              </span>
            ))}
          </div>
          <blockquote
            className="font-serif italic"
            style={{
              fontSize: "clamp(32px, 4.5vw, 64px)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              maxWidth: 1100,
            }}
          >
            “A planilha MEI resolveu em uma tarde o que eu vinha empurrando com
            a barriga há meses. Abri, preenchi, entendi o meu negócio —
            literalmente hoje mesmo.”
          </blockquote>
          <div className="mt-12 flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-cream text-navy grid place-items-center font-bold">
              MC
            </div>
            <div>
              <div className="text-base">Mariana C.</div>
              <div className="font-mono text-sm text-cream/70">
                MEI · São Paulo/SP
              </div>
            </div>
          </div>
        </Reveal>
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
            <Reveal
              key={i}
              delay={(i + 1) as 1 | 2 | 3}
              className={`grid grid-cols-[60px_1fr_2fr_40px] md:grid-cols-[80px_1fr_2fr_80px] gap-6 md:gap-10 items-center py-10 border-t border-navy/20 ${
                i === PROCESS.length - 1 ? "border-b" : ""
              }`}
            >
              <span className="font-mono text-sm text-electric-blue">{p.n}</span>
              <h4 className="text-[clamp(22px,2.4vw,36px)] tracking-[-0.02em] font-medium">
                {p.t}
              </h4>
              <p className="text-lg text-muted leading-relaxed">{p.d}</p>
              <span className="text-3xl text-right opacity-40">→</span>
            </Reveal>
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
            <FaqAccordion items={HOME_FAQ} />
          </Reveal>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="relative overflow-hidden bg-navy text-cream px-10 py-24 md:py-32">
        <div
          className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #3B82F6, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div className="max-w-[1400px] mx-auto relative">
          <Reveal className="flex items-center gap-3 mb-14">
            <span className="w-[7px] h-[7px] rounded-full bg-electric-blue" />
            <MonoLabel className="text-cream/70">PRÓXIMO PASSO</MonoLabel>
          </Reveal>
          <Reveal delay={1}>
            <EditorialHeading as="h2" size="display" className="max-w-[1400px]">
              O produto certo <Italic accent>resolve na hora</Italic>. A gente
              te entrega ele.
            </EditorialHeading>
          </Reveal>
          <Reveal delay={2} className="mt-20 flex flex-wrap items-center gap-10">
            <Link
              href="/produtos"
              className="inline-flex items-center gap-4 px-9 py-6 bg-electric-blue text-white rounded-full text-lg hover:brightness-110 transition-all"
            >
              Ver todos os produtos
              <span className="text-xl">→</span>
            </Link>
            <div>
              <div className="text-sm text-cream/60">Dúvidas antes de comprar?</div>
              <a
                href="mailto:contato@doislabs.com.br"
                className="text-xl border-b border-electric-blue pb-0.5"
              >
                contato@doislabs.com.br
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
