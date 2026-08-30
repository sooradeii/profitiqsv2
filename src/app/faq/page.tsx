import type { Metadata } from "next";
import { FAQ_ITEMS } from "@/lib/faq";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about ProfitIQS products, tiers, delivery, and support.",
  alternates: { canonical: "/faq" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 lg:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Reveal>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">Frequently asked questions</h1>
      </Reveal>
      <dl className="mt-8 divide-y divide-border">
        {FAQ_ITEMS.map((item, i) => (
          <Reveal key={item.q} delay={i * 30} className="py-5">
            <dt className="font-semibold text-fg">{item.q}</dt>
            <dd className="mt-2 text-sm text-fg-soft">{item.a}</dd>
          </Reveal>
        ))}
      </dl>
    </div>
  );
}
