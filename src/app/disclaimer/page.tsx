import type { Metadata } from "next";
import { SITE } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Important disclaimers about ProfitIQS products and their use.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 lg:py-20">
      <Reveal>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">Disclaimer</h1>
        <p className="mt-2 text-sm text-fg-soft">Last updated: August 2026</p>
        <div className="mt-8 space-y-5 text-fg-soft">
          <section>
            <h2 className="font-display text-lg font-bold text-fg">No guaranteed results</h2>
            <p className="mt-2 text-sm">
              ProfitIQS products are business-tracking tools. They do not
              guarantee any specific profit, income, savings, or return on
              investment. Results depend entirely on the data you enter and
              how you use the system — nothing here is a promise of
              financial outcome.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-fg">Not professional advice</h2>
            <p className="mt-2 text-sm">
              Nothing in a ProfitIQS product or on this website constitutes
              accounting, tax, legal, or investment advice. Consult a
              qualified professional for advice specific to your business
              and jurisdiction.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-fg">Digital product, no physical goods</h2>
            <p className="mt-2 text-sm">
              Every ProfitIQS product is a downloadable digital file. No
              physical item is shipped.
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
