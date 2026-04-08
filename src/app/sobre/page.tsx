import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheca a Dois Labs — Leo e Otavio construindo produtos digitais automatizados.",
};

export default function SobrePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Sobre a Dois Labs</h1>

      <p className="text-lg text-navy/70 mb-12">
        A Dois Labs nasceu de uma ideia simples: criar produtos digitais que funcionam
        sozinhos. Sem complicacao, sem dependencia de terceiros. Ferramentas
        que resolvem problemas reais e geram valor desde o primeiro uso.
      </p>

      <h2 className="text-2xl font-bold mb-6">Quem somos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white border border-navy/5 rounded-lg p-6">
          <div className="w-12 h-12 bg-navy/5 rounded-full flex items-center justify-center text-navy font-bold text-lg mb-4">
            L
          </div>
          <h3 className="font-bold text-lg">Leo Gaspari</h3>
          <p className="text-navy/60 mt-1">
            Estrategia, produto e operacoes. Faz as coisas acontecerem.
          </p>
        </div>

        <div className="bg-white border border-navy/5 rounded-lg p-6">
          <div className="w-12 h-12 bg-navy/5 rounded-full flex items-center justify-center text-navy font-bold text-lg mb-4">
            O
          </div>
          <h3 className="font-bold text-lg">Otavio</h3>
          <p className="text-navy/60 mt-1">
            Tecnologia e automacao. Transforma ideias em sistemas.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Por que produtos digitais automatizados?</h2>
      <p className="text-navy/70">
        Porque o mundo ja tem conteudo demais e ferramentas de menos. Nossos produtos
        sao feitos para resolver um problema especifico, de forma automatizada,
        sem precisar de suporte constante. Comprou, usou, resolveu.
      </p>
    </div>
  );
}
