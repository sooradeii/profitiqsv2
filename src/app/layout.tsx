import type { Metadata } from "next";
import { Inter_Tight, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE, REVIEW_MODE } from "@/lib/site-config";

// Type direction: Inter Tight is the single typeface for the entire
// public site -- headlines, body, labels, prices, numbers, and buttons.
// Weight carries the hierarchy instead of switching families: 400 for
// the occasional lighter line, 500 for small labels/subtitles, 600
// (SemiBold) as the heaviest weight anywhere -- headlines, big numbers,
// prices, tile titles. Letter-spacing runs tighter than default
// (-3% to -6%) for the premium feel. Geist Mono (500) is the monospace
// fallback for small technical labels.
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["500"],
});

const DEFAULT_TITLE = REVIEW_MODE
  ? `${SITE.name} — Auto Repair Shop Business Intelligence System`
  : `${SITE.name} — Business Management Systems for Business Owners`;

const DEFAULT_DESCRIPTION = REVIEW_MODE
  ? "A business intelligence system built specifically for independent auto repair shops — repair order tracking, parts and labor, inventory, cash flow, and reporting in one workbook."
  : "Practical business management systems built around the numbers that matter — revenue, expenses, cash flow, performance, and planning. 63 systems across 21 business categories.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE.name}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  alternates: { canonical: "/" },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/assets/brand/profitiqs-logo.png`,
  email: SITE.supportEmail,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${interTight.variable} ${geistMono.variable} h-full`}>
      <body
        className="flex min-h-full flex-col bg-bg text-fg antialiased"
        style={{ paddingBottom: "var(--ds24-bottom-offset, 0px)" }}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
