import type { Metadata } from "next";
import Link from "next/link";
import { getNiches } from "@/lib/products";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Industries",
  description: "21 business categories ProfitIQS builds financial intelligence systems for.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  const niches = getNiches();
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:py-20">
      <Reveal>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">Industries</h1>
        <p className="mt-3 max-w-xl text-base text-fg-soft">
          21 business categories, each with its own Essential, Elite, and Complete system.
        </p>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {niches.map((n, i) => (
          <Reveal key={n.slug} delay={(i % 6) * 60}>
            <Link
              href={`/industries/${n.slug}`}
              className="card-hover flex h-full flex-col rounded-[var(--radius-card)] border border-border bg-surface p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">{n.category}</p>
              <h2 className="mt-2 font-display text-lg font-bold text-fg">{n.shortName}</h2>
              <p className="mt-2 flex-1 text-sm text-fg-soft">{n.heroLine}</p>
              <span className="mt-4 text-sm font-semibold text-accent">View system &rarr;</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
