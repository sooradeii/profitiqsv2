import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/products";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/components/product-card";
import { TrackView } from "@/components/track-view";

export const metadata: Metadata = {
  title: "Essential",
  description: "The practical foundation tier — one workbook per industry covering the core entry, tracking, and dashboard sheets.",
  alternates: { canonical: "/essential" },
};

export default function EssentialPage() {
  const products = PRODUCTS.filter((p) => p.tier === "essential");
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:py-20">
      <TrackView event={{ name: "tier_view", tier: "essential" }} />
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-wide text-fg-soft">Tier</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">Essential</h1>
        <p className="mt-3 max-w-2xl text-base text-fg-soft">
          For business owners who want the practical foundation — one
          workbook covering the core entry, tracking, and dashboard sheets
          for their industry, without the deeper analytics of Elite.
        </p>
      </Reveal>
      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
