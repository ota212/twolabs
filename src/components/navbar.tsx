"use client";

import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-navy text-white">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Dois Labs
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/produtos" className="hover:text-electric-blue transition-colors">
            Produtos
          </Link>
          <Link href="/sobre" className="hover:text-electric-blue transition-colors">
            Sobre
          </Link>
        </div>

        <div className="hidden md:block">
          <Link
            href="/minha-conta"
            className="text-sm border border-white/30 px-4 py-2 rounded hover:bg-white/10 transition-colors"
          >
            Minha Conta
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="md:hidden border-t border-white/10 px-4 py-4 space-y-3">
          <Link href="/produtos" className="block hover:text-electric-blue" onClick={() => setMenuOpen(false)}>
            Produtos
          </Link>
          <Link href="/sobre" className="block hover:text-electric-blue" onClick={() => setMenuOpen(false)}>
            Sobre
          </Link>
          <Link href="/minha-conta" className="block hover:text-electric-blue" onClick={() => setMenuOpen(false)}>
            Minha Conta
          </Link>
        </div>
      )}
    </nav>
  );
}
