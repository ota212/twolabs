"use client";

import { useState } from "react";

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FaqItem[] = items
    ? items.map((i) => ({ question: i.q, answer: i.a }))
    : DEFAULT_FAQ;

  return (
    <div className="space-y-2">
      {faqItems.map((item, index) => (
        <div key={index} className="border border-navy/10 rounded">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full text-left px-4 py-3 font-bold flex items-center justify-between hover:bg-navy/5 transition-colors"
          >
            {item.question}
            <svg
              className={`w-5 h-5 text-navy/40 flex-none transition-transform ${
                openIndex === index ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === index && (
            <div className="px-4 pb-4 text-navy/70 leading-relaxed">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}
