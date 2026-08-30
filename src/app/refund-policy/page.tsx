import type { Metadata } from "next";
import { REFUND_DAYS } from "@/lib/products";
import { SITE } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "How refund requests for ProfitIQS products are handled.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 lg:py-20">
      <Reveal>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">Refund Policy</h1>
        <p className="mt-2 text-sm text-fg-soft">Last updated: August 2026</p>

        <div className="mt-8 rounded-[var(--radius-card)] border border-border bg-surface p-6">
          <p className="text-sm font-semibold text-fg">{REFUND_DAYS}-day return window</p>
          <p className="mt-2 text-sm text-fg-soft">
            ProfitIQS purchases are eligible for a return within {REFUND_DAYS} days
            of purchase, per ProfitIQS&apos;s standard return policy and the
            return period currently configured on Digistore24 for both
            consumer and business buyers. This figure comes from two
            independent real sources that agree — it is not an estimate.
          </p>
        </div>

        <div className="mt-8 space-y-5 text-fg-soft">
          <p>
            All ProfitIQS purchases are processed through Digistore24, our
            checkout provider. Refund eligibility and the exact process are
            ultimately governed by Digistore24&apos;s buyer terms, shown to
            you at checkout before you complete a purchase.
          </p>
          <p>
            If anything about your order looks wrong — a missing file, a
            broken formula, or a purchase issue — email{" "}
            <a href={`mailto:${SITE.supportEmail}`} className="font-semibold text-accent">{SITE.supportEmail}</a>{" "}
            first. We read every message ourselves and will help sort it
            out or point you to the right place to request a refund through
            Digistore24.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
