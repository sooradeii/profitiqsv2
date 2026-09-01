import type { Metadata } from "next";
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

        <div className="mt-8 space-y-5 text-fg-soft">
          <section>
            <h2 className="font-display text-lg font-bold text-fg">Operator</h2>
            <p className="mt-2 text-sm">
              {LEGAL_ENTITY.legalName}, operating under the brand Profit IQS
              (ProfitIQS). Profit IQS is not currently a registered company
              or legal entity — it is operated by an individual.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-fg">Address</h2>
            <p className="mt-2 whitespace-pre-line text-sm">{LEGAL_ENTITY.address}</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-fg">Contact</h2>
            <p className="mt-2 text-sm">
              Email: <a href={`mailto:${LEGAL_ENTITY.email}`} className="font-semibold text-accent">{LEGAL_ENTITY.email}</a>
              <br />
              Phone: <a href={`tel:${LEGAL_ENTITY.phone?.replace(/\s/g, "")}`} className="font-semibold text-accent">{LEGAL_ENTITY.phone}</a>
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-fg">Contact person / responsible for website content</h2>
            <p className="mt-2 text-sm">{LEGAL_ENTITY.contactPerson}</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-fg">Commercial register</h2>
            <p className="mt-2 text-sm">None. Profit IQS is not a registered company.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-fg">VAT ID</h2>
            <p className="mt-2 text-sm">None.</p>
          </section>
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
            <h2 className="font-display text-lg font-bold text-fg">General contact</h2>
            <p className="mt-2 text-sm">
              <a href={`mailto:${SITE.supportEmail}`} className="font-semibold text-accent">{SITE.supportEmail}</a>
            </p>
          </section>
        </div>
      </Reveal>
    </div>
  );
}
