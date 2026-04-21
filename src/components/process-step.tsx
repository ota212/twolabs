import { Reveal } from "./reveal";

export interface ProcessStepData {
  n: string;
  t: string;
  d: string;
}

/**
 * Editorial process row. Reveal wraps inner content — NOT the grid itself —
 * to avoid transform/grid repaint conflicts that caused overlap in step 02.
 */
export function ProcessStep({
  step,
  index,
  total,
}: {
  step: ProcessStepData;
  index: number;
  total: number;
}) {
  const delay = (Math.min(index + 1, 3) as 1 | 2 | 3);
  const isLast = index === total - 1;

  return (
    <div
      className={`border-t border-navy/20 ${isLast ? "border-b" : ""}`}
    >
      <Reveal
        delay={delay}
        className="grid grid-cols-[48px_1fr] md:grid-cols-[80px_1fr_2fr_80px] gap-6 md:gap-10 items-start md:items-center py-10"
      >
        <span className="font-mono text-sm text-electric-blue pt-2 md:pt-0">
          {step.n}
        </span>
        <div className="md:contents">
          <h3 className="text-[clamp(24px,2.4vw,36px)] tracking-[-0.02em] font-medium leading-tight">
            {step.t}
          </h3>
          <p className="mt-3 md:mt-0 text-base md:text-lg text-navy/70 leading-relaxed">
            {step.d}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="hidden md:block text-3xl text-right opacity-40"
        >
          →
        </span>
      </Reveal>
    </div>
  );
}
