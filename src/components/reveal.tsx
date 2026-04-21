"use client";

import { useEffect, useRef } from "react";

interface RevealProps {
  children: React.ReactNode;
  /** 0-5 — maps to CSS transition-delay */
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Wrap any element to fade/slide-in on scroll.
 * Uses IntersectionObserver + CSS classes (defined in globals.css).
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const delayClass = delay > 0 ? `delay-${delay}` : "";
  const Element = Tag as React.ElementType;

  return (
    <Element ref={ref} className={`reveal ${delayClass} ${className}`}>
      {children}
    </Element>
  );
}
