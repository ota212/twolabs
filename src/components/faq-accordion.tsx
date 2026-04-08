"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Como recebo o produto?",
    answer:
      "Apos a compra, voce recebe acesso imediato na area 'Minha Conta'. Basta fazer login com o email usado na compra e clicar em 'Baixar'.",
  },
  {
    question: "Posso pedir reembolso?",
    answer:
      "Sim. Voce tem 7 dias de garantia incondicional. Se nao gostar, devolvemos 100% do valor.",
  },
  {
    question: "Preciso de algum software especifico?",
    answer:
      "Depende do produto. Planilhas funcionam no Excel ou Google Sheets. Cada produto lista os requisitos na descricao.",
  },
  {
    question: "Como entro em contato?",
    answer:
      "Envie um email para contato@doislabs.com.br. Respondemos em ate 24 horas uteis.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {FAQ_ITEMS.map((item, index) => (
        <div key={index} className="border border-navy/10 rounded">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full text-left px-4 py-3 font-bold flex items-center justify-between hover:bg-navy/5 transition-colors"
          >
            {item.question}
            <svg
              className={`w-5 h-5 text-navy/40 transition-transform ${
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
            <div className="px-4 pb-4 text-navy/70">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}
