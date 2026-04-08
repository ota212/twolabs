import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compra Confirmada",
};

export default function SucessoPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-4">Compra confirmada!</h1>
      <p className="text-navy/70 mb-8">
        Seu produto ja esta disponivel. Acesse sua conta para fazer o download.
      </p>

      <Link
        href="/minha-conta"
        className="inline-block bg-electric-blue text-white font-bold px-8 py-3 rounded hover:bg-electric-blue/90 transition-colors"
      >
        Acessar Minha Conta
      </Link>
    </div>
  );
}
