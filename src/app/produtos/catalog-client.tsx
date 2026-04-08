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
        break;
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
