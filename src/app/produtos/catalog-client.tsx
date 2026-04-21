"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/product-card";
import { MonoLabel } from "@/components/mono-label";
import { PRODUCT_CONTENT, PRODUCT_AREAS, type ProductArea } from "@/lib/product-content";

type SortOption = "recent" | "price_asc" | "price_desc";

export function CatalogClient({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("recent");

  const productTypes = useMemo(() => {
    const types = [...new Set(products.map((p) => p.category).filter(Boolean))] as string[];
    return types.sort();
  }, [products]);

  const activeAreaSlugs = useMemo(() => {
    const slugs = new Set<string>();
    products.forEach((p) => {
      const content = PRODUCT_CONTENT[p.slug];
      if (content?.area) slugs.add(content.area);
    });
    return slugs;
  }, [products]);

  const filtered = useMemo(() => {
    let result = products;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (selectedArea) {
      result = result.filter((p) => {
        const content = PRODUCT_CONTENT[p.slug];
        return content?.area === selectedArea;
      });
    }

    if (selectedType) {
      result = result.filter((p) => p.category === selectedType);
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
  }, [products, search, selectedArea, selectedType, sort]);

  function handleAreaClick(area: ProductArea) {
    if (area.comingSoon) return;
    setSelectedArea(selectedArea === area.slug ? null : area.slug);
  }

  return (
    <>
      {/* ─── Áreas ─── */}
      <div className="mb-16">
        <MonoLabel className="mb-6 block">[ áreas ]</MonoLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-navy/10 border border-navy/10">
          {PRODUCT_AREAS.map((area) => {
            const isActive = selectedArea === area.slug;
            const hasProducts = activeAreaSlugs.has(area.slug);
            const isComingSoon = area.comingSoon || !hasProducts;

            return (
              <button
                key={area.slug}
                onClick={() => handleAreaClick(area)}
                disabled={isComingSoon}
                className={`relative text-left p-6 transition-colors ${
                  isActive
                    ? "bg-navy text-cream"
                    : isComingSoon
                    ? "bg-cream-2 text-navy/25 cursor-not-allowed"
                    : "bg-cream hover:bg-cream-2 text-navy"
                }`}
              >
                <span className="block text-2xl mb-3">{area.icon}</span>
                <span
                  className="block font-serif italic leading-tight"
                  style={{ fontSize: "clamp(20px, 1.6vw, 26px)", letterSpacing: "-0.01em" }}
                >
                  {area.name}
                </span>
                <span
                  className={`block mt-2 text-xs font-mono tracking-wider uppercase ${
                    isActive ? "text-cream/60" : isComingSoon ? "text-navy/20" : "text-muted"
                  }`}
                >
                  {isComingSoon ? "em breve" : area.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Busca + filtros ─── */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-stretch md:items-center">
        <input
          type="text"
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-b border-navy/20 bg-transparent px-0 py-3 text-lg focus:outline-none focus:border-navy transition-colors md:w-72 placeholder:text-navy/30"
        />

        <div className="flex flex-wrap gap-2 md:ml-4">
          <button
            onClick={() => setSelectedType(null)}
            className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-colors ${
              selectedType === null
                ? "bg-navy text-cream"
                : "border border-navy/20 hover:border-navy text-navy"
            }`}
          >
            Todos
          </button>
          {productTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(selectedType === type ? null : type)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-colors ${
                selectedType === type
                  ? "bg-navy text-cream"
                  : "border border-navy/20 hover:border-navy text-navy"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="border border-navy/20 rounded-full px-4 py-2 bg-transparent text-xs font-mono tracking-wider uppercase focus:outline-none focus:border-navy md:ml-auto"
        >
          <option value="recent">Mais recente</option>
          <option value="price_asc">Menor preço</option>
          <option value="price_desc">Maior preço</option>
        </select>
      </div>

      {/* ─── Filtros ativos ─── */}
      {(selectedArea || selectedType) && (
        <div className="flex flex-wrap items-center gap-3 mb-10 pb-6 border-b border-navy/10">
          <MonoLabel>[ filtrando ]</MonoLabel>
          {selectedArea && (
            <span className="inline-flex items-center gap-2 bg-navy text-cream text-xs font-mono tracking-wider uppercase px-3 py-1.5 rounded-full">
              {PRODUCT_AREAS.find((a) => a.slug === selectedArea)?.name}
              <button
                onClick={() => setSelectedArea(null)}
                className="text-cream/60 hover:text-cream"
                aria-label="Remover filtro"
              >
                ×
              </button>
            </span>
          )}
          {selectedType && (
            <span className="inline-flex items-center gap-2 bg-navy text-cream text-xs font-mono tracking-wider uppercase px-3 py-1.5 rounded-full">
              {selectedType}
              <button
                onClick={() => setSelectedType(null)}
                className="text-cream/60 hover:text-cream"
                aria-label="Remover filtro"
              >
                ×
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setSelectedArea(null);
              setSelectedType(null);
            }}
            className="text-xs font-mono tracking-wider uppercase text-muted hover:text-navy underline underline-offset-4"
          >
            Limpar
          </button>
        </div>
      )}

      {/* ─── Grid ─── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-muted text-center py-20 font-serif italic text-2xl">
          Nada encontrado.
        </p>
      )}
    </>
  );
}
