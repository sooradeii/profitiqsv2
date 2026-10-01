import type { Metadata } from "next";
import Link from "next/link";
import { Search, ShoppingCart, CreditCard, Mail, Download, FileCheck } from "lucide-react";
import { getProductById } from "@/lib/products";
import { REVIEW_PRIMARY_PRODUCT_ID, SITE } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "How It Works",
  description: "How a ProfitIQS purchase works, from the product page to your files landing in Digistore24's Download Vault.",
  alternates: { canonical: "/how-it-works" },
};

const STEPS = [
  {
    icon: Search,
    title: "1. Review the product page",
    body: "Everything the system includes, who it's for, and what you receive is listed on the product page — no surprises after checkout.",
  },
  {
    icon: ShoppingCart,
    title: "2. Click Buy Now",
    body: "The Buy Now button takes you directly to the real Digistore24 order form for this product. ProfitIQS does not run its own checkout.",
  },
  {
    icon: CreditCard,
    title: "3. Complete checkout on Digistore24",
    body: "Digistore24 processes payment and handles your order. ProfitIQS never receives or stores your payment details.",
  },
  {
    icon: Mail,
    title: "4. Get your order confirmation",
    body: "Digistore24 emails your order confirmation and receipt directly, with access to your purchase.",
  },
  {
    icon: Download,
    title: "5. Download from the Digistore24 Download Vault",
    body: "Your files — the workbook(s), Field Guide, and Quick Start — are delivered through Digistore24's Download Vault, tied to your order.",
  },
  {
    icon: FileCheck,
    title: "6. Open and start tracking",
    body: "Each system ships with a Field Guide and Quick Start walking through setup, so you can start entering your numbers right away.",
  },
];

export default function HowItWorksPage() {
  const product = getProductById(REVIEW_PRIMARY_PRODUCT_ID);

  return (
    <div>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-2xl px-5 py-14 text-center sm:px-8 lg:py-20">
          <Reveal>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">How it works</h1>
            <p className="mt-4 text-base text-fg-soft">
              From the product page to your files landing on your computer —
              the whole flow runs through Digistore24, ProfitIQS&apos;s
              checkout and delivery provider.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 lg:py-20">
          <div className="space-y-8">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 60} className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <s.icon className="size-5" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-fg">{s.title}</h2>
                  <p className="mt-1 text-sm text-fg-soft">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="mt-12 max-w-xl border-t border-border pt-8 text-sm text-fg-soft">
              ProfitIQS does not process or store your payment details, and
              does not host the download itself — both checkout and
              delivery are handled entirely by Digistore24. Questions about
              an order can go to either Digistore24 support or{" "}
              <a href={`mailto:${SITE.supportEmail}`} className="underline">
                {SITE.supportEmail}
              </a>
              .
            </p>
          </Reveal>

          {product && (
            <Reveal>
              <Link
                href={`/products/${product.id}`}
                className="mt-8 inline-flex items-center rounded-[var(--radius-control)] bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                View {product.industry} — {product.tierLabel}
              </Link>
            </Reveal>
          )}
        </div>
      </section>
    </div>
  );
}
