import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { SITE } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the ProfitIQS team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 lg:py-20">
      <Reveal>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">Contact</h1>
        <p className="mt-3 text-base text-fg-soft">
          Questions about a product, a purchase, or anything else — messages
          are read directly, not routed through a ticket system.
        </p>
        <a
          href={`mailto:${SITE.supportEmail}`}
          className="mt-8 inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-accent px-6 py-3.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          <Mail className="size-4" />
          {SITE.supportEmail}
        </a>
        <p className="mt-6 text-sm text-fg-soft">
          For a product issue, please include the product name, tier, what
          you were trying to do, and what happened instead — it helps us
          answer faster.
        </p>
      </Reveal>
    </div>
  );
}
