import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getNiches, getProductsByNiche } from "@/lib/products";
import { REVIEW_MODE, isPublishedNicheSlug } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Industries",
  description: "Business categories ProfitIQS builds business management systems for.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  // TEMPORARY Digistore24 review mode: only the published niches are
  // publicly browsable here -- everything else stays intact in the
  // codebase and data but is filtered out. If somehow nothing is
  // published yet, this 404s rather than rendering an empty grid. See
  // REVIEW_MODE in src/lib/site-config.ts.
  const allNiches = getNiches();
  const niches = REVIEW_MODE ? allNiches.filter((n) => isPublishedNicheSlug(n.slug)) : allNiches;
  if (REVIEW_MODE && niches.length === 0) notFound();
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:py-20">
      <Reveal>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">Industries</h1>
        <p className="mt-3 max-w-xl text-base text-fg-soft">
          {niches.length} business {niches.length === 1 ? "category" : "categories"}, each with its own Essential, Elite, and Complete system.
        </p>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {niches.map((n, i) => {
          const cover = getProductsByNiche(n.slug).find((p) => p.tier === "complete")?.coverImage;
          return (
            <Reveal key={n.slug} delay={(i % 6) * 60}>
              <Link
                href={`/industries/${n.slug}`}
                className="card-hover flex h-full items-center gap-4 rounded-[var(--radius-card)] border border-border bg-surface p-4"
              >
                {cover && (
                  <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-[10px] border border-border bg-surface-muted">
                    <Image src={cover} alt="" fill className="object-contain p-1" sizes="64px" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">{n.category}</p>
                  <h2 className="mt-1 truncate font-display text-base font-bold text-fg">{n.shortName}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-fg-soft">{n.heroLine}</p>
                  <span className="mt-2 inline-block text-sm font-semibold text-accent">View system &rarr;</span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
