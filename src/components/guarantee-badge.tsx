interface GuaranteeBadgeProps {
  /** "dark" for light bgs (navy ink), "light" for dark bgs (cream ink) */
  variant?: "dark" | "light";
  className?: string;
}

/**
 * Visual guarantee badge — shield icon + 7-day guarantee copy.
 * Replaces the faint gray microcopy previously sitting under CTAs.
 */
export function GuaranteeBadge({
  variant = "dark",
  className = "",
}: GuaranteeBadgeProps) {
  const isLight = variant === "light";
  const bg = isLight ? "bg-cream/10 border-cream/20" : "bg-cream-2 border-navy/15";
  const ink = isLight ? "text-cream" : "text-navy";
  const accent = isLight ? "text-electric-blue" : "text-electric-blue";

  return (
    <div
      className={`inline-flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-full border ${bg} ${ink} ${className}`}
      role="img"
      aria-label="Garantia de 7 dias incondicional"
    >
      <span className={`flex-none w-7 h-7 rounded-full grid place-items-center bg-electric-blue/15 ${accent}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2 4 5v7c0 5 3.5 9 8 10 4.5-1 8-5 8-10V5l-8-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-medium text-[13px]">Garantia de 7 dias</span>
        <span className={`font-mono text-[10px] uppercase tracking-wider ${isLight ? "text-cream/60" : "text-muted"}`}>
          100% do valor · sem perguntas
        </span>
      </span>
    </div>
  );
}
