import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatPrice, isNew } from "@/lib/utils";
import { PRODUCT_CONTENT, PRODUCT_AREAS } from "@/lib/product-content";

export function ProductCard({ product }: { product: Product }) {
  const content = PRODUCT_CONTENT[product.slug];
  const area = content?.area ? PRODUCT_AREAS.find((a) => a.slug === content.area) : null;
  const img = product.image_url ?? content?.heroImage ?? null;

  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="group block bg-cream-2 border border-navy/10 hover:border-navy transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-navy/5 relative overflow-hidden">
        {img ? (
          <Image
            src={img}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-navy/20">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        )}
        {isNew(product.created_at) && (
          <span className="absolute top-4 left-4 font-mono text-[11px] tracking-widest uppercase bg-electric-blue text-white px-2.5 py-1">
            Novo
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-navy/50">
            {area ? `${area.icon} ${area.name}` : product.category ?? "Produto"}
          </span>
        </div>

        <h3 className="font-serif italic text-[clamp(26px,2.4vw,36px)] leading-[1.05] tracking-[-0.01em] text-navy group-hover:text-electric-blue transition-colors">
          {product.name}
        </h3>

        <div className="mt-5 flex items-end justify-between">
          <p className="text-lg font-semibold">
            {formatPrice(product.price_cents)}
          </p>
          <span
            className="w-10 h-10 rounded-full border border-navy/30 grid place-items-center text-navy transition-all duration-300 group-hover:bg-electric-blue group-hover:border-electric-blue group-hover:text-white group-hover:-rotate-45"
            aria-hidden="true"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M2 8 h12 M9 3 l5 5 -5 5" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
