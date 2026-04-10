"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Visão Geral", icon: "📊" },
  { href: "/admin/vendas", label: "Vendas", icon: "💳" },
  { href: "/admin/analytics", label: "Analytics", icon: "📈" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-0 z-50 flex bg-cream">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-56 bg-navy text-white">
        <div className="p-5 border-b border-white/10">
          <h1 className="text-lg font-bold">Dois Labs</h1>
          <p className="text-xs text-white/50 mt-0.5">Painel Admin</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-white/40 hover:text-white transition-colors"
          >
            ← Voltar ao site
          </Link>
        </div>
      </aside>

      {/* Mobile tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy flex border-t border-white/10">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-3 text-xs font-medium transition-colors ${
                isActive ? "text-electric-blue" : "text-white/50"
              }`}
            >
              <span className="text-lg mb-0.5">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
