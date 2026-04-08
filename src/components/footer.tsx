import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="bg-navy text-white/70 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-3">
              <Logo variant="light" height={24} />
            </div>
            <p className="text-sm">Produtos digitais que rodam sozinhos.</p>
          </div>

          <div>
            <p className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Links</p>
            <div className="space-y-2 text-sm">
              <Link href="/produtos" className="block hover:text-white transition-colors">
                Produtos
              </Link>
              <Link href="/sobre" className="block hover:text-white transition-colors">
                Sobre
              </Link>
              <Link href="/minha-conta" className="block hover:text-white transition-colors">
                Minha Conta
              </Link>
            </div>
          </div>

          <div>
            <p className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Contato</p>
            <div className="space-y-2 text-sm">
              <p>contato@doislabs.com.br</p>
              <p>@doislabs</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-sm text-center">
          &copy; {new Date().getFullYear()} Dois Labs. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
