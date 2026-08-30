import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/products";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/components/product-card";
import { TrackView } from "@/components/track-view";

export const metadata: Metadata = {
  title: "Complete",
  description: "Both the Essential and Elite workbooks bundled together for each industry, in one purchase.",
  alternates: { canonical: "/complete" },
};

export default function CompletePage() {
  const products = PRODUCTS.filter((p) => p.tier === "complete");
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:py-20">
      <TrackView event={{ name: "tier_view", tier: "complete" }} />
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-wide text-success">Tier</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">Complete</h1>
        <p className="mt-3 max-w-2xl text-base text-fg-soft">
          For business owners who want the full system — both the Essential
          and Elite workbooks for their industry, bundled together with the
          Field Guide and Quick Start, in one purchase.
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
