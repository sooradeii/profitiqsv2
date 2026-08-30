import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS, getNiches, getProductsByNiche } from "@/lib/products";
import { SITE } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";
import { TrackView } from "@/components/track-view";

export const metadata: Metadata = {
  title: "Affiliates",
  description: "How the ProfitIQS product ecosystem is structured for affiliates promoting through Digistore24.",
  alternates: { canonical: "/affiliate" },
};

const EXAMPLE_SLUGS = ["auto-repair", "restaurant", "airbnb", "hvac", "trucking-owner-operator", "ecommerce"];

const AFFILIATE_FAQ = [
  {
    q: "What is the commission rate?",
    a: "80% per sale, configured directly in Digistore24 on every ProfitIQS product listing.",
  },
  {
    q: "How do I get an affiliate link?",
    a: "Generate your Digistore24 affiliate link for a specific ProfitIQS product from your Digistore24 affiliate account, for the products you're approved to promote.",
  },
  {
    q: "Who handles tracking and payouts?",
    a: "Digistore24 handles all click tracking, attribution, and commission payouts. ProfitIQS does not run a separate affiliate system.",
  },
  {
    q: "Can I promote a specific tier only?",
    a: "Yes — every product family has its own Essential, Elite, and Complete listing, each with its own Digistore24 product ID and affiliate link.",
  },
];

export default function AffiliatePage() {
  const niches = getNiches();
  const examples = EXAMPLE_SLUGS
    .map((slug) => {
      const niche = niches.find((n) => n.slug === slug);
      const cover = getProductsByNiche(slug).find((p) => p.tier === "complete")?.coverImage;
      return niche ? { niche, cover } : null;
    })
    .filter((e): e is { niche: (typeof niches)[number]; cover: string | undefined } => !!e);

  return (
    <div>
      <TrackView event={{ name: "affiliate_page_view" }} />

      {/* Hero */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-5 py-14 text-center sm:px-8 lg:py-20">
          <Reveal>
            <h1 className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
              Promote systems built for real businesses.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-fg-soft">
              A financial intelligence product ecosystem, not a single offer —
              built from real business workbooks, sold through Digistore24.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div className="mx-auto mt-8 flex max-w-md justify-center gap-10">
              <div>
                <p className="font-display text-3xl font-extrabold text-fg">{PRODUCTS.length}</p>
                <p className="mt-1 text-xs font-medium text-fg-soft">Products</p>
              </div>
              <div>
                <p className="font-display text-3xl font-extrabold text-fg">{niches.length}</p>
                <p className="mt-1 text-xs font-medium text-fg-soft">Categories</p>
              </div>
              <div>
                <p className="font-display text-3xl font-extrabold text-fg">3</p>
                <p className="mt-1 text-xs font-medium text-fg-soft">Tiers</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How the ecosystem works */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-fg">How the ecosystem works</h2>
            <p className="mt-3 max-w-2xl text-base text-fg-soft">
              Every product family targets one specific type of business —
              auto repair, HVAC, restaurants, ecommerce, trucking, and{" "}
              {niches.length - 5} others. Each family has an Essential,
              Elite, and Complete tier at different price points, so an
              audience interested in one industry has three real products to
              promote, not one.
            </p>
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-2">
            {niches.map((n) => (
              <span key={n.slug} className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-fg">
                {n.shortName}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Industry examples with real covers */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-fg">A few of the 21 families</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {examples.map(({ niche, cover }, i) => (
              <Reveal key={niche.slug} delay={i * 60}>
                <Link href={`/industries/${niche.slug}`} className="card-hover flex h-full flex-col rounded-[var(--radius-card)] border border-border bg-bg p-3">
                  {cover && (
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[10px] border border-border bg-surface-muted">
                      <Image src={cover} alt="" fill className="object-contain p-1.5" sizes="160px" />
                    </div>
                  )}
                  <p className="mt-2 truncate text-xs font-semibold text-fg">{niche.shortName}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Commission + how links work */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:py-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-[var(--radius-card)] border border-border bg-surface p-7">
                <p className="font-display text-4xl font-extrabold text-accent">80%</p>
                <h3 className="mt-2 font-display text-lg font-bold text-fg">Commission per sale</h3>
                <p className="mt-2 text-sm text-fg-soft">
                  Configured directly in Digistore24 on every ProfitIQS
                  product listing, across all 63 products.
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="h-full rounded-[var(--radius-card)] border border-border bg-surface p-7">
                <h3 className="font-display text-lg font-bold text-fg">How affiliate links work</h3>
                <p className="mt-2 text-sm text-fg-soft">
                  All checkout, attribution, and payouts are handled entirely
                  by Digistore24, ProfitIQS&apos;s checkout provider.
                  Affiliates promote using Digistore24-generated links for
                  the specific products they&apos;re approved to promote.
                  ProfitIQS does not run its own affiliate tracking or
                  payout system.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Affiliate FAQ */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-fg">Affiliate FAQ</h2>
          </Reveal>
          <dl className="mt-6 divide-y divide-border">
            {AFFILIATE_FAQ.map((item, i) => (
              <Reveal key={item.q} delay={i * 40} className="py-5">
                <dt className="font-semibold text-fg">{item.q}</dt>
                <dd className="mt-2 text-sm text-fg-soft">{item.a}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Contact CTA */}
      <section>
        <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 rounded-[var(--radius-card)] border border-border bg-surface p-8 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-display text-xl font-bold text-fg">Affiliate inquiries</h2>
                <p className="mt-1 max-w-md text-sm text-fg-soft">
                  Questions about promoting ProfitIQS through Digistore24.
                </p>
              </div>
              <a href={`mailto:${SITE.supportEmail}`} className="shrink-0 rounded-[var(--radius-control)] bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover">
                {SITE.supportEmail}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
