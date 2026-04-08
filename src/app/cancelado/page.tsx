import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compra Cancelada",
};

export default function CanceladoPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-navy/5 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-navy/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-4">Compra cancelada</h1>
      <p className="text-navy/70 mb-8">
        Sem problemas! Seus dados não foram cobrados. Quando quiser, estamos aqui.
      </p>

      <Link
        href="/produtos"
        className="inline-block bg-electric-blue text-white font-bold px-8 py-3 rounded hover:bg-electric-blue/90 transition-colors"
      >
        Voltar aos Produtos
      </Link>
    </div>
  );
}
