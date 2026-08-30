import Link from "next/link";
import Image from "next/image";
import { canBuyNow, type Product } from "@/lib/products";

const TIER_BADGE_STYLE: Record<string, string> = {
  essential: "bg-surface-muted text-fg-soft",
  elite: "bg-accent-soft text-accent",
  complete: "bg-success-soft text-success",
};

export function ProductCard({ product }: { product: Product }) {
  const buyNow = canBuyNow(product);
  return (
    <Link
      href={`/products/${product.id}`}
      className="card-hover flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface"
    >
      {product.coverImage && (
        <div className="cover-lift relative aspect-[3/4] w-full overflow-hidden bg-surface-muted">
          <Image
            src={product.coverImage}
            alt={`${product.industry} — ${product.tierLabel} cover`}
            fill
            className="object-contain p-3"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            loading="lazy"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${TIER_BADGE_STYLE[product.tier]}`}>
            {product.tierLabel}
          </span>
          <span className="text-[11px] text-fg-soft">{product.category}</span>
        </div>
        <h3 className="mt-3 font-display text-base font-bold leading-snug text-fg">
          {product.industry}
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-fg-soft">{product.heroLine}</p>
        <div className="mt-4 flex items-center justify-between">
          {product.price !== null ? (
            <span className="font-display text-lg font-extrabold tabular-nums text-fg">${product.price}</span>
          ) : (
            <span className="text-sm text-fg-soft">Pricing TBA</span>
          )}
          <span className={buyNow ? "text-sm font-semibold text-accent" : "text-sm font-medium text-fg-soft"}>
            {buyNow ? "View system →" : "Coming soon"}
          </span>
        </div>
      </div>
    </Link>
  );
}
