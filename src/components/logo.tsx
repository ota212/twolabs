/**
 * Dois Labs wordmark — Instrument Serif italic.
 * Editorial style (inspired by Vooz.).
 */

interface LogoProps {
  variant?: "light" | "dark";
  size?: number;
  /** Accepted for legacy API; height maps to font-size. */
  height?: number;
}

export function Logo({ variant = "dark", size, height }: LogoProps) {
  const color = variant === "light" ? "#F2EBDD" : "#1A3A5C";
  const fontSize = size ?? height ?? 32;

  return (
    <span
      aria-label="Dois Labs"
      className="font-serif italic inline-block"
      style={{
        color,
        fontSize: `${fontSize}px`,
        lineHeight: 1,
        letterSpacing: "-0.03em",
      }}
    >
      Dois Labs.
    </span>
  );
}

export function LogoIcon({ variant = "dark", size = 32 }: LogoProps) {
  const color = variant === "light" ? "#F2EBDD" : "#1A3A5C";
  return (
    <span
      aria-label="Dois Labs"
      className="font-serif italic inline-block"
      style={{
        color,
        fontSize: `${size}px`,
        lineHeight: 1,
        letterSpacing: "-0.03em",
      }}
    >
      D.
    </span>
  );
}
