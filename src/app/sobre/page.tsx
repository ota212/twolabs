import type { Metadata } from "next";
import Link from "next/link";
import { MonoLabel } from "@/components/mono-label";
import { EditorialHeading, Italic } from "@/components/editorial-heading";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Dois Labs cria produtos digitais que funcionam sozinhos — planilhas, templates e ferramentas prontos para resolver problemas reais desde o primeiro uso.",
  alternates: { canonical: "https://doislabs.com.br/sobre" },
};

const DELIVER = [
  {
    n: "01",
    t: "Planilhas inteligentes",
    d: "Modelos Excel e Google Sheets com automação embutida. Sem macros complexas, sem VBA — só abrir e usar.",
  },
  {
    n: "02",
    t: "Documentos prontos",
    d: "Templates profissionais para quem não tem tempo de montar do zero. Edita, personaliza, usa.",
  },
  {
    n: "03",
    t: "Sempre crescendo",
    d: "Novos produtos chegam com frequência. Cada lançamento resolve um problema real de um público específico.",
  },
];

const AUDIENCE = [
  "Profissionais de saúde que precisam organizar o financeiro sem virar especialistas em planilha",
  "MEIs que querem controlar faturamento, DAS e despesas sem misturar com o pessoal",
  "Autônomos e freelancers que precisam de documentos profissionais sem pagar caro por isso",
  "Qualquer pessoa que quer resolver um problema específico — rápido, sem enrolação",
];

const GUARANTEES = [
  {
    t: "7 dias de garantia",
    d: "Não gostou? Devolvemos 100% do valor, sem perguntas e sem burocracia.",
  },
  {
    t: "Acesso imediato",
    d: "Assim que o pagamento é confirmado, o arquivo chega direto no seu e-mail.",
  },
  {
    t: "Pagamento seguro",
    d: "Processado pelo Stripe — padrão mundial em segurança para pagamentos online.",
  },
  {
    t: "Produtos testados",
    d: "Cada produto é validado em uso real antes de ser lançado. Sem beta, sem surpresa.",
  },
];

export default function SobrePage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="pt-[180px] pb-20 px-10">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <MonoLabel>[ 01 / manifesto ]</MonoLabel>
          </Reveal>
          <Reveal delay={1}>
            <EditorialHeading as="h1" size="display" className="mt-8 max-w-[1400px]">
              Produtos digitais que <Italic accent>funcionam</Italic>.
              <br />
              <Italic>Sem enrolação.</Italic>
            </EditorialHeading>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-10 text-xl md:text-2xl text-muted max-w-[640px] leading-relaxed">
              Ferramentas prontas para resolver problemas reais. Sem suporte,
              sem complicação. Comprou, usou, resolveu.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── MANIFESTO ─── */}
      <section className="bg-cream-2 px-5 md:px-10 py-24 md:py-32 border-y border-navy/10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16">
          <Reveal>
            <MonoLabel>[ 02 / por que existimos ]</MonoLabel>
          </Reveal>
          <Reveal delay={1}>
            <EditorialHeading size="lg">
              O mercado tem cursos demais e <Italic accent>ferramentas de menos</Italic>.
            </EditorialHeading>
            <div className="mt-10 space-y-5 text-xl text-muted leading-relaxed max-w-[640px]">
              <p>
                Tem conteúdo para todo lado, mas pouca coisa que você abre e já
                usa de verdade.
              </p>
              <p>
                A Dois Labs nasceu para preencher essa lacuna: criar produtos
                digitais que funcionam sozinhos. Sem suporte constante, sem
                curva de aprendizado longa, sem macros que quebram.
              </p>
              <p>
                Cada produto é pensado para um problema específico, de uma
                pessoa real — e construído para gerar resultado desde o
                primeiro uso.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── O QUE ENTREGAMOS ─── */}
      <section className="px-5 md:px-10 py-24 md:py-32 border-b border-navy/10">
        <div className="max-w-[1400px] mx-auto">
          <Reveal className="mb-20">
            <MonoLabel>[ 03 / entrega ]</MonoLabel>
            <EditorialHeading size="xl" className="mt-5">
              O que <Italic>entregamos</Italic>.
            </EditorialHeading>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DELIVER.map((item, i) => (
              <Reveal
                key={i}
                delay={(i + 1) as 1 | 2 | 3}
                className="py-10 border-t-2 border-navy"
              >
                <span className="font-mono text-xs text-muted">{item.n}</span>
                <h4
                  className="font-serif italic mt-4"
                  style={{
                    fontSize: "clamp(28px, 2.6vw, 40px)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {item.t}
                </h4>
                <p className="mt-5 text-base text-muted leading-relaxed">
                  {item.d}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARA QUEM ─── */}
      <section className="bg-cream-2 px-5 md:px-10 py-24 md:py-32 border-b border-navy/10">
        <div className="max-w-[1400px] mx-auto">
          <Reveal className="mb-16">
            <MonoLabel>[ 04 / público ]</MonoLabel>
            <EditorialHeading size="xl" className="mt-5">
              Para <Italic>quem</Italic> são.
            </EditorialHeading>
          </Reveal>
          <div className="space-y-1">
            {AUDIENCE.map((item, i) => (
              <Reveal
                key={i}
                delay={Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}
                className="grid grid-cols-[40px_1fr] gap-6 py-8 border-t border-navy/20 last:border-b"
              >
                <span className="font-mono text-sm text-electric-blue">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-lg md:text-xl text-navy leading-relaxed">
                  {item}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GARANTIAS ─── */}
      <section className="px-5 md:px-10 py-24 md:py-32 border-b border-navy/10">
        <div className="max-w-[1400px] mx-auto">
          <Reveal className="mb-16">
            <MonoLabel>[ 05 / confiança ]</MonoLabel>
            <EditorialHeading size="xl" className="mt-5">
              Compra <Italic>sem risco</Italic>.
            </EditorialHeading>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {GUARANTEES.map((g, i) => (
              <Reveal
                key={i}
                delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}
                className="p-10 border border-navy/10 bg-cream-2"
              >
                <h4
                  className="font-serif italic"
                  style={{
                    fontSize: "clamp(26px, 2.4vw, 36px)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {g.t}
                </h4>
                <p className="mt-4 text-base text-muted leading-relaxed">
                  {g.d}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-navy text-cream px-5 md:px-10 py-24 md:py-32 text-center">
        <Reveal className="max-w-[800px] mx-auto">
          <EditorialHeading as="h2" size="xl">
            Pronto pra <Italic accent>resolver</Italic>?
          </EditorialHeading>
          <p className="mt-6 text-lg text-cream/70">
            Vê todos os produtos disponíveis e encontra o que você precisa.
          </p>
          <Link
            href="/produtos"
            className="mt-10 inline-flex items-center gap-4 px-9 py-6 bg-electric-blue text-white rounded-full text-lg hover:brightness-110 transition-all"
          >
            Ver produtos
            <span className="text-xl">→</span>
          </Link>
        </Reveal>
      </section>
    </>
  );
}
