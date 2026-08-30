import type { Metadata } from "next";
import { getCategories, PRODUCTS } from "@/lib/products";
import { SITE } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";
import { TrackView } from "@/components/track-view";

export const metadata: Metadata = {
  title: "Affiliates",
  description: "How the ProfitIQS product ecosystem is structured for affiliates promoting through Digistore24.",
  alternates: { canonical: "/affiliate" },
};

export default function AffiliatePage() {
  const categories = getCategories();
  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 lg:py-20">
      <TrackView event={{ name: "affiliate_page_view" }} />
      <Reveal>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">Affiliates</h1>
        <p className="mt-3 text-base text-fg-soft">
          ProfitIQS is a product ecosystem, not a single product: {PRODUCTS.length} products
          across {categories.length} business categories, each in three tiers
          (Essential, Elite, Complete).
        </p>
      </Reveal>

      <Reveal>
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold text-fg">How the ecosystem is structured</h2>
          <p className="mt-2 text-sm text-fg-soft">
            Every product family targets a specific business type — auto
            repair, HVAC, restaurants, ecommerce, trucking, and 17 others.
            Each family has an Essential, Elite, and Complete tier at
            different price points, so an audience interested in one
            industry has three real options to promote, not one.
          </p>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-8">
          <h2 className="font-display text-xl font-bold text-fg">Categories covered</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((c) => (
              <span key={c} className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-fg">
                {c}
              </span>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-8">
          <h2 className="font-display text-xl font-bold text-fg">How affiliate links work</h2>
          <p className="mt-2 text-sm text-fg-soft">
            All checkout and affiliate attribution is handled entirely by
            Digistore24, ProfitIQS&apos;s checkout provider. Affiliates
            promote using Digistore24-generated links for the specific
            products they&apos;re approved to promote. ProfitIQS does not
            run its own affiliate tracking or payout system.
          </p>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-8 rounded-[var(--radius-card)] border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-bold text-fg">Contact</h2>
          <p className="mt-2 text-sm text-fg-soft">
            Affiliate inquiries: <a href={`mailto:${SITE.supportEmail}`} className="font-semibold text-accent">{SITE.supportEmail}</a>
          </p>
        </section>
      </Reveal>
    </div>
  );
}
