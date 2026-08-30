import type { Metadata } from "next";
import { SITE } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ProfitIQS handles your information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 lg:py-20">
      <Reveal>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-fg-soft">Last updated: August 2026</p>
        <div className="mt-8 space-y-5 text-fg-soft">
          <p>
            This page explains, in plain language, what information
            ProfitIQS collects and how it&apos;s used. It is a general
            summary and not a substitute for a formal legal review.
          </p>
          <section>
            <h2 className="font-display text-lg font-bold text-fg">Checkout &amp; payment data</h2>
            <p className="mt-2 text-sm">
              All purchases are processed by Digistore24, our checkout
              provider. Digistore24 collects and processes your payment and
              billing information directly — ProfitIQS does not receive or
              store your payment card details.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-fg">Information we receive</h2>
            <p className="mt-2 text-sm">
              When you complete a purchase, we receive the order details
              necessary to identify your order and provide support —
              typically your name and email address. When you contact{" "}
              {SITE.supportEmail}, we receive whatever information you
              choose to include.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-fg">How we use it</h2>
            <p className="mt-2 text-sm">
              We use this information to respond to support requests and
              communicate important updates about products you own. We do
              not sell your information to third parties.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-fg">Cookies</h2>
            <p className="mt-2 text-sm">
              This website may use basic, functional cookies necessary for
              the site to work correctly. It does not run third-party
              advertising trackers.
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
