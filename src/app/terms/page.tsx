import type { Metadata } from "next";
import { SITE } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms that govern your use of ProfitIQS products and this website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 lg:py-20">
      <Reveal>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">Terms</h1>
        <p className="mt-2 text-sm text-fg-soft">Last updated: August 2026</p>
        <div className="mt-8 space-y-5 text-fg-soft">
          <p>
            This page is a general summary of the terms that apply when you
            buy and use a ProfitIQS product. It is not a substitute for a
            formal legal agreement, and every product also ships with its
            own License document covering that specific purchase.
          </p>
          <section>
            <h2 className="font-display text-lg font-bold text-fg">What you&apos;re buying</h2>
            <p className="mt-2 text-sm">
              ProfitIQS products are digital Excel-based workbooks and
              accompanying guides, licensed for use by a single business.
              Each product&apos;s License document is the controlling
              license for that product.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-fg">Checkout &amp; delivery</h2>
            <p className="mt-2 text-sm">
              Purchases are processed through Digistore24. Products are
              delivered digitally through Digistore24&apos;s Download Vault,
              typically immediately after checkout completes.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-fg">No professional advice</h2>
            <p className="mt-2 text-sm">
              ProfitIQS products are business-tracking tools. They are not
              accounting, tax, or legal advice. Consult a qualified
              professional for advice specific to your business.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-fg">Contact</h2>
            <p className="mt-2 text-sm">
              <a href={`mailto:${SITE.supportEmail}`} className="font-semibold text-accent">{SITE.supportEmail}</a>
            </p>
          </section>
        </div>
      </Reveal>
    </div>
  );
}
