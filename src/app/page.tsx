import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Download, ShieldCheck, Search } from "lucide-react";
import { TrendingUp, Layers, Target, Repeat } from "lucide-react";
import { getNiches, getProduct, getProductById, getProductsByNiche, canBuyNow, PRODUCTS } from "@/lib/products";
import { FAQ_ITEMS, REVIEW_FAQ_ITEMS } from "@/lib/faq";
import { REVIEW_MODE, REVIEW_PRIMARY_PRODUCT_ID, REVIEW_PRIMARY_NICHE_SLUG, SITE } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/components/product-card";
import { StatCounter } from "@/components/stat-counter";
import { Ticker } from "@/components/ticker";
import { BuyNowLink } from "@/components/buy-now-link";

const FULL_CATALOG_METADATA: Metadata = {
  title: "ProfitIQS — Business Management Systems for Business Owners",
  description:
    "Practical business management systems built around the numbers that matter — revenue, expenses, cash flow, performance, and planning. 63 systems across 21 business categories.",
  alternates: { canonical: "/" },
};

const REVIEW_METADATA: Metadata = {
  title: "ProfitIQS — Auto Repair Shop Business Intelligence System",
  description:
    "A business intelligence system built specifically for independent auto repair shops — repair order tracking, parts and labor, inventory, cash flow, and reporting in one workbook.",
  alternates: { canonical: "/" },
};

export const metadata: Metadata = REVIEW_MODE ? REVIEW_METADATA : FULL_CATALOG_METADATA;

// Deterministic featured selection -- not randomized per render.
const FEATURED_SLUGS = [
  "1099-income",
  "airbnb",
  "ecommerce",
  "electrical-contractor",
  "restaurant",
  "roofing",
  "small-business",
  "trucking-owner-operator",
];

// Hero composition covers -- real products, fixed selection.
const HERO_COVER_SLUGS = ["airbnb", "electrical-contractor", "restaurant", "roofing", "ecommerce", "trucking-owner-operator", "1099-income"];

const TIERS = [
  {
    tier: "essential" as const,
    name: "Essential",
    body: "The practical foundation — one workbook covering the core entry, tracking, and dashboard sheets.",
  },
  {
    tier: "elite" as const,
    name: "Elite",
    body: "Deeper analytics, KPI tracking, forecasting, and reporting built specifically for that industry.",
  },
  {
    tier: "complete" as const,
    name: "Complete",
    body: "Both workbooks bundled together, with the full Field Guide and Quick Start.",
  },
];

export default function HomePage() {
  if (REVIEW_MODE) return <ReviewHomePage />;
  return <FullCatalogHomePage />;
}

// ============================================================================
// Full-catalog homepage -- UNCHANGED, kept intact for when the other 20
// industries / 60 products are restored (flip REVIEW_MODE to false).
// ============================================================================
function FullCatalogHomePage() {
  const niches = getNiches();
  const featured = FEATURED_SLUGS.map((slug) => getProduct(slug, "essential")).filter((p) => !!p);
  const heroCovers = HERO_COVER_SLUGS.map((slug) => getProduct(slug, "complete")).filter((p) => !!p);
  const autoRepairComplete = getProduct("auto-repair", "complete")!;

  // Ecosystem ticker -- structural facts derived from real data, not a
  // price list.
  const tickerItems = [
    `${niches.length} Business Categories`,
    `${PRODUCTS.length} Business Management Systems`,
    "Essential",
    "Elite",
    "Complete",
  ];

  return (
    <div>
      {/* ===== HERO — light, confident, weight/color-driven accent ===== */}
      <section className="hero-surface">
        <div className="mx-auto max-w-[1280px] px-5 pb-10 pt-12 sm:px-8 lg:pb-14 lg:pt-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <Reveal className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5">
                <span className="pulse-dot" />
                <span className="font-mono text-[11px] font-medium text-fg-soft">63 real systems &middot; 21 business categories</span>
              </div>
              <h1 className="mt-5 font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.02em] text-fg sm:text-[3.5rem]">
                Run your business
                <span className="-mt-1 block font-handwritten text-[3.4rem] font-bold leading-[0.85] tracking-normal text-accent sm:text-[4.4rem]">
                  on real numbers.
                </span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-fg-soft sm:text-lg">
                Practical business management systems built around the
                numbers that matter — revenue, expenses, cash flow,
                performance, and planning.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                >
                  Explore the Systems
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/industries"
                  className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-border px-6 py-3.5 text-sm font-semibold text-fg transition-colors hover:bg-surface-muted"
                >
                  Find Your Industry
                </Link>
              </div>
              <div className="mt-8 flex gap-8 border-t border-border pt-5">
                <div>
                  <p className="font-display text-3xl font-extrabold tabular-nums text-fg"><StatCounter value={PRODUCTS.length} /></p>
                  <p className="mt-1 font-mono text-[11px] text-fg-soft">Real systems</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-extrabold tabular-nums text-fg"><StatCounter value={niches.length} /></p>
                  <p className="mt-1 font-mono text-[11px] text-fg-soft">Categories</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-extrabold tabular-nums text-fg">3</p>
                  <p className="mt-1 font-mono text-[11px] text-fg-soft">Tiers each</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="mx-auto w-full max-w-md">
                <div className="grid w-full grid-cols-3 gap-3">
                  {heroCovers.slice(0, 6).map((p, i) => (
                    <div
                      key={p.id}
                      className={
                        "glow-card cover-lift relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] border border-border bg-white shadow-[0_20px_50px_-20px_rgba(17,19,24,0.25)] " +
                        (i === 0 ? "col-span-2 row-span-2" : "")
                      }
                    >
                      {p.coverImage && (
                        <Image
                          src={p.coverImage}
                          alt={`${p.industry} cover`}
                          fill
                          className="object-contain p-2"
                          sizes="200px"
                          priority={i === 0}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Real-data ticker -- every industry + its real Essential price */}
      <Ticker items={tickerItems} />

      {/* ===== PROBLEM RECOGNITION — bento grid, size-as-hierarchy ===== */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <h2 className="max-w-2xl font-display text-3xl tracking-tight text-fg sm:text-4xl">
              Your business is moving. Can you see the numbers?
            </h2>
            <p className="mt-4 max-w-2xl text-base text-fg-soft">
              Most owners can see revenue. Fewer can quickly see margin by
              job or client, where costs are growing, which areas need
              attention, how cash is moving, and what deserves action next.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Reveal className="sm:col-span-2 sm:row-span-2">
              <div className="glow-card cta-surface flex h-full flex-col justify-between rounded-[var(--radius-card)] border border-border p-7 text-white">
                <TrendingUp className="size-6 text-accent" />
                <div>
                  <h3 className="mt-6 font-display text-xl">Margin by job or client</h3>
                  <p className="mt-2 text-sm text-white/60">
                    Cost and revenue broken out by job, product, or client
                    — not one blended number that hides the details.
                  </p>
                </div>
              </div>
            </Reveal>
            {[
              { icon: Target, title: "Where costs grow", body: "Track expenses against budget before they compound." },
              { icon: Layers, title: "What needs attention", body: "One score summarizing where the business is fragile." },
              { icon: Repeat, title: "How cash moves", body: "A monthly routine, not a once-a-year scramble." },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 70} className="sm:col-span-2">
                <div className="glow-card rounded-[var(--radius-card)] border border-border bg-bg p-5">
                  <c.icon className="size-5 text-accent" />
                  <h3 className="mt-3 text-sm font-semibold text-fg">{c.title}</h3>
                  <p className="mt-1.5 text-sm text-fg-soft">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FIND YOUR SYSTEM ===== */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">
              Find your system
            </h2>
            <p className="mt-3 max-w-xl text-base text-fg-soft">
              What kind of business do you run?
            </p>
            <Link
              href="/products"
              className="mt-6 flex max-w-xl items-center gap-3 rounded-[var(--radius-card)] border border-border bg-surface px-5 py-4 text-fg-soft transition-colors hover:border-fg-soft"
            >
              <Search className="size-5 shrink-0" />
              <span className="text-sm">Search by industry, e.g. &ldquo;restaurant&rdquo; or &ldquo;HVAC&rdquo;</span>
            </Link>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {niches.map((n, i) => (
              <Reveal key={n.slug} delay={(i % 8) * 40}>
                <Link
                  href={`/industries/${n.slug}`}
                  className="card-hover flex h-full flex-col justify-between rounded-[var(--radius-card)] border border-border bg-surface p-4"
                >
                  <div>
                    <p className="text-[11px] font-medium text-fg-soft">{n.category}</p>
                    <p className="mt-1 text-sm font-semibold text-fg">{n.shortName}</p>
                  </div>
                  <p className="mt-3 text-[11px] font-medium text-accent">3 tiers available</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED SYSTEMS ===== */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">
                Featured systems
              </h2>
              <Link href="/products" className="hidden text-sm font-semibold text-accent sm:inline">
                View all 63 &rarr;
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY PROFITIQS ===== */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">Why ProfitIQS</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Business-specific", body: "Built around the metrics each business type actually watches, not a generic template." },
              { title: "Real numbers", body: "Your revenue and expense data becomes a clearer picture of performance." },
              { title: "Practical", body: "Designed for recurring monthly use, not a one-time analysis." },
              { title: "Structured", body: "From source data to dashboards, KPI reports, and planning in one workbook." },
            ].map((b, i) => (
              <Reveal key={b.title} delay={i * 70}>
                <h3 className="font-display text-lg text-fg">{b.title}</h3>
                <p className="mt-2 text-sm text-fg-soft">{b.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TIERS ===== */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">Essential, Elite, or Complete</h2>
            <p className="mt-3 max-w-xl text-base text-fg-soft">
              Every system uses the same three-tier structure across all 21 industries.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {TIERS.map((t, i) => {
              const sample = autoRepairComplete.tier === t.tier ? autoRepairComplete : getProduct("auto-repair", t.tier);
              const isComplete = t.tier === "complete";
              return (
                <Reveal key={t.tier} delay={i * 90}>
                  <div className={isComplete ? "glow-card flex h-full flex-col rounded-[var(--radius-card)] border-2 border-violet bg-violet-soft p-7" : "glow-card flex h-full flex-col rounded-[var(--radius-card)] border border-border bg-bg p-7"}>
                    <h3 className="font-display text-lg text-fg">{t.name}</h3>
                    <p className="mt-2 flex-1 text-sm text-fg-soft">{t.body}</p>
                    {sample?.price !== null && sample?.price !== undefined && (
                      <p className="mt-4 font-mono text-2xl font-bold tabular-nums text-fg">
                        From <StatCounter value={sample.price} prefix="$" duration={800} />
                      </p>
                    )}
                    <Link href={`/${t.tier}`} className="mt-5 text-sm font-semibold text-accent">
                      See {t.name} systems &rarr;
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal>
            <Link href="/compare" className="mt-6 inline-block text-sm font-semibold text-accent">
              Compare all three tiers in detail &rarr;
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">How it works</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { n: "01", title: "Find your business", body: "Search or browse by industry to find your system." },
              { n: "02", title: "Choose your level", body: "Essential, Elite, or Complete — whatever fits how deep you want to go." },
              { n: "03", title: "Open and start tracking", body: "Enter your numbers and the dashboards do the rest." },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <span className="font-mono text-7xl font-extrabold text-violet/30">{s.n}</span>
                <h3 className="mt-3 font-display text-lg text-fg">{s.title}</h3>
                <p className="mt-2 text-sm text-fg-soft">{s.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-10 max-w-2xl border-t border-border pt-8 text-sm text-fg-soft">
              Your purchase is completed through Digistore24, ProfitIQS&apos;s
              checkout provider, and digital files are delivered through
              Digistore24&apos;s Download Vault after payment confirms.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">Frequently asked questions</h2>
          </Reveal>
          <dl className="mt-8 divide-y divide-border">
            {FAQ_ITEMS.slice(0, 8).map((item, i) => (
              <Reveal key={item.q} delay={i * 30} className="py-5">
                <dt className="font-semibold text-fg">{item.q}</dt>
                <dd className="mt-2 text-sm text-fg-soft">{item.a}</dd>
              </Reveal>
            ))}
          </dl>
          <Link href="/faq" className="mt-6 inline-block text-sm font-semibold text-accent">
            See the full FAQ &rarr;
          </Link>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="cta-surface text-white">
        <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              Find the system built for your business.
            </h2>
            <p className="mt-4 text-white/65">
              63 systems, 21 categories, 3 tiers — one payment, no subscription.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/products" className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-white px-7 py-3.5 text-sm font-semibold text-ink hover:bg-white/90">
                Explore the Systems
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/industries" className="rounded-[var(--radius-control)] border border-white/30 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10">
                Find Your Industry
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

const REVIEW_TIER_ORDER = ["essential", "elite", "complete"] as const;

// ============================================================================
// TEMPORARY Digistore24 review-mode homepage -- focused entirely on the
// single published niche (Auto Repair Shop, all 3 tiers -- Complete is
// Digistore24 product 720175, the one under active review). Built from
// real product data only; no invented customers, testimonials, numbers,
// or claims. See REVIEW_MODE in src/lib/site-config.ts to restore the
// full-catalog homepage above.
// ============================================================================
function ReviewHomePage() {
  const product = getProductById(REVIEW_PRIMARY_PRODUCT_ID);
  if (!product) return null; // can't happen -- REVIEW_PRIMARY_PRODUCT_ID always points at a real product
  const buyNow = canBuyNow(product);
  const faqPreview = REVIEW_FAQ_ITEMS.slice(0, 6);
  const tiers = getProductsByNiche(REVIEW_PRIMARY_NICHE_SLUG).sort(
    (a, b) => REVIEW_TIER_ORDER.indexOf(a.tier) - REVIEW_TIER_ORDER.indexOf(b.tier),
  );

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="hero-surface">
        <div className="mx-auto max-w-[1280px] px-5 pb-10 pt-12 sm:px-8 lg:pb-14 lg:pt-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <Reveal className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5">
                <span className="pulse-dot" />
                <span className="font-mono text-[11px] font-medium text-fg-soft">{product.category} &middot; {product.tierLabel}</span>
              </div>
              <h1 className="mt-5 font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.02em] text-fg sm:text-[3.5rem]">
                Business intelligence systems
                <span className="-mt-1 block font-handwritten text-[3.4rem] font-bold leading-[0.85] tracking-normal text-accent sm:text-[4.4rem]">
                  built around real numbers.
                </span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-fg-soft sm:text-lg">
                {product.heroLine} The {product.industry} system tracks
                repair orders, parts, labor, and shop performance in one
                Excel workbook — built specifically for independent auto
                repair shops.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {buyNow ? (
                  <BuyNowLink
                    productId={product.id}
                    price={product.price}
                    url={product.digistoreCheckoutUrl!}
                    className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-success px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
                  >
                    Buy Now — ${product.price}
                  </BuyNowLink>
                ) : (
                  <Link href={`/products/${product.id}`} className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover">
                    View the system
                    <ArrowRight className="size-4" />
                  </Link>
                )}
                <Link
                  href={`/products/${product.id}`}
                  className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-border px-6 py-3.5 text-sm font-semibold text-fg transition-colors hover:bg-surface-muted"
                >
                  See what&apos;s included
                </Link>
              </div>
              <p className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-success">
                <ShieldCheck className="size-4" /> 60-day money-back guarantee, no questions asked
              </p>
            </Reveal>

            <Reveal delay={120}>
              {product.coverImage && (
                <div className="cover-lift relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[var(--radius-card)] border border-border bg-white shadow-[0_20px_50px_-20px_rgba(17,19,24,0.25)]">
                  <Image
                    src={product.coverImage}
                    alt={`${product.industry} cover`}
                    fill
                    className="object-contain p-4"
                    sizes="400px"
                    priority
                  />
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== WHO IT'S FOR ===== */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <h2 className="max-w-2xl font-display text-3xl tracking-tight text-fg sm:text-4xl">Who it&apos;s for</h2>
            <p className="mt-4 max-w-2xl text-base text-fg-soft">{product.audience}</p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Reveal className="sm:col-span-2 sm:row-span-2">
              <div className="glow-card cta-surface flex h-full flex-col justify-between rounded-[var(--radius-card)] border border-border p-7 text-white">
                <TrendingUp className="size-6 text-accent" />
                <div>
                  <h3 className="mt-6 font-display text-xl">The real cost behind every repair order</h3>
                  <p className="mt-2 text-sm text-white/60">
                    Not just what you bill — labor, parts, and margin
                    broken out per repair order, not one blended number.
                  </p>
                </div>
              </div>
            </Reveal>
            {[
              { icon: Target, title: "Technician performance", body: "See labor sales and productivity by technician." },
              { icon: Layers, title: "Inventory and suppliers", body: "Track parts inventory and supplier activity in one place." },
              { icon: Repeat, title: "Monthly cash flow", body: "A monthly routine for reviewing cash flow and revenue." },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 70} className="sm:col-span-2">
                <div className="glow-card rounded-[var(--radius-card)] border border-border bg-bg p-5">
                  <c.icon className="size-5 text-accent" />
                  <h3 className="mt-3 text-sm font-semibold text-fg">{c.title}</h3>
                  <p className="mt-1.5 text-sm text-fg-soft">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHAT'S INCLUDED ===== */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">What&apos;s included</h2>
            <p className="mt-3 max-w-xl text-base text-fg-soft">
              The Complete edition — both the Essential and Elite workbooks, bundled together.
            </p>
          </Reveal>
          <ul className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {product.includedFiles.map((f) => (
              <li key={f} className="flex items-start gap-2.5 rounded-[var(--radius-control)] border border-border bg-surface p-3.5 text-sm text-fg">
                <Check className="mt-0.5 size-4 shrink-0 text-success" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== ESSENTIAL / ELITE / COMPLETE -- 3 real, live tiers ===== */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">Choose your tier</h2>
            <p className="mt-3 max-w-xl text-base text-fg-soft">
              {product.industry} is available in all three tiers.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {tiers.map((t, i) => {
              const tierBuyNow = canBuyNow(t);
              const isComplete = t.tier === "complete";
              return (
                <Reveal key={t.id} delay={i * 90}>
                  <div className={isComplete ? "glow-card flex h-full flex-col rounded-[var(--radius-card)] border-2 border-violet bg-violet-soft p-7" : "glow-card flex h-full flex-col rounded-[var(--radius-card)] border border-border bg-bg p-7"}>
                    <h3 className="font-display text-lg text-fg">{t.tierLabel}</h3>
                    {t.price !== null && <p className="mt-2 font-display text-2xl font-extrabold text-fg">${t.price}</p>}
                    <ul className="mt-4 flex-1 space-y-1.5 text-sm text-fg-soft">
                      {t.features.slice(0, 5).map((f) => <li key={f}>&#10003; {f}</li>)}
                    </ul>
                    <div className="mt-5 flex flex-col gap-2">
                      <Link href={`/products/${t.id}`} className="rounded-[var(--radius-control)] border border-border px-4 py-2.5 text-center text-sm font-semibold text-fg hover:border-fg-soft">
                        View details
                      </Link>
                      {tierBuyNow && (
                        <BuyNowLink
                          productId={t.id}
                          price={t.price}
                          url={t.digistoreCheckoutUrl!}
                          className="rounded-[var(--radius-control)] bg-success px-4 py-2.5 text-center text-sm font-semibold text-white hover:opacity-90"
                        >
                          Buy Now
                        </BuyNowLink>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">How it works</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { n: "01", title: "Review the product", body: "See what's included and who it's for on the product page." },
              { n: "02", title: "Buy Now via Digistore24", body: "Checkout runs entirely on Digistore24, ProfitIQS's checkout provider." },
              { n: "03", title: "Download and start tracking", body: "Your files arrive through Digistore24's Download Vault." },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <span className="font-mono text-7xl font-extrabold text-violet/30">{s.n}</span>
                <h3 className="mt-3 font-display text-lg text-fg">{s.title}</h3>
                <p className="mt-2 text-sm text-fg-soft">{s.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-10 max-w-2xl border-t border-border pt-8 text-sm text-fg-soft">
              Your purchase is completed through Digistore24, ProfitIQS&apos;s
              checkout provider, and digital files are delivered through
              Digistore24&apos;s Download Vault after payment confirms.
              ProfitIQS does not process or store your payment details.
            </p>
            <Link href="/how-it-works" className="mt-4 inline-block text-sm font-semibold text-accent">
              See the full flow &rarr;
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">Frequently asked questions</h2>
          </Reveal>
          <dl className="mt-8 divide-y divide-border">
            {faqPreview.map((item, i) => (
              <Reveal key={item.q} delay={i * 30} className="py-5">
                <dt className="font-semibold text-fg">{item.q}</dt>
                <dd className="mt-2 text-sm text-fg-soft">{item.a}</dd>
              </Reveal>
            ))}
          </dl>
          <Link href="/faq" className="mt-6 inline-block text-sm font-semibold text-accent">
            See the full FAQ &rarr;
          </Link>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="cta-surface text-white">
        <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              {product.industry} — {product.tierLabel}
            </h2>
            <p className="mt-4 text-white/65">
              ${product.price} — one-time payment, no subscription.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {buyNow ? (
                <BuyNowLink
                  productId={product.id}
                  price={product.price}
                  url={product.digistoreCheckoutUrl!}
                  className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-white px-7 py-3.5 text-sm font-semibold text-ink hover:bg-white/90"
                >
                  Buy Now — ${product.price}
                  <ArrowRight className="size-4" />
                </BuyNowLink>
              ) : (
                <Link href={`/products/${product.id}`} className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-white px-7 py-3.5 text-sm font-semibold text-ink hover:bg-white/90">
                  View the system
                  <ArrowRight className="size-4" />
                </Link>
              )}
              <Link href={`/products/${product.id}`} className="rounded-[var(--radius-control)] border border-white/30 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10">
                View full details
              </Link>
            </div>
            <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-white/50">
              <Download className="size-3.5" /> Delivered via Digistore24&apos;s Download Vault &middot; {SITE.supportEmail}
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
