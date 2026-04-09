import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatPrice, isNew } from "@/lib/utils";
import { PRODUCT_CONTENT } from "@/lib/product-content";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="group block bg-white rounded-lg overflow-hidden border border-navy/5 hover:border-electric-blue/30 transition-colors"
    >
      <div className="aspect-[4/3] bg-navy/5 relative overflow-hidden">
        {(product.image_url || PRODUCT_CONTENT[product.slug]?.heroImage) ? (
          <Image
            src={(product.image_url ?? PRODUCT_CONTENT[product.slug]?.heroImage) as string}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
