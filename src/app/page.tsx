import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, TrendingUp, Layers, Target, Repeat } from "lucide-react";
import { getNiches, getProduct, PRODUCTS } from "@/lib/products";
import { FAQ_ITEMS } from "@/lib/faq";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/components/product-card";
import { StatCounter } from "@/components/stat-counter";
import { Ticker } from "@/components/ticker";

export const metadata: Metadata = {
  title: "ProfitIQS — Financial Intelligence Systems for Business Owners",
  description:
    "Practical financial and operational intelligence systems built around the numbers that matter — revenue, expenses, profitability, cash flow, performance, and planning. 63 systems across 21 business categories.",
  alternates: { canonical: "/" },
};

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
  const niches = getNiches();
  const featured = FEATURED_SLUGS.map((slug) => getProduct(slug, "essential")).filter((p) => !!p);
  const heroCovers = HERO_COVER_SLUGS.map((slug) => getProduct(slug, "complete")).filter((p) => !!p);
  const autoRepairComplete = getProduct("auto-repair", "complete")!;

  // Real ticker data: every industry paired with its real Essential price.
  const tickerItems = niches.map((n) => ({
    label: n.shortName,
    value: `$${getProduct(n.slug, "essential")?.price ?? "—"}`,
  }));

  return (
    <div>
      {/* ===== HERO — dark, confident, tight tracking ===== */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-[1280px] px-5 pb-14 pt-16 sm:px-8 lg:pb-20 lg:pt-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <Reveal className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5">
                <span className="pulse-dot" />
                <span className="font-mono text-[11px] font-medium text-white/70">63 real systems &middot; live catalog</span>
              </div>
              <h1 className="mt-5 font-display text-[2.85rem] font-extrabold leading-[0.98] tracking-[-0.03em] sm:text-[4rem]">
                Run your business
                <br />
                on real numbers.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
                Practical financial and operational intelligence systems
                built around the numbers that matter — revenue, expenses,
                profitability, cash flow, performance, and planning.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                >
                  Explore the Systems
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/industries"
                  className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Find Your Industry
                </Link>
              </div>
              <div className="mt-10 flex gap-8 border-t border-white/10 pt-6">
                <div>
                  <p className="font-display text-3xl font-extrabold tabular-nums"><StatCounter value={PRODUCTS.length} /></p>
                  <p className="mt-1 font-mono text-[11px] text-white/45">Real systems</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-extrabold tabular-nums"><StatCounter value={niches.length} /></p>
                  <p className="mt-1 font-mono text-[11px] text-white/45">Categories</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-extrabold tabular-nums">3</p>
                  <p className="mt-1 font-mono text-[11px] text-white/45">Tiers each</p>
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
                        "glow-card cover-lift relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] " +
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
              Most owners can see revenue. Fewer can quickly see what&apos;s
              actually profitable, where costs are growing, which areas need
              attention, how cash is moving, and what deserves action next.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Reveal className="sm:col-span-2 sm:row-span-2">
              <div className="glow-card flex h-full flex-col justify-between rounded-[var(--radius-card)] border border-border bg-ink p-7 text-white">
                <TrendingUp className="size-6 text-accent" />
                <div>
                  <h3 className="mt-6 font-display text-xl">What&apos;s profitable</h3>
                  <p className="mt-2 text-sm text-white/60">
                    Margin by job, product, or client — not one blended
                    number that hides the ones losing you money.
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
                  <div className={isComplete ? "glow-card flex h-full flex-col rounded-[var(--radius-card)] border-2 border-ink bg-bg p-7" : "glow-card flex h-full flex-col rounded-[var(--radius-card)] border border-border bg-bg p-7"}>
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
                <span className="font-mono text-4xl font-bold text-accent-soft">{s.n}</span>
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

      {/* ===== AFFILIATE CTA ===== */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 rounded-[var(--radius-card)] border border-border bg-surface p-8 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-display text-xl text-fg">Promote ProfitIQS</h2>
                <p className="mt-1 max-w-md text-sm text-fg-soft">
                  63 products across 21 categories, sold through Digistore24 — see the affiliate program.
                </p>
              </div>
              <Link href="/affiliate" className="shrink-0 rounded-[var(--radius-control)] border border-border px-5 py-2.5 text-sm font-semibold text-fg hover:border-fg-soft">
                Affiliate info
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              Find the system built for your business.
            </h2>
            <p className="mt-4 text-white/65">
              63 systems, 21 categories, 3 tiers — one payment, no subscription.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/products" className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-accent px-7 py-3.5 text-sm font-semibold text-white hover:bg-accent-hover">
                Explore the Systems
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/industries" className="rounded-[var(--radius-control)] border border-white/25 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10">
                Find Your Industry
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
