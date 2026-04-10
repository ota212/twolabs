import type { Metadata } from "next";
import Link from "next/link";
import { HighlightCard } from "@/components/highlight-card";
import { FadeIn } from "@/components/fade-in";
import { Breadcrumb } from "@/components/breadcrumb";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Dois Labs cria produtos digitais que funcionam sozinhos — planilhas, templates e ferramentas prontos para resolver problemas reais desde o primeiro uso.",
  alternates: { canonical: "https://doislabs.com.br/sobre" },
};

export default function SobrePage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="bg-navy text-white">
        <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Sobre" },
            ]}
          />
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Produtos digitais que funcionam
          </h1>
          <p className="mt-4 text-lg text-white/70 leading-relaxed max-w-xl">
            Ferramentas prontas para resolver problemas reais. Sem suporte,
            sem complicação. Comprou, usou, resolveu.
          </p>
        </div>
      </section>

      {/* ─── Missão ─── */}
      <section className="bg-cream">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Por que a Dois Labs existe
          </h2>
          <div className="space-y-4 text-navy/70 text-lg leading-relaxed">
            <p>
              O mercado tem cursos demais e ferramentas de menos. Tem conteúdo
              para todo lado, mas pouca coisa que você abre e já usa de verdade.
            </p>
            <p>
              A Dois Labs nasceu para preencher essa lacuna: criar produtos
              digitais que funcionam sozinhos. Sem precisar de suporte constante,
              sem curva de aprendizado longa, sem macros que quebram.
            </p>
            <p>
              Cada produto é pensado para um problema específico, de uma pessoa
              real — e construído para gerar resultado desde o primeiro uso.
            </p>
          </div>
        </div>
      </section>

      {/* ─── O que entregamos ─── */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            O que entregamos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <FadeIn delay={0}>
              <HighlightCard
                icon="chart"
                title="Planilhas inteligentes"
                description="Modelos Excel e Google Sheets com automação embutida. Sem macros complexas, sem VBA — só abrir e usar."
              />
            </FadeIn>
            <FadeIn delay={80}>
              <HighlightCard
                icon="file"
                title="Documentos prontos"
                description="Templates profissionais para quem não tem tempo de montar do zero. Edita, personaliza, usa."
              />
            </FadeIn>
            <FadeIn delay={160}>
              <HighlightCard
                icon="zap"
                title="Sempre crescendo"
                description="Novos produtos chegam com frequência. Cada lançamento resolve um problema real de um público específico."
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Para quem ─── */}
      <section className="bg-cream">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Para quem são</h2>
          <div className="space-y-4">
            {[
              "Profissionais de saúde que precisam organizar o financeiro sem virar especialistas em planilha",
              "MEIs que querem controlar faturamento, DAS e despesas sem misturar com o pessoal",
              "Autônomos e freelancers que precisam de documentos profissionais sem pagar caro por isso",
              "Qualquer pessoa que quer resolver um problema específico — rápido, sem enrolação",
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div className="flex gap-3 items-start">
                  <svg
                    className="w-5 h-5 text-electric-blue flex-none mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-navy/80">{item}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Garantias ─── */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Compra sem risco
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                ),
                title: "7 dias de garantia",
                description:
                  "Não gostou? Devolvemos 100% do valor, sem perguntas e sem burocracia.",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
                title: "Acesso imediato",
                description:
                  "Assim que o pagamento é confirmado, o arquivo chega direto no seu e-mail.",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                ),
                title: "Pagamento seguro",
                description:
                  "Processado pelo Stripe — padrão mundial em segurança para pagamentos online.",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                ),
                title: "Produtos testados",
                description:
                  "Cada produto é validado em uso real antes de ser lançado. Sem beta, sem surpresa.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="flex gap-4 p-5 bg-navy/3 rounded-lg border border-navy/5">
                  <div className="w-10 h-10 bg-electric-blue/10 text-electric-blue rounded-lg flex items-center justify-center flex-none">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{item.title}</h3>
                    <p className="text-navy/60 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-navy text-white">
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Pronto para resolver?
          </h2>
          <p className="text-white/60 mb-8">
            Veja todos os produtos disponíveis e encontre o que você precisa.
          </p>
          <Link
            href="/produtos"
            className="inline-block bg-electric-blue text-white font-bold px-8 py-4 rounded text-lg hover:bg-electric-blue/90 transition-colors"
          >
            Ver produtos
          </Link>
        </div>
      </section>
    </>
  );
}
