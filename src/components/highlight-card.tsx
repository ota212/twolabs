"use client";

import { useState } from "react";

const ICONS: Record<string, React.ReactNode> = {
  chart: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13h2v8H3zM9 9h2v12H9zM15 5h2v16h-2zM21 1h2v20h-2z" />
    </svg>
  ),
  trending: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  alert: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  zap: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  file: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  shield: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  edit: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
};

export function HighlightCard({
  icon,
  title,
  description,
  number,
}: {
  icon: string;
  title: string;
  description: string;
  /** Optional "01", "02" etc. for editorial numbering. */
  number?: string;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative p-10 min-h-[320px] flex flex-col justify-between border border-navy/10 transition-all duration-500 cursor-crosshair"
      style={{
        background: hover ? "var(--color-navy)" : "var(--color-cream-2)",
        color: hover ? "var(--color-cream)" : "var(--color-navy)",
      }}
    >
      {number && (
        <span
          className="font-mono text-xs"
          style={{ color: hover ? "var(--color-electric-blue)" : "var(--color-muted)" }}
        >
          / {number}
        </span>
      )}
      {!number && (
        <div
          className="w-10 h-10 rounded-md grid place-items-center"
          style={{
            background: hover ? "rgba(242,235,221,0.1)" : "rgba(59,130,246,0.1)",
            color: hover ? "var(--color-cream)" : "var(--color-electric-blue)",
          }}
        >
          {ICONS[icon] ?? ICONS.zap}
        </div>
      )}
      <div>
        <h4
          className="font-serif italic"
          style={{
            fontSize: "clamp(28px, 2.6vw, 40px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}
        >
          {title}
        </h4>
        <p className="text-[15px] leading-relaxed opacity-80 max-w-[340px]">
          {description}
        </p>
      </div>
      <div
        className="self-end w-11 h-11 rounded-full grid place-items-center transition-all duration-300"
        style={{
          background: hover ? "var(--color-electric-blue)" : "transparent",
          border: hover ? "none" : "1px solid currentColor",
          color: hover ? "white" : "inherit",
          transform: hover ? "rotate(-45deg)" : "rotate(0)",
        }}
        aria-hidden="true"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M2 8 h12 M9 3 l5 5 -5 5" />
        </svg>
      </div>
    </div>
  );
}
