import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/products";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/components/product-card";
import { TrackView } from "@/components/track-view";

export const metadata: Metadata = {
  title: "Elite",
  description: "The advanced tier — deeper analytics, KPI tracking, forecasting, and reporting built specifically for each industry.",
  alternates: { canonical: "/elite" },
};

export default function ElitePage() {
  const products = PRODUCTS.filter((p) => p.tier === "elite");
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:py-20">
      <TrackView event={{ name: "tier_view", tier: "elite" }} />
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Tier</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">Elite</h1>
        <p className="mt-3 max-w-2xl text-base text-fg-soft">
          For business owners who need deeper analytics, planning,
          reporting, and intelligence — KPI scorecards, forecasting, and
          business health scoring built specifically for that industry.
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
