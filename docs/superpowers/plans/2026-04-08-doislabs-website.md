# doislabs.com.br Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build doislabs.com.br — a digital products store with Stripe payments, Supabase backend, and a clean minimalist UI.

**Architecture:** Next.js 14+ App Router with SSG + ISR for public pages, client-side auth-gated area, and API routes for checkout/webhook/download. Supabase for auth, database, and file storage. Stripe Checkout Sessions for payments.

**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, Stripe, Supabase, Vercel

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `src/app/globals.css`, `.env.example`, `README.md`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/leonardogaspari/Desktop/Cowork/doislabs
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

Select defaults when prompted. This creates the project skeleton with App Router and Tailwind.

- [ ] **Step 2: Install dependencies**

```bash
cd /Users/leonardogaspari/Desktop/Cowork/doislabs
npm install stripe @supabase/supabase-js @supabase/ssr react-markdown
```

- `stripe`: Stripe Node SDK for checkout + webhooks
- `@supabase/supabase-js`: Supabase client
- `@supabase/ssr`: Supabase helpers for SSR/cookie-based auth in Next.js
- `react-markdown`: Render product descriptions from markdown

- [ ] **Step 3: Create .env.example**

Write to `.env.example`:

```
# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

- [ ] **Step 4: Create .env.local with placeholder values**

Write to `.env.local`:

```
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
SUPABASE_SERVICE_ROLE_KEY=placeholder
```

- [ ] **Step 5: Add .env.local to .gitignore**

Verify `.gitignore` already contains `.env.local` (create-next-app should add it). If not, append it.

- [ ] **Step 6: Verify project builds**

```bash
cd /Users/leonardogaspari/Desktop/Cowork/doislabs
npm run build
```

Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js project with deps"
```

---

### Task 2: Tailwind Config + Brand Tokens + Font

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Configure Tailwind with brand colors**

Replace `tailwind.config.ts` with:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1A3A5C",
        cream: "#F5F5F0",
        "electric-blue": "#3B82F6",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Set up DM Sans font and root layout**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Dois Labs — Produtos Digitais",
    template: "%s | Dois Labs",
  },
  description:
    "Produtos digitais automatizados que rodam sozinhos. Feito por Leo e Otavio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={dmSans.variable}>
      <body className="bg-cream text-navy font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Set globals.css**

Replace `src/app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
}
```

- [ ] **Step 4: Verify build**

```bash
cd /Users/leonardogaspari/Desktop/Cowork/doislabs
npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts src/app/layout.tsx src/app/globals.css
git commit -m "feat: configure brand colors, DM Sans font, root layout"
```

---

### Task 3: Types + Utilities

**Files:**
- Create: `src/types/index.ts`
- Create: `src/lib/utils.ts`

- [ ] **Step 1: Define types**

Write `src/types/index.ts`:

```ts
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  category: string | null;
  image_url: string | null;
  file_path: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  product_id: string;
  stripe_session_id: string;
  status: string;
  created_at: string;
  product?: Product;
}
```

- [ ] **Step 2: Create utility functions**

Write `src/lib/utils.ts`:

```ts
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function isNew(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays < 30;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts src/lib/utils.ts
git commit -m "feat: add Product/Purchase types and utility functions"
```

---

### Task 4: Supabase Clients

**Files:**
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/client.ts`

- [ ] **Step 1: Create server-side Supabase client (service role)**

Write `src/lib/supabase/server.ts`:

```ts
import { createClient } from "@supabase/supabase-js";

export function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export function createAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 2: Create browser-side Supabase client**

Write `src/lib/supabase/client.ts`:

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase/
git commit -m "feat: add Supabase server and browser clients"
```

---

### Task 5: Stripe Client

**Files:**
- Create: `src/lib/stripe.ts`

- [ ] **Step 1: Create Stripe instance**

Write `src/lib/stripe.ts`:

```ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/stripe.ts
git commit -m "feat: add Stripe server client"
```

---

### Task 6: Navbar + Footer Components

**Files:**
- Create: `src/components/navbar.tsx`
- Create: `src/components/footer.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Navbar**

Write `src/components/navbar.tsx`:

```tsx
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
```

- [ ] **Step 2: Create Footer**

Write `src/components/footer.tsx`:

```tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy text-white/70 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-white font-bold text-lg mb-2">Dois Labs</p>
            <p className="text-sm">Produtos digitais que rodam sozinhos.</p>
          </div>

          <div>
            <p className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Links</p>
            <div className="space-y-2 text-sm">
              <Link href="/produtos" className="block hover:text-white transition-colors">
                Produtos
              </Link>
              <Link href="/sobre" className="block hover:text-white transition-colors">
                Sobre
              </Link>
              <Link href="/minha-conta" className="block hover:text-white transition-colors">
                Minha Conta
              </Link>
            </div>
          </div>

          <div>
            <p className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Contato</p>
            <div className="space-y-2 text-sm">
              <p>contato@doislabs.com.br</p>
              <p>@doislabs</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-sm text-center">
          &copy; {new Date().getFullYear()} Dois Labs. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Add Navbar and Footer to root layout**

Update `src/app/layout.tsx` — add imports and wrap children:

```tsx
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Dois Labs — Produtos Digitais",
    template: "%s | Dois Labs",
  },
  description:
    "Produtos digitais automatizados que rodam sozinhos. Feito por Leo e Otavio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={dmSans.variable}>
      <body className="bg-cream text-navy font-sans antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
cd /Users/leonardogaspari/Desktop/Cowork/doislabs
npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/navbar.tsx src/components/footer.tsx src/app/layout.tsx
git commit -m "feat: add Navbar and Footer components with responsive layout"
```

---

### Task 7: Home Page

**Files:**
- Create: `src/components/product-card.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create ProductCard component**

Write `src/components/product-card.tsx`:

```tsx
import Link from "next/link";
import { Product } from "@/types";
import { formatPrice, isNew } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="group block bg-white rounded-lg overflow-hidden border border-navy/5 hover:border-electric-blue/30 transition-colors"
    >
      <div className="aspect-[4/3] bg-navy/5 relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-navy/30">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        {isNew(product.created_at) && (
          <span className="absolute top-3 left-3 bg-electric-blue text-white text-xs font-bold px-2 py-1 rounded">
            Novo
          </span>
        )}
      </div>
      <div className="p-4">
        {product.category && (
          <span className="text-xs uppercase tracking-wider text-navy/50 font-bold">
            {product.category}
          </span>
        )}
        <h3 className="font-bold mt-1 group-hover:text-electric-blue transition-colors">
          {product.name}
        </h3>
        <p className="text-electric-blue font-bold mt-2">
          {formatPrice(product.price_cents)}
        </p>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create Home page**

Replace `src/app/page.tsx` with:

```tsx
import Link from "next/link";
import { createAnonClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product-card";
import { Product } from "@/types";

export const revalidate = 60;

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3);
  return (data as Product[]) ?? [];
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 py-24 md:py-32">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
            Produtos digitais que rodam sozinhos.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl">
            Ferramentas prontas para usar. Automatizadas com IA, feitas para quem
            quer resultados sem complicacao.
          </p>
          <Link
            href="/produtos"
            className="inline-block mt-8 bg-electric-blue text-white font-bold px-8 py-3 rounded hover:bg-electric-blue/90 transition-colors"
          >
            Ver Produtos
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Dois Labs</h2>
          <p className="text-navy/70 max-w-2xl mx-auto text-lg">
            Somos Leo e Otavio. Construimos produtos digitais automatizados que
            resolvem problemas reais — sem enrolacao.
          </p>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
cd /Users/leonardogaspari/Desktop/Cowork/doislabs
npm run build
```

Expected: Build succeeds (Supabase calls will fail at runtime without real keys, but build should complete since they run at build time and fail gracefully).

- [ ] **Step 4: Commit**

```bash
git add src/components/product-card.tsx src/app/page.tsx
git commit -m "feat: add Home page with hero, featured products, about section"
```

---

### Task 8: Catalog Page (/produtos)

**Files:**
- Create: `src/app/produtos/page.tsx`

- [ ] **Step 1: Create catalog page**

Write `src/app/produtos/page.tsx`:

```tsx
import type { Metadata } from "next";
import { createAnonClient } from "@/lib/supabase/server";
import { Product } from "@/types";
import { CatalogClient } from "./catalog-client";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Produtos",
  description: "Todos os produtos digitais da Dois Labs.",
};

async function getAllProducts(): Promise<Product[]> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return (data as Product[]) ?? [];
}

export default async function ProdutosPage() {
  const products = await getAllProducts();
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))] as string[];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Produtos</h1>
      <CatalogClient products={products} categories={categories} />
    </div>
  );
}
```

- [ ] **Step 2: Create catalog client component for filtering/sorting/search**

Write `src/app/produtos/catalog-client.tsx`:

```tsx
"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/product-card";

type SortOption = "recent" | "price_asc" | "price_desc";

export function CatalogClient({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("recent");

  const filtered = useMemo(() => {
    let result = products;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (category) {
      result = result.filter((p) => p.category === category);
    }

    switch (sort) {
      case "price_asc":
        result = [...result].sort((a, b) => a.price_cents - b.price_cents);
        break;
      case "price_desc":
        result = [...result].sort((a, b) => b.price_cents - a.price_cents);
        break;
      case "recent":
      default:
        break; // already sorted by created_at desc from server
    }

    return result;
  }, [products, search, category, sort]);

  return (
    <>
      {/* Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-navy/10 rounded px-4 py-2 bg-white focus:outline-none focus:border-electric-blue transition-colors"
        />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(null)}
            className={`px-4 py-2 rounded text-sm font-bold transition-colors ${
              category === null
                ? "bg-navy text-white"
                : "bg-white border border-navy/10 hover:border-navy/30"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded text-sm font-bold transition-colors ${
                category === cat
                  ? "bg-navy text-white"
                  : "bg-white border border-navy/10 hover:border-navy/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="border border-navy/10 rounded px-4 py-2 bg-white focus:outline-none focus:border-electric-blue ml-auto"
        >
          <option value="recent">Mais recente</option>
          <option value="price_asc">Menor preco</option>
          <option value="price_desc">Maior preco</option>
        </select>
      </div>

      {/* Product grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-navy/50 text-center py-12">
          Nenhum produto encontrado.
        </p>
      )}
    </>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
cd /Users/leonardogaspari/Desktop/Cowork/doislabs
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/produtos/
git commit -m "feat: add catalog page with filters, search, and sorting"
```

---

### Task 9: Product Detail Page (/produtos/[slug])

**Files:**
- Create: `src/app/produtos/[slug]/page.tsx`
- Create: `src/components/faq-accordion.tsx`
- Create: `src/components/buy-button.tsx`

- [ ] **Step 1: Create FAQ Accordion component**

Write `src/components/faq-accordion.tsx`:

```tsx
"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Como recebo o produto?",
    answer:
      "Apos a compra, voce recebe acesso imediato na area 'Minha Conta'. Basta fazer login com o email usado na compra e clicar em 'Baixar'.",
  },
  {
    question: "Posso pedir reembolso?",
    answer:
      "Sim. Voce tem 7 dias de garantia incondicional. Se nao gostar, devolvemos 100% do valor.",
  },
  {
    question: "Preciso de algum software especifico?",
    answer:
      "Depende do produto. Planilhas funcionam no Excel ou Google Sheets. Cada produto lista os requisitos na descricao.",
  },
  {
    question: "Como entro em contato?",
    answer:
      "Envie um email para contato@doislabs.com.br. Respondemos em ate 24 horas uteis.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {FAQ_ITEMS.map((item, index) => (
        <div key={index} className="border border-navy/10 rounded">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full text-left px-4 py-3 font-bold flex items-center justify-between hover:bg-navy/5 transition-colors"
          >
            {item.question}
            <svg
              className={`w-5 h-5 text-navy/40 transition-transform ${
                openIndex === index ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === index && (
            <div className="px-4 pb-4 text-navy/70">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create BuyButton component**

Write `src/components/buy-button.tsx`:

```tsx
"use client";

import { useState } from "react";

export function BuyButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="w-full bg-electric-blue text-white font-bold py-4 rounded text-lg hover:bg-electric-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Redirecionando..." : "Comprar Agora"}
    </button>
  );
}
```

- [ ] **Step 3: Create product detail page**

Write `src/app/produtos/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { createAnonClient } from "@/lib/supabase/server";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { BuyButton } from "@/components/buy-button";
import { FaqAccordion } from "@/components/faq-accordion";

export const revalidate = 60;

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data as Product | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Produto nao encontrado" };
  return {
    title: product.name,
    description: product.description?.slice(0, 160) ?? undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-[4/3] bg-navy/5 rounded-lg overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-navy/20">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <span className="text-sm uppercase tracking-wider text-navy/50 font-bold">
              {product.category}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mt-2">{product.name}</h1>
          <p className="text-3xl font-bold text-electric-blue mt-4">
            {formatPrice(product.price_cents)}
          </p>

          <div className="mt-6">
            <BuyButton productId={product.id} />
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-navy/60">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            7 dias de garantia incondicional
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Sobre o produto</h2>
          <div className="prose prose-navy max-w-none">
            <ReactMarkdown>{product.description}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>
        <FaqAccordion />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
cd /Users/leonardogaspari/Desktop/Cowork/doislabs
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/app/produtos/\[slug\]/ src/components/faq-accordion.tsx src/components/buy-button.tsx
git commit -m "feat: add product detail page with buy button and FAQ"
```

---

### Task 10: API Route — Checkout

**Files:**
- Create: `src/app/api/checkout/route.ts`

- [ ] **Step 1: Create checkout API route**

Write `src/app/api/checkout/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAnonClient } from "@/lib/supabase/server";
import { Product } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const supabase = createAnonClient();
    const { data: product } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .eq("is_active", true)
      .single();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const typedProduct = product as Product;
    const origin = request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: { name: typedProduct.name },
            unit_amount: typedProduct.price_cents,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancelado`,
      metadata: { productId: typedProduct.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/leonardogaspari/Desktop/Cowork/doislabs
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/checkout/
git commit -m "feat: add Stripe checkout API route"
```

---

### Task 11: API Route — Webhook

**Files:**
- Create: `src/app/api/webhook/route.ts`

- [ ] **Step 1: Create webhook API route**

Write `src/app/api/webhook/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email;
    const productId = session.metadata?.productId;

    if (!email || !productId) {
      console.error("Missing email or productId in session", session.id);
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // Find or create user
    let userId: string;

    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.email === email
    );

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const { data: newUser, error: createError } =
        await supabase.auth.admin.createUser({
          email,
          email_confirm: true,
        });

      if (createError || !newUser.user) {
        console.error("Error creating user:", createError);
        return NextResponse.json({ error: "User creation failed" }, { status: 500 });
      }
      userId = newUser.user.id;
    }

    // Record purchase
    const { error: purchaseError } = await supabase.from("purchases").insert({
      user_id: userId,
      product_id: productId,
      stripe_session_id: session.id,
      status: "completed",
    });

    if (purchaseError) {
      console.error("Error recording purchase:", purchaseError);
      return NextResponse.json({ error: "Purchase recording failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/leonardogaspari/Desktop/Cowork/doislabs
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/webhook/
git commit -m "feat: add Stripe webhook handler for checkout completion"
```

---

### Task 12: API Route — Download

**Files:**
- Create: `src/app/api/download/[purchaseId]/route.ts`

- [ ] **Step 1: Create download API route**

Write `src/app/api/download/[purchaseId]/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ purchaseId: string }> }
) {
  const { purchaseId } = await params;
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  // Verify user with their token
  const userClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const {
    data: { user },
    error: authError,
  } = await userClient.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch purchase with service role (bypasses RLS)
  const supabase = createServiceRoleClient();

  const { data: purchase } = await supabase
    .from("purchases")
    .select("*, product:products(*)")
    .eq("id", purchaseId)
    .single();

  if (!purchase || purchase.user_id !== user.id) {
    return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
  }

  const filePath = purchase.product?.file_path;
  if (!filePath) {
    return NextResponse.json({ error: "File not available" }, { status: 404 });
  }

  // Generate signed URL
  const { data: signedUrl, error: storageError } = await supabase.storage
    .from("products")
    .createSignedUrl(filePath, 300); // 5 minutes

  if (storageError || !signedUrl) {
    console.error("Storage error:", storageError);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }

  return NextResponse.json({ url: signedUrl.signedUrl });
}
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/leonardogaspari/Desktop/Cowork/doislabs
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/download/
git commit -m "feat: add secure download API with signed URLs"
```

---

### Task 13: Success + Cancel Pages

**Files:**
- Create: `src/app/sucesso/page.tsx`
- Create: `src/app/cancelado/page.tsx`

- [ ] **Step 1: Create success page**

Write `src/app/sucesso/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compra Confirmada",
};

export default function SucessoPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-4">Compra confirmada!</h1>
      <p className="text-navy/70 mb-8">
        Seu produto ja esta disponivel. Acesse sua conta para fazer o download.
      </p>

      <Link
        href="/minha-conta"
        className="inline-block bg-electric-blue text-white font-bold px-8 py-3 rounded hover:bg-electric-blue/90 transition-colors"
      >
        Acessar Minha Conta
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Create cancel page**

Write `src/app/cancelado/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compra Cancelada",
};

export default function CanceladoPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-navy/5 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-navy/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-4">Compra cancelada</h1>
      <p className="text-navy/70 mb-8">
        Sem problemas! Seus dados nao foram cobrados. Quando quiser, estamos aqui.
      </p>

      <Link
        href="/produtos"
        className="inline-block bg-electric-blue text-white font-bold px-8 py-3 rounded hover:bg-electric-blue/90 transition-colors"
      >
        Voltar aos Produtos
      </Link>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
cd /Users/leonardogaspari/Desktop/Cowork/doislabs
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/sucesso/ src/app/cancelado/
git commit -m "feat: add success and cancel pages"
```

---

### Task 14: Minha Conta Page

**Files:**
- Create: `src/app/minha-conta/page.tsx`

- [ ] **Step 1: Create Minha Conta page**

Write `src/app/minha-conta/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Purchase } from "@/types";
import { formatPrice } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

export default function MinhaContaPage() {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
      if (user) loadPurchases(user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) loadPurchases(currentUser.id);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function loadPurchases(userId: string) {
    const { data } = await supabase
      .from("purchases")
      .select("*, product:products(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setPurchases((data as Purchase[]) ?? []);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/minha-conta` },
    });
    if (!error) setMagicLinkSent(true);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setPurchases([]);
  }

  async function handleDownload(purchaseId: string) {
    setDownloading(purchaseId);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const res = await fetch(`/api/download/${purchaseId}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setDownloading(null);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center text-navy/50">
        Carregando...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-2">Minha Conta</h1>
        <p className="text-navy/70 mb-8">
          Entre com seu email para acessar seus produtos.
        </p>

        {magicLinkSent ? (
          <div className="bg-green-50 border border-green-200 rounded p-6 text-center">
            <p className="font-bold text-green-800 mb-1">Link enviado!</p>
            <p className="text-green-700 text-sm">
              Verifique seu email e clique no link para entrar.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-navy/10 rounded px-4 py-3 bg-white focus:outline-none focus:border-electric-blue transition-colors"
            />
            <button
              type="submit"
              className="w-full bg-electric-blue text-white font-bold py-3 rounded hover:bg-electric-blue/90 transition-colors"
            >
              Enviar link de acesso
            </button>
          </form>
        )}
      </div>
    );
  }

  // Logged in
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Minha Conta</h1>
          <p className="text-navy/60 text-sm mt-1">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-navy/50 hover:text-navy transition-colors"
        >
          Sair
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Meus Produtos</h2>

      {purchases.length === 0 ? (
        <p className="text-navy/50 py-8">Voce ainda nao tem compras.</p>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="bg-white border border-navy/5 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-bold">{purchase.product?.name ?? "Produto"}</p>
                <p className="text-sm text-navy/50">
                  {new Date(purchase.created_at).toLocaleDateString("pt-BR")} ·{" "}
                  {purchase.product ? formatPrice(purchase.product.price_cents) : ""}
                </p>
              </div>
              <button
                onClick={() => handleDownload(purchase.id)}
                disabled={downloading === purchase.id}
                className="bg-navy text-white text-sm font-bold px-4 py-2 rounded hover:bg-navy/90 transition-colors disabled:opacity-50"
              >
                {downloading === purchase.id ? "..." : "Baixar"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/leonardogaspari/Desktop/Cowork/doislabs
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/app/minha-conta/
git commit -m "feat: add Minha Conta page with magic link auth and downloads"
```

---

### Task 15: Sobre Page

**Files:**
- Create: `src/app/sobre/page.tsx`

- [ ] **Step 1: Create Sobre page**

Write `src/app/sobre/page.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a Dois Labs — Leo e Otavio construindo produtos digitais automatizados.",
};

export default function SobrePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Sobre a Dois Labs</h1>

      <p className="text-lg text-navy/70 mb-12">
        A Dois Labs nasceu de uma ideia simples: criar produtos digitais que funcionam
        sozinhos. Sem complicação, sem dependência de terceiros. Ferramentas
        que resolvem problemas reais e geram valor desde o primeiro uso.
      </p>

      <h2 className="text-2xl font-bold mb-6">Quem somos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white border border-navy/5 rounded-lg p-6">
          <div className="w-12 h-12 bg-navy/5 rounded-full flex items-center justify-center text-navy font-bold text-lg mb-4">
            L
          </div>
          <h3 className="font-bold text-lg">Leo Gaspari</h3>
          <p className="text-navy/60 mt-1">
            Estrategia, produto e operações. Faz as coisas acontecerem.
          </p>
        </div>

        <div className="bg-white border border-navy/5 rounded-lg p-6">
          <div className="w-12 h-12 bg-navy/5 rounded-full flex items-center justify-center text-navy font-bold text-lg mb-4">
            O
          </div>
          <h3 className="font-bold text-lg">Otavio</h3>
          <p className="text-navy/60 mt-1">
            Tecnologia e automação. Transforma ideias em sistemas.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Por que produtos digitais automatizados?</h2>
      <p className="text-navy/70">
        Porque o mundo ja tem conteúdo demais e ferramentas de menos. Nossos produtos
        são feitos para resolver um problema especifico, de forma automatizada,
        sem precisar de suporte constante. Comprou, usou, resolveu.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/leonardogaspari/Desktop/Cowork/doislabs
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/app/sobre/
git commit -m "feat: add Sobre page"
```

---

### Task 16: SEO — Sitemap + Robots

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

- [ ] **Step 1: Create sitemap**

Write `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { createAnonClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://doislabs.com.br";

  const supabase = createAnonClient();
  const { data: products } = await supabase
    .from("products")
    .select("slug, created_at")
    .eq("is_active", true);

  const productUrls = (products ?? []).map((p) => ({
    url: `${baseUrl}/produtos/${p.slug}`,
    lastModified: new Date(p.created_at),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/produtos`, lastModified: new Date() },
    { url: `${baseUrl}/sobre`, lastModified: new Date() },
    ...productUrls,
  ];
}
```

- [ ] **Step 2: Create robots.txt**

Write `src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://doislabs.com.br/sitemap.xml",
  };
}
```

- [ ] **Step 3: Verify build**

```bash
cd /Users/leonardogaspari/Desktop/Cowork/doislabs
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts
git commit -m "feat: add sitemap and robots.txt for SEO"
```

---

### Task 17: Seed SQL + README

**Files:**
- Create: `supabase/seed.sql`
- Modify: `README.md`

- [ ] **Step 1: Create seed SQL file**

Write `supabase/seed.sql`:

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,
  name        text NOT NULL,
  description text,
  price_cents integer NOT NULL,
  category    text,
  image_url   text,
  file_path   text,
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS public.purchases (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid REFERENCES auth.users(id),
  product_id        uuid REFERENCES public.products(id),
  stripe_session_id text UNIQUE,
  status            text DEFAULT 'completed',
  created_at        timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Products: public read
CREATE POLICY "Products are publicly readable"
  ON public.products FOR SELECT
  USING (true);

-- Purchases: user can read own
CREATE POLICY "Users can read own purchases"
  ON public.purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Purchases: service role can insert (webhook)
CREATE POLICY "Service role can insert purchases"
  ON public.purchases FOR INSERT
  WITH CHECK (true);

-- Seed first product
INSERT INTO public.products (slug, name, description, price_cents, category, file_path, is_active)
VALUES (
  'planilha-financeira-psicologos',
  'Planilha Financeira para Psicólogos',
  '## O que é

Planilha Excel completa para psicólogos autônomos. Gerencie pacientes, sessões, pagamentos, imposto (carnê-leão) e visualize suas finanças com um dashboard completo.

## O que inclui

- **10 abas** organizadas por função
- **Gestão de pacientes** — cadastro, status, histórico
- **Controle de sessões** — agenda, frequência, valores
- **Financeiro** — receitas, despesas, carnê-leão
- **Dashboard** — KPIs, gráficos, visão geral
- **Recibo** — geração automática em A4
- **Exportação para contador** — dados prontos para enviar

## Requisitos

- Microsoft Excel 2016+ ou Google Sheets
- Sem macros, sem VBA — funciona em qualquer versão

## Garantia

7 dias de garantia incondicional. Se não gostar, devolvemos 100% do valor.',
  4700,
  'planilhas',
  'planilha-financeira-psicologos/Planilha_Financeira_Psicologos_v2.xlsx',
  true
);
```

- [ ] **Step 2: Write README**

Replace `README.md` with:

```markdown
# doislabs.com.br

Loja oficial de produtos digitais da Dois Labs.

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Stripe (Checkout Sessions)
- Supabase (Auth + PostgreSQL + Storage)

## Setup

### 1. Clone e instale dependências

```bash
git clone <repo-url>
cd doislabs
npm install
```

### 2. Configure variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

Variáveis necessárias:
- `STRIPE_SECRET_KEY` — chave secreta do Stripe
- `STRIPE_WEBHOOK_SECRET` — secret do webhook do Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — chave pública do Stripe
- `NEXT_PUBLIC_SUPABASE_URL` — URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — chave anon do Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — chave service role do Supabase

### 3. Configure o Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o SQL em `supabase/seed.sql` no SQL Editor
3. Crie dois storage buckets:
   - `products` (privado) — arquivos para download
   - `product-images` (público) — imagens do catálogo
4. Ative a autenticação por email (Magic Link) em Auth > Providers

### 4. Configure o Stripe

1. Crie uma conta no [Stripe](https://stripe.com)
2. Configure o webhook apontando para `https://seu-dominio.com/api/webhook`
3. Selecione o evento `checkout.session.completed`

### 5. Rode o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Deploy

Deploy na Vercel:

```bash
npx vercel
```

Configure as variáveis de ambiente no dashboard da Vercel.
```

- [ ] **Step 3: Commit**

```bash
git add supabase/ README.md
git commit -m "feat: add seed SQL, RLS policies, and README"
```

---

### Task 18: Next.js Config + Final Polish

**Files:**
- Modify: `next.config.ts`
- Create: `public/images/.gitkeep`

- [ ] **Step 1: Update next.config.ts for external images**

Replace `next.config.ts` with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Create public images directory**

```bash
mkdir -p /Users/leonardogaspari/Desktop/Cowork/doislabs/public/images
touch /Users/leonardogaspari/Desktop/Cowork/doislabs/public/images/.gitkeep
```

- [ ] **Step 3: Final build check**

```bash
cd /Users/leonardogaspari/Desktop/Cowork/doislabs
npm run build
```

Expected: Full build succeeds with all pages compiled.

- [ ] **Step 4: Commit**

```bash
git add next.config.ts public/
git commit -m "chore: configure external images and finalize project"
```
