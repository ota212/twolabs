"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

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
        <Link href="/" aria-label="Dois Labs — Home">
          <Logo variant="dark" size={28} />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10 text-sm tracking-wide text-navy">
          <Link href="/produtos" className="hover:text-electric-blue transition-colors">
            Produtos
          </Link>
          <Link href="/sobre" className="hover:text-electric-blue transition-colors">
            Sobre
          </Link>
          <Link href="/minha-conta" className="hover:text-electric-blue transition-colors">
            Minha conta
          </Link>
        </div>

        <div className="hidden md:block">
          <Link
            href="/produtos"
            className="group inline-flex items-center gap-2.5 px-5 py-3 border border-navy rounded-full text-[13px] transition-all duration-200 hover:bg-navy hover:text-cream"
          >
            Ver produtos
            <span className="text-base transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-navy"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden mt-3 py-4 px-4 space-y-3 border-t border-navy/10"
          style={{ background: "rgba(242, 235, 221, 0.95)", backdropFilter: "blur(12px)" }}
        >
          <Link
            href="/produtos"
            className="block text-navy hover:text-electric-blue"
            onClick={() => setMenuOpen(false)}
          >
            Produtos
          </Link>
          <Link
            href="/sobre"
            className="block text-navy hover:text-electric-blue"
            onClick={() => setMenuOpen(false)}
          >
            Sobre
          </Link>
          <Link
            href="/minha-conta"
            className="block text-navy hover:text-electric-blue"
            onClick={() => setMenuOpen(false)}
          >
            Minha conta
          </Link>
        </div>
      )}
    </nav>
  );
}
