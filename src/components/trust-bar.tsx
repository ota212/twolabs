interface Metric {
  value: string;
  label: string;
}

const DEFAULT_METRICS: Metric[] = [
  { value: "+2.400", label: "downloads realizados" },
  { value: "4.9/5", label: "nota média dos clientes" },
  { value: "7 dias", label: "garantia incondicional" },
];

/**
 * Trust bar — 3 metrics displayed below the hero CTA.
 * Placeholders until real numbers are provided (see deliverables list).
 */
export function TrustBar({
  metrics = DEFAULT_METRICS,
  variant = "dark",
  className = "",
}: {
  metrics?: Metric[];
  variant?: "dark" | "light";
  className?: string;
}) {
  const isLight = variant === "light";
  const ink = isLight ? "text-cream" : "text-navy";
  const muted = isLight ? "text-cream/60" : "text-muted";
  const divider = isLight ? "bg-cream/15" : "bg-navy/15";

  return (
    <div
      className={`flex flex-wrap items-center gap-x-10 gap-y-5 ${ink} ${className}`}
    >
      {metrics.map((m, i) => (
        <div key={i} className="flex items-center gap-10">
          <div className="flex flex-col">
            <span
              className="font-serif italic leading-none"
              style={{ fontSize: "clamp(24px, 2vw, 32px)", letterSpacing: "-0.02em" }}
            >
              {m.value}
            </span>
            <span className={`mt-1.5 font-mono text-[11px] uppercase tracking-wider ${muted}`}>
              {m.label}
            </span>
          </div>
          {i < metrics.length - 1 && (
            <span className={`hidden sm:block w-px h-10 ${divider}`} aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}
