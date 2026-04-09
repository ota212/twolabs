"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/product-card";
import { PRODUCT_CONTENT, PRODUCT_AREAS, type ProductArea } from "@/lib/product-content";

type SortOption = "recent" | "price_asc" | "price_desc";

export function CatalogClient({
  products,
}: {
  products: Product[];
}) {
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("recent");

  // Tipos de produto derivados dos produtos reais (planilhas, documentos, etc.)
  const productTypes = useMemo(() => {
    const types = [...new Set(products.map((p) => p.category).filter(Boolean))] as string[];
    return types.sort();
  }, [products]);

  // Áreas que têm produtos reais
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
      {/* ─── Áreas temáticas ─── */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-navy/70 mb-4">Áreas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRODUCT_AREAS.map((area) => {
            const isActive = selectedArea === area.slug;
            const hasProducts = activeAreaSlugs.has(area.slug);
            const isComingSoon = area.comingSoon || !hasProducts;

            return (
              <button
                key={area.slug}
                onClick={() => handleAreaClick(area)}
                disabled={isComingSoon}
                className={`relative flex flex-col items-center text-center p-4 rounded-xl border transition-all ${
                  isActive
                    ? "bg-navy text-white border-navy shadow-lg scale-[1.02]"
                    : isComingSoon
                    ? "bg-navy/[0.02] border-navy/5 text-navy/30 cursor-not-allowed"
                    : "bg-white border-navy/10 hover:border-navy/30 hover:shadow-md text-navy"
                }`}
              >
                <span className="text-2xl mb-1.5">{area.icon}</span>
                <span className="font-bold text-sm">{area.name}</span>
                <span className={`text-xs mt-0.5 ${isActive ? "text-white/70" : isComingSoon ? "text-navy/20" : "text-navy/50"}`}>
                  {area.description}
                </span>
                {isComingSoon && (
                  <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider text-navy/25">
                    Em breve
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Filtros e busca ─── */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-navy/10 rounded px-4 py-2 bg-white focus:outline-none focus:border-electric-blue transition-colors md:w-64"
        />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType(null)}
            className={`px-4 py-2 rounded text-sm font-bold transition-colors ${
              selectedType === null
                ? "bg-navy text-white"
                : "bg-white border border-navy/10 hover:border-navy/30"
            }`}
          >
            Todos os tipos
          </button>
          {productTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(selectedType === type ? null : type)}
              className={`px-4 py-2 rounded text-sm font-bold transition-colors ${
                selectedType === type
                  ? "bg-navy text-white"
                  : "bg-white border border-navy/10 hover:border-navy/30"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="border border-navy/10 rounded px-4 py-2 bg-white focus:outline-none focus:border-electric-blue md:ml-auto"
        >
          <option value="recent">Mais recente</option>
          <option value="price_asc">Menor preço</option>
          <option value="price_desc">Maior preço</option>
        </select>
      </div>

      {/* ─── Filtros ativos ─── */}
      {(selectedArea || selectedType) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-navy/50">Filtrando por:</span>
          {selectedArea && (
            <span className="inline-flex items-center gap-1.5 bg-navy/5 text-navy text-sm font-medium px-3 py-1 rounded-full">
              {PRODUCT_AREAS.find((a) => a.slug === selectedArea)?.icon}{" "}
              {PRODUCT_AREAS.find((a) => a.slug === selectedArea)?.name}
              <button onClick={() => setSelectedArea(null)} className="ml-1 text-navy/40 hover:text-navy">
                ✕
              </button>
            </span>
          )}
          {selectedType && (
            <span className="inline-flex items-center gap-1.5 bg-navy/5 text-navy text-sm font-medium px-3 py-1 rounded-full">
              {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
              <button onClick={() => setSelectedType(null)} className="ml-1 text-navy/40 hover:text-navy">
                ✕
              </button>
            </span>
          )}
          <button
            onClick={() => { setSelectedArea(null); setSelectedType(null); }}
            className="text-xs text-navy/40 hover:text-navy underline ml-2"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* ─── Grid de produtos ─── */}
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
