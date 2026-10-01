import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Minus } from "lucide-react";
import { getProduct } from "@/lib/products";
import { REVIEW_MODE } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Compare Tiers",
  description: "Essential vs. Elite vs. Complete — a clear comparison of what each ProfitIQS tier includes.",
  alternates: { canonical: "/compare" },
};

const ROWS = [
  { label: "Core entry & tracking sheets", essential: true, elite: true, complete: true },
  { label: "Business Health Snapshot", essential: true, elite: true, complete: true },
  { label: "Deep KPI Scorecard & analytics", essential: false, elite: true, complete: true },
  { label: "Forecasting & benchmarking", essential: false, elite: true, complete: true },
  { label: "Business Health Score™", essential: false, elite: true, complete: true },
  { label: "Both Essential + Elite workbooks", essential: false, elite: false, complete: true },
  { label: "Field Guide", essential: true, elite: true, complete: true },
  { label: "Quick Start", essential: true, elite: true, complete: true },
];

export default function ComparePage() {
  // TEMPORARY Digistore24 review mode -- see src/lib/site-config.ts.
  if (REVIEW_MODE) notFound();
  const sample = {
    essential: getProduct("auto-repair", "essential"),
    elite: getProduct("auto-repair", "elite"),
    complete: getProduct("auto-repair", "complete"),
  };

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:py-20">
      <Reveal>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">Compare tiers</h1>
        <p className="mt-3 max-w-2xl text-base text-fg-soft">
          Every industry uses this same three-tier structure. Pricing shown
          reflects the current standard tier structure — see the selected
          product page for the exact price.
        </p>
      </Reveal>

      <Reveal>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 text-left font-semibold text-fg-soft">What&apos;s included</th>
                <th className="p-4 text-left">
                  <span className="font-display text-base font-bold text-fg">Essential</span>
                  {sample.essential?.price !== null && (
                    <span className="ml-2 font-mono text-sm text-fg-soft">${sample.essential?.price}</span>
                  )}
                </th>
                <th className="p-4 text-left">
                  <span className="font-display text-base font-bold text-fg">Elite</span>
                  {sample.elite?.price !== null && (
                    <span className="ml-2 font-mono text-sm text-fg-soft">${sample.elite?.price}</span>
                  )}
                </th>
                <th className="p-4 text-left">
                  <span className="font-display text-base font-bold text-fg">Complete</span>
                  {sample.complete?.price !== null && (
                    <span className="ml-2 font-mono text-sm text-fg-soft">${sample.complete?.price}</span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-none">
                  <td className="p-4 text-fg">{row.label}</td>
                  <td className="p-4">{row.essential ? <Check className="size-4 text-success" /> : <Minus className="size-4 text-fg-soft" />}</td>
                  <td className="p-4">{row.elite ? <Check className="size-4 text-success" /> : <Minus className="size-4 text-fg-soft" />}</td>
                  <td className="p-4">{row.complete ? <Check className="size-4 text-success" /> : <Minus className="size-4 text-fg-soft" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5">
            <h3 className="font-display font-bold text-fg">Essential is for you if...</h3>
            <p className="mt-2 text-sm text-fg-soft">You want the core numbers tracked cleanly without deeper analytics.</p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5">
            <h3 className="font-display font-bold text-fg">Elite is for you if...</h3>
            <p className="mt-2 text-sm text-fg-soft">You want KPI tracking, forecasting, and a Business Health Score.</p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5">
            <h3 className="font-display font-bold text-fg">Complete is for you if...</h3>
            <p className="mt-2 text-sm text-fg-soft">You want both workbooks in one purchase and don&apos;t want to choose.</p>
          </div>
        </div>
        <Link href="/products" className="mt-8 inline-block text-sm font-semibold text-accent">
          Browse all 63 products &rarr;
        </Link>
      </Reveal>
    </div>
  );
}
