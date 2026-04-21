"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./logo";
import { PRODUCT_AREAS } from "@/lib/product-content";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Close dropdown on outside click or Escape.
  useEffect(() => {
    if (!dropdownOpen) return;
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [dropdownOpen]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        padding: scrolled ? "12px 24px" : "20px 32px",
        background: scrolled ? "rgba(242, 235, 221, 0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(26, 58, 92, 0.08)"
          : "1px solid transparent",
      }}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <Link href="/" aria-label="Dois Labs — Home" className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric-blue rounded">
          <Logo variant="dark" size={28} />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm tracking-wide text-navy">
          {/* Produtos w/ categories dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 hover:text-electric-blue transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric-blue rounded"
            >
              Produtos
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              >
                <path d="m2 3.5 3 3 3-3" />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                role="menu"
                className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[340px]"
              >
                <div className="bg-cream border border-navy/10 shadow-[0_20px_60px_-20px_rgba(26,58,92,0.35)] rounded-lg overflow-hidden">
                  <div className="px-5 py-3 border-b border-navy/10 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                      [ áreas ]
                    </span>
                    <Link
                      href="/produtos"
                      className="font-mono text-[10px] uppercase tracking-wider text-electric-blue hover:underline"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Ver tudo →
                    </Link>
                  </div>
                  <ul className="py-2">
                    {PRODUCT_AREAS.map((area) => {
                      const disabled = area.comingSoon;
                      const content = (
                        <span className="flex items-center gap-3 px-5 py-3 transition-colors">
                          <span className="text-lg flex-none">{area.icon}</span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-sm font-medium text-navy">
                              {area.name}
                            </span>
                            <span className="block text-xs text-muted truncate">
                              {area.description}
                            </span>
                          </span>
                          {disabled ? (
                            <span className="font-mono text-[9px] uppercase tracking-wider text-navy/30 flex-none">
                              em breve
                            </span>
                          ) : (
                            <span className="text-navy/40 flex-none" aria-hidden="true">
                              →
                            </span>
                          )}
                        </span>
                      );
                      return (
                        <li key={area.slug} role="none">
                          {disabled ? (
                            <span
                              role="menuitem"
                              aria-disabled="true"
                              className="block opacity-50 cursor-not-allowed"
                            >
                              {content}
                            </span>
                          ) : (
                            <Link
                              href={`/produtos?area=${area.slug}`}
                              role="menuitem"
                              onClick={() => setDropdownOpen(false)}
                              className="block hover:bg-cream-2 focus-visible:bg-cream-2 focus-visible:outline-none"
                            >
                              {content}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <Link href="/sobre" className="hover:text-electric-blue transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric-blue rounded">
            Sobre
          </Link>
          <Link href="/minha-conta" className="hover:text-electric-blue transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric-blue rounded">
            Minha conta
          </Link>
        </div>

        <div className="hidden md:block">
          <Link
            href="/produtos"
            className="group inline-flex items-center gap-2.5 px-5 py-3 border border-navy rounded-full text-[13px] transition-all duration-200 hover:bg-navy hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric-blue"
          >
            Ver produtos
            <span className="text-base transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 text-navy min-w-11 min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-blue"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden mt-3 py-4 px-4 border-t border-navy/10"
          style={{ background: "rgba(242, 235, 221, 0.97)", backdropFilter: "blur(12px)" }}
        >
          <Link
            href="/produtos"
            className="block py-3 text-navy hover:text-electric-blue"
            onClick={() => setMenuOpen(false)}
          >
            Produtos
          </Link>
          {/* Mobile categories */}
          <ul className="pl-4 border-l border-navy/15 ml-1 mb-2">
            {PRODUCT_AREAS.map((a) => {
              const disabled = a.comingSoon;
              return (
                <li key={a.slug}>
                  {disabled ? (
                    <span className="flex items-center gap-2 py-2 text-sm text-navy/40">
                      <span>{a.icon}</span>
                      {a.name}
                      <span className="font-mono text-[9px] uppercase tracking-wider ml-auto">
                        em breve
                      </span>
                    </span>
                  ) : (
                    <Link
                      href={`/produtos?area=${a.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 py-2 text-sm text-navy hover:text-electric-blue"
                    >
                      <span>{a.icon}</span>
                      {a.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <Link
            href="/sobre"
            className="block py-3 text-navy hover:text-electric-blue"
            onClick={() => setMenuOpen(false)}
          >
            Sobre
          </Link>
          <Link
            href="/minha-conta"
            className="block py-3 text-navy hover:text-electric-blue"
            onClick={() => setMenuOpen(false)}
          >
            Minha conta
          </Link>
        </div>
      )}
    </nav>
  );
}
