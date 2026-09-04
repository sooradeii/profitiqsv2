import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Mail, Phone } from "lucide-react";
import { SITE } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";
import { DigistoreThankYouBadge } from "@/components/digistore-thankyou-badge";
import { DigistoreBadgeOffset } from "@/components/digistore-badge-offset";

// Reached only via Digistore24's post-checkout redirect, never organic
// navigation -- excluded from the sitemap and from search indexing, and
// deliberately not linked from the nav/footer/any other page.
export const metadata: Metadata = {
  title: "Thank You",
  description: "Your ProfitIQS order is complete.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/thank-you" },
};

export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14 text-center sm:px-8 lg:py-20">
      <DigistoreThankYouBadge />
      <DigistoreBadgeOffset />
      <Reveal>
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-soft">
          <CheckCircle2 className="size-7 text-success" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
          Thank you for your order.
        </h1>
        <p className="mt-4 text-base text-fg-soft">
          Your purchase was completed successfully. This order was
          processed and charged by Digistore24, ProfitIQS&apos;s checkout
          provider — not by ProfitIQS directly. Your credit card
          statement will show a charge from Digistore24.
        </p>

        <div className="mt-10 space-y-6 rounded-[var(--radius-card)] border border-border bg-surface p-6 text-left sm:p-8">
          <div>
            <h2 className="font-display text-lg font-bold text-fg">Getting your files</h2>
            <p className="mt-2 text-sm text-fg-soft">
              Your product is a digital download. Digistore24 sends your
              order confirmation and download access directly to the
              email address you used at checkout, through Digistore24&apos;s
              own Download Vault. If you don&apos;t see it within a few
              minutes, check your spam or promotions folder.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-fg">Next steps</h2>
            <p className="mt-2 text-sm text-fg-soft">
              Open the confirmation email from Digistore24, download your
              workbook, and use the included Quick Start guide to get set
              up. No account or login is required.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-fg">Need help?</h2>
            <p className="mt-2 text-sm text-fg-soft">
              If anything about your order looks wrong — a missing email,
              a file issue, or a billing question — reach out and we&apos;ll
              help directly.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={`mailto:${SITE.supportEmail}`}
                className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
              >
                <Mail className="size-4" />
                {SITE.supportEmail}
              </a>
              <a
                href={`tel:${SITE.supportPhone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-border px-5 py-2.5 text-sm font-semibold text-fg hover:border-fg-soft"
              >
                <Phone className="size-4" />
                {SITE.supportPhone}
              </a>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-fg-soft">
          <Link href="/refund-policy" className="font-semibold text-accent">Refund Policy</Link>
          {" · "}
          <Link href="/products" className="font-semibold text-accent">Browse more systems</Link>
        </p>
      </Reveal>
    </div>
  );
}
