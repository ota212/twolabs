"use client";

import { useId, useMemo, useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const DEFAULT_FAQ: FaqItem[] = [
  {
    question: "Como recebo o produto?",
    answer:
      "Após a compra, você recebe acesso imediato na área 'Minha Conta'. Basta fazer login com o email usado na compra e clicar em 'Baixar'.",
  },
  {
    question: "Posso pedir reembolso?",
    answer:
      "Sim. Você tem 7 dias de garantia incondicional. Se não gostar, devolvemos 100% do valor.",
  },
  {
    question: "Preciso de algum software específico?",
    answer:
      "Depende do produto. Planilhas funcionam no Excel ou Google Sheets. Cada produto lista os requisitos na descrição.",
  },
  {
    question: "Como entro em contato?",
    answer:
      "Envie um email para contato@doislabs.com.br. Respondemos em até 24 horas úteis.",
  },
];

export function FaqAccordion({
  items,
  layout = "single",
  searchable = false,
}: {
  items?: { q: string; a: string }[];
  /** "two-column" splits items across 2 columns on md+ (each column tracks its own open state). */
  layout?: "single" | "two-column";
  /** Show search input above the accordion. */
  searchable?: boolean;
}) {
  const faqItems: FaqItem[] = items
    ? items.map((i) => ({ question: i.q, answer: i.a }))
    : DEFAULT_FAQ;

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return faqItems;
    const q = query.toLowerCase();
    return faqItems.filter(
      (it) =>
        it.question.toLowerCase().includes(q) ||
        it.answer.toLowerCase().includes(q)
    );
  }, [faqItems, query]);

  // Split across two columns by parity so ordering reads left-to-right-ish.
  const columns: FaqItem[][] =
    layout === "two-column"
      ? [filtered.filter((_, i) => i % 2 === 0), filtered.filter((_, i) => i % 2 === 1)]
      : [filtered];

  return (
    <div>
      {searchable && (
        <div className="mb-10 relative max-w-[520px]">
          <label htmlFor="faq-search" className="sr-only">
            Buscar na FAQ
          </label>
          <svg
            className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/50 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-4.3-4.3M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar uma pergunta..."
            className="w-full pl-7 pr-4 py-3 bg-transparent border-b border-navy/20 text-lg text-navy placeholder:text-navy/40 focus:outline-none focus:border-navy transition-colors"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="font-serif italic text-xl text-muted py-10">
          Nenhuma pergunta encontrada para “{query}”.
        </p>
      ) : layout === "two-column" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          {columns.map((col, ci) => (
            <FaqColumn key={ci} items={col} />
          ))}
        </div>
      ) : (
        <FaqColumn items={columns[0]} />
      )}
    </div>
  );
}

function FaqColumn({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const isLast = index === items.length - 1;
        const btnId = `${baseId}-btn-${index}`;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div
            key={index}
            className={`border-t border-navy ${isLast ? "border-b" : ""}`}
          >
            <button
              id={btnId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between text-left py-7 gap-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric-blue"
            >
              <span
                className="flex-1 min-w-0"
                style={{
                  fontSize: "clamp(17px, 1.6vw, 22px)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                }}
              >
                {item.question}
              </span>
              <span
                className="flex-none w-10 h-10 rounded-full grid place-items-center transition-all duration-300"
                style={{
                  background: isOpen ? "var(--color-electric-blue)" : "transparent",
                  border: isOpen ? "none" : "1px solid var(--color-navy)",
                  color: isOpen ? "white" : "var(--color-navy)",
                  transform: isOpen ? "rotate(45deg)" : "none",
                }}
                aria-hidden="true"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M7 1v12 M1 7h12" />
                </svg>
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className="grid transition-[grid-template-rows] duration-500 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="pb-7 pr-10 text-[16px] leading-relaxed text-navy/85 max-w-[640px]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
