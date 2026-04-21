"use client";

import { useId, useState } from "react";

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

export function FaqAccordion({ items }: { items?: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  const faqItems: FaqItem[] = items
    ? items.map((i) => ({ question: i.q, answer: i.a }))
    : DEFAULT_FAQ;

  return (
    <div>
      {faqItems.map((item, index) => {
        const isOpen = openIndex === index;
        const isLast = index === faqItems.length - 1;
        const btnId = `${baseId}-btn-${index}`;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div
            key={index}
            className={`border-t border-navy ${isLast ? "border-b" : ""}`}
          >
            <button
              id={btnId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between text-left py-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric-blue"
            >
              <span
                className="pr-6"
                style={{
                  fontSize: "clamp(18px, 1.8vw, 24px)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                }}
              >
                {item.question}
              </span>
              <span
                className="flex-none w-11 h-11 rounded-full grid place-items-center transition-all duration-300"
                style={{
                  background: isOpen ? "var(--color-electric-blue)" : "transparent",
                  border: isOpen ? "none" : "1px solid var(--color-navy)",
                  color: isOpen ? "white" : "var(--color-navy)",
                  transform: isOpen ? "rotate(45deg)" : "none",
                }}
                aria-hidden="true"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
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
                <p className="pb-8 pr-16 text-[17px] leading-relaxed text-navy/80 max-w-[780px]">
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
