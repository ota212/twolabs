interface MonoLabelProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Editorial section label — `[ 02 / SECTION NAME ]` style.
 */
export function MonoLabel({ children, className = "" }: MonoLabelProps) {
  return (
    <span
      className={`font-mono text-xs tracking-[0.15em] text-muted uppercase ${className}`}
    >
      {children}
    </span>
  );
}
