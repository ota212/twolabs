interface TrustItem {
  icon: React.ReactNode;
  label: string;
  sub?: string;
}

const ITEMS: TrustItem[] = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2 4 5v7c0 5 3.5 9 8 10 4.5-1 8-5 8-10V5l-8-3Z" />
      </svg>
    ),
    label: "Pagamento seguro",
    sub: "Stripe · PIX · Cartão",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 1 1 8 0v4" />
      </svg>
    ),
    label: "SSL 256-bit",
    sub: "conexão criptografada",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 3v18" />
      </svg>
    ),
    label: "Excel + Google Sheets",
    sub: "compatível nos dois",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
      </svg>
    ),
    label: "Acesso imediato",
    sub: "download na hora",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    label: "Garantia 7 dias",
    sub: "100% do valor",
  },
];

/**
 * Trust strip — row of functional trust signals between hero and intro.
 * Replaces the decorative marquee so prime real-estate carries signal.
 */
export function TrustStrip() {
  return (
    <section
      aria-label="Selos de confiança"
      className="bg-cream-2 border-y border-navy/10"
    >
      <ul className="max-w-[1400px] mx-auto px-10 py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-6 text-navy">
        {ITEMS.map((it, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="flex-none w-9 h-9 rounded-full grid place-items-center bg-cream border border-navy/10 text-electric-blue">
              {it.icon}
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[13px] font-medium">{it.label}</span>
              {it.sub && (
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  {it.sub}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
