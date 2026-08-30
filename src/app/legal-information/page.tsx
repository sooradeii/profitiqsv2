import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { LEGAL_ENTITY, SITE } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Legal Information",
  description: "Legal entity and business information for ProfitIQS.",
  alternates: { canonical: "/legal-information" },
};

export default function LegalInformationPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 lg:py-20">
      <Reveal>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">Legal Information</h1>

        {!LEGAL_ENTITY.confirmed && (
          <div className="mt-6 flex items-start gap-3 rounded-[var(--radius-card)] border border-warning/30 bg-warning/5 p-5">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" />
            <div>
              <p className="text-sm font-semibold text-fg">Legal entity details pending</p>
              <p className="mt-1 text-sm text-fg-soft">
                The registered business name, address, and VAT ID for
                ProfitIQS have not been provided yet. Nothing is published
                here until real values are confirmed — this page will not
                display placeholder or invented information.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-5 text-fg-soft">
          <section>
            <h2 className="font-display text-lg font-bold text-fg">Digital products</h2>
            <p className="mt-2 text-sm">
              ProfitIQS sells digital, non-physical products (Excel
              workbooks and accompanying documentation) delivered
              electronically after purchase.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-fg">Checkout provider</h2>
            <p className="mt-2 text-sm">
              All purchases are processed by Digistore24. Digistore24
              handles payment processing and is the merchant of record for
              transactions made through it.
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
