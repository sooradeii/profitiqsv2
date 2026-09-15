import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, Download, ShieldCheck, Mail } from "lucide-react";
import { PRODUCTS, REFUND_DAYS, getProductById, getProductsByNiche, canBuyNow } from "@/lib/products";
import { SITE } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";
import { TrackView } from "@/components/track-view";
import { BuyNowLink } from "@/components/buy-now-link";
import { DigistorePromocode } from "@/components/digistore-promocode";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return {};
  return {
    title: `${product.industry} — ${product.tierLabel}`,
    description: product.heroLine,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: product.coverImage
      ? { images: [{ url: product.coverImage }] }
      : undefined,
  };
}

const TIER_ORDER = ["essential", "elite", "complete"] as const;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const siblingTiers = getProductsByNiche(product.slug).sort(
    (a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier),
  );
  const buyNow = canBuyNow(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.displayName,
    description: product.heroLine,
    category: product.category,
    image: product.coverImage ? `${SITE.url}${product.coverImage}` : undefined,
    brand: { "@type": "Brand", name: SITE.name },
    offers: product.price !== null
      ? {
          "@type": "Offer",
          price: product.price,
          priceCurrency: product.currency,
          availability: buyNow ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
          url: product.digistoreCheckoutUrl ?? undefined,
        }
      : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Products", item: `${SITE.url}/products` },
      { "@type": "ListItem", position: 3, name: `${product.industry} — ${product.tierLabel}`, item: `${SITE.url}/products/${product.id}` },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <TrackView event={{ name: "product_view", productId: product.id, slug: product.slug, tier: product.tier }} />
      {product.digistoreProductId && (
        <DigistorePromocode referenceProductId={product.digistoreProductId} />
      )}

      <nav className="border-b border-border px-5 py-3 text-xs text-fg-soft sm:px-8">
        <Link href="/">Home</Link> / <Link href="/products">Products</Link> / {product.industry} {product.tierLabel}
      </nav>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <Reveal className="min-w-0">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                {product.category} &middot; {product.tierLabel}
              </p>
              <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-fg sm:text-5xl">
                {product.industry}
              </h1>
              <p className="mt-4 max-w-lg font-display text-xl font-bold text-accent">{product.heroLine}</p>
              <p className="mt-3 max-w-lg text-sm text-fg-soft">
                Track revenue, costs, margins, and business performance in
                one system built specifically for {product.category.toLowerCase()}
                {" "}businesses.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {product.price !== null && (
                  <span className="font-display text-3xl font-extrabold tabular-nums text-fg">${product.price}</span>
                )}
                <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-fg-soft">one-time payment</span>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-success">
                <ShieldCheck className="size-4" /> 60-day money-back guarantee, no questions asked
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {buyNow ? (
                  <BuyNowLink
                    productId={product.id}
                    price={product.price}
                    url={product.digistoreCheckoutUrl!}
                    className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-success px-7 py-3.5 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Buy Now — ${product.price}
                  </BuyNowLink>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-border px-7 py-3.5 text-sm font-semibold text-fg-soft">
                    Coming Soon
                  </span>
                )}
                <a href={`mailto:${SITE.supportEmail}`} className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-border px-7 py-3.5 text-sm font-semibold text-fg hover:border-fg-soft">
                  Ask a question
                </a>
              </div>

              <div className="mt-6 flex flex-col gap-2 text-xs text-fg-soft">
                <span className="flex items-center gap-1.5"><Download className="size-3.5" /> Digital product — downloadable after purchase, delivered via Digistore24.</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="size-3.5" /> {REFUND_DAYS}-day return window via Digistore24 — see the <Link href="/refund-policy" className="underline">Refund Policy</Link>.</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            {product.coverImage && (
              <div className="cover-lift relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface shadow-[0_28px_56px_-28px_rgba(17,19,24,0.35)]">
                <Image
                  src={product.coverImage}
                  alt={`${product.industry} — ${product.tierLabel} cover`}
                  fill
                  className="object-contain p-4"
                  sizes="400px"
                  priority
                />
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* What's included */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8">
          <Reveal>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-fg">What&apos;s included</h2>
            <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {product.includedFiles.map((f) => (
                <li key={f} className="flex items-start gap-2.5 rounded-[var(--radius-control)] border border-border bg-bg p-3.5 text-sm text-fg">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Core capabilities -- real sheet names */}
      {product.features.length > 0 && (
        <section className="border-b border-border">
          <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8">
            <Reveal>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-fg">What the workbook covers</h2>
              <p className="mt-2 max-w-xl text-sm text-fg-soft">
                The real section list from the {product.tierLabel} workbook — nothing here is a mockup.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {product.features.map((f) => (
                  <span key={f} className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-fg">
                    {f}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Who it's for */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8">
          <Reveal>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-fg">Who it&apos;s for</h2>
            <p className="mt-3 max-w-xl text-sm text-fg-soft">{product.audience}</p>
          </Reveal>
        </div>
      </section>

      {/* Tier context */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8">
          <Reveal>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-fg">Compare the {product.industry} tiers</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {siblingTiers.map((sib, i) => {
              const isCurrent = sib.id === product.id;
              return (
                <Reveal key={sib.id} delay={i * 80}>
                  <div
                    className={
                      isCurrent
                        ? "flex h-full flex-col rounded-[var(--radius-card)] border-2 border-violet bg-violet-soft p-6"
                        : "flex h-full flex-col rounded-[var(--radius-card)] border border-border bg-bg p-6"
                    }
                  >
                    <h3 className="font-display text-lg font-bold text-fg">{sib.tierLabel}</h3>
                    {sib.price !== null && <p className="mt-2 font-display text-2xl font-extrabold text-fg">${sib.price}</p>}
                    {isCurrent ? (
                      <span className="mt-4 text-xs font-semibold text-accent">You&apos;re viewing this tier</span>
                    ) : (
                      <Link href={`/products/${sib.id}`} className="mt-4 text-sm font-semibold text-accent">
                        View {sib.tierLabel} &rarr;
                      </Link>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-surface text-white">
        <div className="mx-auto max-w-2xl px-5 py-16 text-center sm:px-8">
          <Reveal>
            <p className="flex items-center justify-center gap-2 text-xs text-white/50">
              <Mail className="size-3.5" /> {SITE.supportEmail}
            </p>
            <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight">
              Get {product.industry} — {product.tierLabel}
              {product.price !== null ? ` — $${product.price}` : ""}
            </h2>
            <div className="mt-6">
              {buyNow ? (
                <BuyNowLink
                  productId={product.id}
                  price={product.price}
                  url={product.digistoreCheckoutUrl!}
                  className="rounded-[var(--radius-control)] bg-success px-7 py-3.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  Buy Now
                </BuyNowLink>
              ) : (
                <Link href="/contact" className="rounded-[var(--radius-control)] border border-white/25 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10">
                  Get notified when checkout is live
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
