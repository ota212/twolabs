import Link from "next/link";
import { PRODUCT_AREAS } from "@/lib/product-content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-cream mt-auto px-6 pt-16 pb-10">
      <div className="max-w-[1400px] mx-auto">
        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 pb-14 border-b border-cream/15">
          {/* Categorias */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-cream/65 mb-5">
              Categorias
            </h4>
            <ul className="space-y-3 text-sm">
              {PRODUCT_AREAS.map((a) => (
                <li key={a.slug}>
                  {a.comingSoon ? (
                    <span className="text-cream/30 inline-flex items-center gap-2">
                      {a.name}
                      <span className="font-mono text-[9px] uppercase tracking-wider">
                        em breve
                      </span>
                    </span>
                  ) : (
                    <Link
                      href={`/produtos?area=${a.slug}`}
                      className="text-cream/75 hover:text-cream transition-colors"
                    >
                      {a.name}
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <Link
                  href="/produtos"
                  className="text-electric-blue hover:brightness-125 transition-all"
                >
                  Ver catálogo →
                </Link>
              </li>
            </ul>
          </div>

          {/* Sobre */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-cream/65 mb-5">
              Sobre
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/sobre" className="text-cream/75 hover:text-cream transition-colors">
                  Manifesto
                </Link>
              </li>
              <li>
                <Link href="/sobre#garantias" className="text-cream/75 hover:text-cream transition-colors">
                  Garantias
                </Link>
              </li>
              <li>
                <a
                  href="https://instagram.com/doislabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/75 hover:text-cream transition-colors"
                >
                  Instagram ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-cream/65 mb-5">
              Suporte
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/minha-conta" className="text-cream/75 hover:text-cream transition-colors">
                  Minha conta
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contato@doislabs.com.br"
                  className="text-cream/75 hover:text-cream transition-colors"
                >
                  contato@doislabs.com.br
                </a>
              </li>
              <li className="text-cream/65 text-xs">Resposta em até 24h úteis</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-cream/65 mb-5">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/termos" className="text-cream/75 hover:text-cream transition-colors">
                  Termos de uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-cream/75 hover:text-cream transition-colors">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="/lgpd" className="text-cream/75 hover:text-cream transition-colors">
                  LGPD
                </Link>
              </li>
              <li className="text-cream/60 text-xs pt-2 font-mono">
                CNPJ xx.xxx.xxx/0001-xx
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-cream/65 mb-5">
              Novidades
            </h4>
            <p className="text-sm text-cream/70 mb-4 max-w-[260px]">
              Receba lançamentos e atualizações direto no seu email.
            </p>
            <form
              action="/api/newsletter"
              method="post"
              className="flex flex-col sm:flex-row lg:flex-col gap-2"
            >
              <label htmlFor="footer-newsletter" className="sr-only">
                Email para newsletter
              </label>
              <input
                id="footer-newsletter"
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
                className="flex-1 min-w-0 px-4 py-3 bg-cream/10 border border-cream/20 rounded-full text-sm text-cream placeholder:text-cream/60 focus:outline-none focus:border-electric-blue focus:bg-cream/15"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-electric-blue text-white rounded-full text-sm hover:brightness-110 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
              >
                Inscrever
              </button>
            </form>
          </div>
        </div>

        {/* Giant wordmark */}
        <div
          className="font-serif italic mt-14"
          style={{
            fontSize: "clamp(80px, 18vw, 260px)",
            lineHeight: 0.85,
            letterSpacing: "-0.05em",
          }}
          aria-hidden="true"
        >
          Dois Labs.
        </div>

        {/* Bottom row */}
        <div className="mt-10 pt-8 border-t border-cream/15 flex flex-wrap justify-between gap-6 text-xs">
          <span className="font-mono text-cream/65">
            © {year} Dois Labs — produtos digitais que rodam sozinhos.
          </span>
          <span className="font-mono text-cream/65">
            Pagamento seguro via Stripe · SSL 256-bit
          </span>
        </div>
      </div>
    </footer>
  );
}
