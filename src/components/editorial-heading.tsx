import React from "react";

interface EditorialHeadingProps {
  as?: "h1" | "h2" | "h3";
  size?: "display" | "xl" | "lg" | "md";
  className?: string;
  children: React.ReactNode;
}

const SIZE_STYLES: Record<string, string> = {
  display: "text-[clamp(56px,10vw,140px)] leading-[0.92] tracking-[-0.04em] font-semibold",
  xl: "text-[clamp(40px,6vw,96px)] leading-[0.98] tracking-[-0.03em] font-medium",
  lg: "text-[clamp(36px,5vw,72px)] leading-[1.02] tracking-[-0.03em] font-medium",
  md: "text-[clamp(28px,3.6vw,48px)] leading-[1.05] tracking-[-0.02em] font-medium",
};

export function EditorialHeading({
  as: Tag = "h2",
  size = "lg",
  className = "",
  children,
}: EditorialHeadingProps) {
  return <Tag className={`${SIZE_STYLES[size]} ${className}`}>{children}</Tag>;
}

/**
 * Inline italic serif accent — use inside an EditorialHeading.
 * e.g. <EditorialHeading>Produtos que <Italic>funcionam</Italic></EditorialHeading>
 */
export function Italic({
  children,
  accent = false,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <span
      className="font-serif italic"
      style={{
        color: accent ? "var(--color-electric-blue)" : "inherit",
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </span>
  );
}
