interface StarRatingProps {
  /** 0 to 5, fractional allowed (e.g. 4.7) */
  value: number;
  /** Total review count; if provided, rendered next to stars */
  count?: number;
  /** "dark" for light bg, "light" for dark bg */
  variant?: "dark" | "light";
  size?: "sm" | "md";
  className?: string;
}

/**
 * Accessible star rating. Renders 5 stars with a fractional fill layer.
 * aria-label communicates the numeric value — the stars are aria-hidden.
 */
export function StarRating({
  value,
  count,
  variant = "dark",
  size = "sm",
  className = "",
}: StarRatingProps) {
  const pct = Math.max(0, Math.min(5, value)) * 20;
  const dim = size === "sm" ? 14 : 18;
  const isLight = variant === "light";
  const empty = isLight ? "text-cream/20" : "text-navy/20";
  const meta = isLight ? "text-cream/70" : "text-muted";

  const stars = Array.from({ length: 5 });

  return (
    <div
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label={`${value.toFixed(1)} de 5${count ? ` · ${count} avaliações` : ""}`}
    >
      <div className="relative inline-flex" aria-hidden="true">
        {/* Empty layer */}
        <div className={`flex gap-0.5 ${empty}`}>
          {stars.map((_, i) => (
            <Star key={i} size={dim} />
          ))}
        </div>
        {/* Filled layer */}
        <div
          className="absolute inset-0 flex gap-0.5 text-electric-blue overflow-hidden"
          style={{ width: `${pct}%` }}
        >
          {stars.map((_, i) => (
            <Star key={i} size={dim} filled />
          ))}
        </div>
      </div>
      <span className={`font-mono text-[11px] ${meta}`}>
        {value.toFixed(1)}
        {count !== undefined && ` · ${count}`}
      </span>
    </div>
  );
}

function Star({ size, filled = false }: { size: number; filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
      strokeLinejoin="round"
    >
      <path d="m12 2 2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.5l7.1-.6L12 2Z" />
    </svg>
  );
}
