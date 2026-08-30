import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getNiches, getProductsByNiche, canBuyNow } from "@/lib/products";
import { Reveal } from "@/components/reveal";
import { TrackView } from "@/components/track-view";
import { BuyNowLink } from "@/components/buy-now-link";

export function generateStaticParams() {
  return getNiches().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const niche = getNiches().find((n) => n.slug === slug);
  if (!niche) return {};
  return {
    title: niche.shortName,
    description: `${niche.industry} — ${niche.heroLine}`,
    alternates: { canonical: `/industries/${slug}` },
  };
}

const TIER_ORDER = ["essential", "elite", "complete"] as const;

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const niche = getNiches().find((n) => n.slug === slug);
  if (!niche) notFound();

  const products = getProductsByNiche(slug).sort(
    (a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier),
  );
  const complete = products.find((p) => p.tier === "complete");

  return (
    <div>
      <TrackView event={{ name: "industry_view", slug: niche.slug }} />
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <Reveal className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">{niche.category}</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-fg sm:text-5xl">{niche.industry}</h1>
            <p className="mt-4 max-w-lg font-display text-xl font-bold text-accent">{niche.heroLine}</p>
            <p className="mt-3 max-w-lg text-sm text-fg-soft">{niche.audience}</p>
          </Reveal>
          {complete?.coverImage && (
            <Reveal delay={100}>
              <div className="cover-lift relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface shadow-[0_24px_48px_-24px_rgba(17,19,24,0.3)]">
                <Image src={complete.coverImage} alt={`${niche.industry} cover`} fill className="object-contain p-3" sizes="360px" priority />
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8">
        <Reveal>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-fg">Choose your tier</h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {products.map((p, i) => {
            const buyNow = canBuyNow(p);
            const isComplete = p.tier === "complete";
            return (
              <Reveal key={p.id} delay={i * 90}>
                <div className={isComplete ? "flex h-full flex-col rounded-[var(--radius-card)] border-2 border-gold bg-gold-soft p-6" : "flex h-full flex-col rounded-[var(--radius-card)] border border-border bg-surface p-6"}>
                  <h3 className="font-display text-lg font-bold text-fg">{p.tierLabel}</h3>
                  {p.price !== null && <p className="mt-2 font-display text-2xl font-extrabold text-fg">${p.price}</p>}
                  <ul className="mt-4 flex-1 space-y-1.5 text-sm text-fg-soft">
                    {p.features.slice(0, 5).map((f) => <li key={f}>&#10003; {f}</li>)}
                  </ul>
                  <div className="mt-5 flex flex-col gap-2">
                    <Link href={`/products/${p.id}`} className="rounded-[var(--radius-control)] border border-border px-4 py-2.5 text-center text-sm font-semibold text-fg hover:border-fg-soft">
                      View details
                    </Link>
                    {buyNow && (
                      <BuyNowLink
                        productId={p.id}
                        price={p.price}
                        url={p.digistoreCheckoutUrl!}
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
      </section>
    </div>
  );
}
