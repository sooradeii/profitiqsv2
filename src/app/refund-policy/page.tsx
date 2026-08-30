import type { Metadata } from "next";
import { REFUND_POLICY_STATUS } from "@/lib/products";
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

        {REFUND_POLICY_STATUS === "unconfirmed" && (
          <div className="mt-8 rounded-[var(--radius-card)] border border-warning/40 bg-warning/10 p-6">
            <p className="text-sm font-semibold text-fg">Return window: being finalized with Digistore24</p>
            <p className="mt-2 text-sm text-fg-soft">
              ProfitIQS purchases are eligible for a return, processed through
              Digistore24, our checkout provider. We are not publishing an
              exact number of days on this page while we finalize the return
              window directly with Digistore24. The authoritative return
              period for your purchase is always the one shown to you on the
              Digistore24 checkout and order pages at the time you buy.
            </p>
          </div>
        )}

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
