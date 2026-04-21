import React from "react";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

/**
 * Horizontal scrolling marquee. Duplicates children so the loop is seamless.
 * Pure CSS animation — works in Server Components.
 */
export function Marquee({ children, speed = 40, className = "" }: MarqueeProps) {
  return (
    <div
      className={`overflow-hidden whitespace-nowrap ${className}`}
      style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)" }}
    >
      <div
        className="inline-block"
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        <span className="inline-block pr-10">{children}</span>
        <span className="inline-block pr-10" aria-hidden="true">
          {children}
        </span>
      </div>
    </div>
  );
}
