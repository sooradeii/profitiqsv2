import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Download,
  FileText,
  Mail,
  Package,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getProductsByNiche } from "@/lib/products";
import { SITE } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";
import { StatCounter } from "@/components/stat-counter";
import { AffiliateDownloadLink } from "@/components/affiliate-download-link";

export const metadata: Metadata = {
  title: "Affiliates",
  description:
    "Promote ProfitIQS and keep a real commission. Download the master affiliate kit or any of the 11 industry kits — real screenshots, swipe copy, and an 8-email cold outreach sequence included.",
  alternates: { canonical: "/affiliates" },
};

// Real site slug -> affiliate kit metadata. Each kit zip ships from
// public/downloads/affiliate-kit/ (built from the same source as the
// product workbooks -- see _affiliate_kit/ in the project root).
const NICHE_KITS = [
  { slug: "1099-income", file: "1099-income-Affiliate-Kit.zip", label: "1099 Contractor" },
  { slug: "airbnb", file: "airbnb-Affiliate-Kit.zip", label: "Airbnb" },
  { slug: "auto-repair", file: "auto-repair-Affiliate-Kit.zip", label: "Auto Repair Shop" },
  { slug: "cleaning-service", file: "cleaning-service-Affiliate-Kit.zip", label: "Cleaning Service" },
  { slug: "construction", file: "construction-Affiliate-Kit.zip", label: "Construction Job Cost" },
  { slug: "dental-practice", file: "dental-practice-Affiliate-Kit.zip", label: "Dental Practice" },
  { slug: "digital-marketing-agency", file: "digital-marketing-agency-Affiliate-Kit.zip", label: "Digital Marketing Agency" },
  { slug: "ecommerce", file: "ecommerce-Affiliate-Kit.zip", label: "Ecommerce" },
  { slug: "electrical-contractor", file: "electrical-contractor-Affiliate-Kit.zip", label: "Electrical Contractor" },
  { slug: "hvac", file: "hvac-Affiliate-Kit.zip", label: "HVAC" },
  { slug: "pest-control", file: "pest-control-Affiliate-Kit.zip", label: "Pest Control" },
] as const;

const MASTER_KIT_FILE = "ProfitIQS-Master-Affiliate-Kit.zip";

// Single source of truth for the commission schedule -- matches
// _affiliate_kit/source/98-Source-and-Build/config.json exactly. Change it
// there and here together.
const COMMISSION_PHASES = [
  { name: "Launch", percent: 90, window: "Oct 17, 2026 – Jan 16, 2027" },
  { name: "Growth", percent: 85, window: "Jan 17 – Apr 16, 2027" },
  { name: "Standard", percent: 80, window: "Apr 17, 2027 onward" },
];

const WHATS_INSIDE = [
  { title: "Every screenshot of the product", body: "Every sheet of both editions, captured straight from the real workbook, so affiliates and buyers see exactly what they get." },
  { title: "30 short-form video hooks", body: "Ready-to-say opening lines for Reels, TikTok and Shorts, written for that one industry." },
  { title: "Email and social swipe copy", body: "Posts, email sequences for your own list, and an 8-email cold outreach sequence with a full compliance playbook." },
  { title: "Paid ad copy and objection handling", body: "Ad copy drafts plus the real objections buyers raise, with honest answers already written." },
  { title: "On-brand graphics", body: "Covers, dashboards, comparison graphics and carousels in the real ProfitIQS visual style — nothing generic." },
  { title: "Real checkout links, every tier", body: "Live Digistore24 checkout URLs and product IDs for Essential, Elite and Complete, already dropped in." },
];

function getFileSizeMB(filename: string): number {
  try {
    const p = path.join(process.cwd(), "public", "downloads", "affiliate-kit", filename);
    return Math.round((fs.statSync(p).size / 1024 / 1024) * 10) / 10;
  } catch {
    return 0;
  }
}

export default function AffiliatesPage() {
  const masterSizeMB = getFileSizeMB(MASTER_KIT_FILE);
  const niches = NICHE_KITS.map((n) => {
    const cover = getProductsByNiche(n.slug).find((p) => p.tier === "complete")?.coverImage ?? null;
    return { ...n, cover, sizeMB: getFileSizeMB(n.file) };
  });

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="hero-surface">
        <div className="mx-auto max-w-[1280px] px-5 pb-10 pt-12 sm:px-8 lg:pb-14 lg:pt-16">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5">
              <span className="pulse-dot" />
              <span className="font-mono text-[11px] font-medium text-fg-soft">Affiliate Program · Launch phase</span>
            </div>
            <h1 className="mt-5 font-display text-[2.4rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-fg sm:text-[3.2rem]">
              Promote ProfitIQS.
              <span className="-mt-1 block font-handwritten text-[3rem] font-bold leading-[0.9] tracking-normal text-accent sm:text-[3.8rem]">
                Keep real commission.
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-fg-soft sm:text-lg">
              11 industry-specific business intelligence systems, one real commission schedule, and a complete kit
              for every niche — screenshots, swipe copy, and an outreach sequence already written. You bring the
              audience; the kit does the rest.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="#downloads"
                className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Download your kit
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-border px-6 py-3.5 text-sm font-semibold text-fg transition-colors hover:bg-surface-muted"
              >
                How it works
              </Link>
            </div>
            <div className="mx-auto mt-10 flex max-w-md justify-center gap-10 border-t border-border pt-6">
              <div>
                <p className="font-display text-3xl font-extrabold tabular-nums text-fg">
                  <StatCounter value={COMMISSION_PHASES[0].percent} suffix="%" />
                </p>
                <p className="mt-1 font-mono text-[11px] text-fg-soft">Launch commission</p>
              </div>
              <div>
                <p className="font-display text-3xl font-extrabold tabular-nums text-fg">
                  <StatCounter value={NICHE_KITS.length} />
                </p>
                <p className="mt-1 font-mono text-[11px] text-fg-soft">Industry kits</p>
              </div>
              <div>
                <p className="font-display text-3xl font-extrabold tabular-nums text-fg">1</p>
                <p className="mt-1 font-mono text-[11px] text-fg-soft">Payment, no subscription</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== COMMISSION SCHEDULE ===== */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">The planned commission schedule</h2>
            <p className="mt-3 max-w-2xl text-base text-fg-soft">
              Three phases, set in Digistore24 as each one starts. The rate that applies to a sale is whatever
              Digistore24 has set at the moment of that sale — check your own dashboard for the exact basis and
              fees before quoting payout amounts publicly.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {COMMISSION_PHASES.map((p, i) => (
              <Reveal key={p.name} delay={i * 90}>
                <div
                  className={
                    i === 0
                      ? "glow-card flex h-full flex-col rounded-[var(--radius-card)] border-2 border-accent bg-accent-soft p-7"
                      : "glow-card flex h-full flex-col rounded-[var(--radius-card)] border border-border bg-bg p-7"
                  }
                >
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-fg-soft">{p.name}</span>
                  <p className="mt-2 font-display text-4xl font-extrabold tabular-nums text-fg">
                    <StatCounter value={p.percent} suffix="%" duration={800} />
                  </p>
                  <p className="mt-3 flex-1 text-sm text-fg-soft">{p.window}</p>
                  {i === 0 && (
                    <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-white">
                      <Sparkles className="size-3" /> Live now
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-6 max-w-2xl text-xs text-fg-soft">
              These are planned program rates, not a guaranteed payout per sale — Digistore24&apos;s fees, taxes,
              refunds and chargebacks all apply the way they do for any Digistore24 product. Full detail is in the
              Commission Guide inside the master kit.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== MASTER KIT DOWNLOAD ===== */}
      <section id="downloads" className="scroll-mt-16 border-b border-border">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">Start with the master kit</h2>
            <p className="mt-3 max-w-2xl text-base text-fg-soft">
              The commission schedule, the compliance rules, brand messaging, shared promotional copy, and a full
              cold-email infrastructure lesson — read this once, then promote any niche.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div className="glow-card cta-surface mt-8 flex flex-col items-start justify-between gap-6 rounded-[var(--radius-card)] border border-border p-8 text-white sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-white/10">
                  <Package className="size-7 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">ProfitIQS Master Affiliate Kit</h3>
                  <p className="mt-1.5 max-w-md text-sm text-white/65">
                    Program overview, commission guide, compliance guide, brand messaging, shared promo copy, and the
                    full cold-email playbook.
                  </p>
                  {masterSizeMB > 0 && (
                    <p className="mt-2 font-mono text-[11px] text-white/45">PDF + graphics &middot; {masterSizeMB} MB</p>
                  )}
                </div>
              </div>
              <AffiliateDownloadLink
                kit="master"
                href={`/downloads/affiliate-kit/${MASTER_KIT_FILE}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-[var(--radius-control)] bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-white/90"
              >
                <Download className="size-4" />
                Download master kit
              </AffiliateDownloadLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== NICHE KITS ===== */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">Pick your industry</h2>
            <p className="mt-3 max-w-2xl text-base text-fg-soft">
              Each kit is built for that one industry — a full promo kit, not a generic template with the name
              swapped in. Promoting the HVAC system to HVAC contractors converts better, and is more honest, than
              promoting every niche to everyone.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {niches.map((n, i) => (
              <Reveal key={n.slug} delay={(i % 6) * 60}>
                <div className="card-hover flex h-full flex-col rounded-[var(--radius-card)] border border-border bg-surface p-5">
                  <div className="flex items-center gap-3">
                    {n.cover && (
                      <div className="relative aspect-[3/4] w-12 shrink-0 overflow-hidden rounded-[8px] border border-border bg-surface-muted">
                        <Image src={n.cover} alt="" fill className="object-contain p-1" sizes="48px" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-base font-bold text-fg">{n.label}</h3>
                      {n.sizeMB > 0 && <p className="font-mono text-[11px] text-fg-soft">{n.sizeMB} MB</p>}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-1 items-end">
                    <AffiliateDownloadLink
                      kit={n.slug}
                      href={`/downloads/affiliate-kit/${n.file}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-control)] border border-border px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
                    >
                      <Download className="size-3.5" />
                      Download kit
                    </AffiliateDownloadLink>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHAT'S INSIDE ===== */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">What&apos;s in every kit</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WHATS_INSIDE.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div className="glow-card h-full rounded-[var(--radius-card)] border border-border bg-surface p-5">
                  <FileText className="size-5 text-accent" />
                  <h3 className="mt-3 text-sm font-semibold text-fg">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-fg-soft">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="scroll-mt-16 border-b border-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">How it works</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { n: "01", title: "Download your kit", body: "Grab the master kit plus the niche kit that matches your audience." },
              { n: "02", title: "Get your Digistore24 link", body: "Sign in to Digistore24, find the ProfitIQS product, and copy your own promotion link." },
              { n: "03", title: "Promote with what's already written", body: "Swap in your link, and go — hooks, scripts, posts, emails and graphics are done." },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <span className="font-mono text-7xl font-extrabold text-violet/30">{s.n}</span>
                <h3 className="mt-3 font-display text-lg text-fg">{s.title}</h3>
                <p className="mt-2 text-sm text-fg-soft">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GUARDRAILS ===== */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <div className="flex flex-col gap-6 rounded-[var(--radius-card)] border border-border bg-surface p-7 sm:flex-row sm:items-start">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-success-soft">
                <ShieldCheck className="size-5 text-success" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-fg">Promote honestly — it&apos;s the whole program</h3>
                <p className="mt-2 max-w-2xl text-sm text-fg-soft">
                  No fake testimonials, no income promises, no spam. Cold outreach is allowed under CAN-SPAM&apos;s
                  opt-out rules, but only with a truthful subject line, a real business address, and a working
                  opt-out — the full compliance rules, including the cold-email rules, are in the Compliance Guide
                  inside the master kit. Read it before you send anything.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="cta-surface text-white">
        <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Ready to promote?</h2>
            <p className="mt-4 text-white/65">
              Start with the master kit, then grab the industry kit that matches your audience.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <AffiliateDownloadLink
                kit="master"
                href={`/downloads/affiliate-kit/${MASTER_KIT_FILE}`}
                className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-white px-7 py-3.5 text-sm font-semibold text-ink hover:bg-white/90"
              >
                <Download className="size-4" />
                Download master kit
              </AffiliateDownloadLink>
              <Link
                href="#downloads"
                className="rounded-[var(--radius-control)] border border-white/30 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                See all 11 industry kits
              </Link>
            </div>
            <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-white/50">
              <Mail className="size-3.5" /> Questions? {SITE.supportEmail} — put &quot;Affiliate&quot; in the subject line
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
