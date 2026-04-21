import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy text-cream mt-auto px-6 pt-16 pb-10">
      <div className="max-w-[1400px] mx-auto">
        {/* Giant wordmark */}
        <div
          className="font-serif italic"
          style={{
            fontSize: "clamp(80px, 18vw, 260px)",
            lineHeight: 0.85,
            letterSpacing: "-0.05em",
          }}
        >
          Dois Labs.
        </div>

        {/* Bottom row */}
        <div className="mt-10 pt-8 border-t border-cream/20 flex flex-wrap justify-between gap-6 text-sm">
          <span className="font-mono text-cream/60">
            © {year} Dois Labs — produtos digitais que rodam sozinhos.
          </span>
          <div className="flex flex-wrap gap-6 text-cream/70">
            <Link href="/produtos" className="hover:text-cream transition-colors">
              Produtos
            </Link>
            <Link href="/sobre" className="hover:text-cream transition-colors">
              Sobre
            </Link>
            <Link href="/minha-conta" className="hover:text-cream transition-colors">
              Minha conta
            </Link>
            <a
              href="mailto:contato@doislabs.com.br"
              className="hover:text-cream transition-colors"
            >
              contato@doislabs.com.br
            </a>
            <a
              href="https://instagram.com/doislabs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cream transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
