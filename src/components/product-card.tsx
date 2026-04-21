import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatPrice, isNew } from "@/lib/utils";
import { PRODUCT_CONTENT, PRODUCT_AREAS } from "@/lib/product-content";
import { BrowserFrame } from "./browser-frame";
import { StarRating } from "./star-rating";

/**
 * Editorial product card.
 * - Image is wrapped in BrowserFrame to read as a real screenshot instead of
 *   generic laptop-on-desk stock photo.
 * - Rating + review count surface social proof on the card.
 * - Hover: subtle elevation + reveal of secondary "Ver detalhes" affordance.
 *
 * Rating data is placeholder (4.9 / 48) until real reviews are wired up —
 * see deliverables. Override via `rating`/`reviews` props when available.
 */
export function ProductCard({
  product,
  rating = 4.9,
  reviews = 48,
}: {
  product: Product;
  rating?: number;
  reviews?: number;
}) {
  const content = PRODUCT_CONTENT[product.slug];
  const area = content?.area ? PRODUCT_AREAS.find((a) => a.slug === content.area) : null;
  const img = product.image_url ?? content?.heroImage ?? null;
  const categoryLabel = area?.name ?? product.category ?? "Produto";
  const mockUrl = product.category === "planilha"
    ? "docs.google.com/spreadsheets"
    : product.category === "documento"
    ? "docs.google.com/document"
    : "doislabs.com.br";

  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="group relative block bg-cream-2 border border-navy/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-navy hover:shadow-[0_24px_60px_-30px_rgba(26,58,92,0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric-blue"
    >
      {/* Category tag (top-left, always visible) */}
      <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 bg-cream/95 backdrop-blur-sm border border-navy/10 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-navy">
        {area?.icon && <span className="text-sm leading-none">{area.icon}</span>}
        {categoryLabel}
      </span>

      {isNew(product.created_at) && (
        <span className="absolute top-4 right-4 z-10 font-mono text-[10px] tracking-widest uppercase bg-electric-blue text-white px-2.5 py-1 rounded-full">
          Novo
        </span>
      )}

      {/* Image in browser frame */}
      <div className="p-5 pb-0">
        <div className="aspect-[4/3] relative">
          <BrowserFrame url={mockUrl}>
            {img ? (
              <Image
                src={img}
                alt={`Prévia de ${product.name}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-navy/20 bg-cream-2">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            )}
          </BrowserFrame>
        </div>
      </div>

      {/* Meta */}
      <div className="p-6">
        <StarRating value={rating} count={reviews} />

        <h3 className="mt-3 font-serif italic text-[clamp(24px,2.2vw,32px)] leading-[1.08] tracking-[-0.01em] text-navy group-hover:text-electric-blue transition-colors">
          {product.name}
        </h3>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
              A partir de
            </span>
            <span className="text-xl font-semibold text-navy">
              {formatPrice(product.price_cents)}
            </span>
          </div>

          {/* Secondary affordance. Text reveals on hover; arrow always visible
              so touch users see the affordance without hover state. */}
          <span className="inline-flex items-center gap-2" aria-hidden="true">
            <span className="font-mono text-[11px] tracking-widest uppercase text-navy opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              Ver detalhes
            </span>
            <span className="w-10 h-10 rounded-full border border-navy/30 grid place-items-center text-navy transition-all duration-300 group-hover:bg-electric-blue group-hover:border-electric-blue group-hover:text-white group-hover:-rotate-45">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M2 8 h12 M9 3 l5 5 -5 5" />
              </svg>
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
