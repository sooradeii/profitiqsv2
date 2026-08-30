import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE } from "@/lib/site-config";

// Type direction, final: Poppins as the single typeface across the entire
// public site -- display, body, and numerals -- per explicit instruction.
// Weight carries the hierarchy instead of switching families: 400-500
// body, 600 labels, 700 subheadings, 800 headlines/prices/metrics.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Financial Intelligence Systems for Business Owners`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Practical financial and operational intelligence systems built around the numbers that matter — revenue, expenses, profitability, cash flow, performance, and planning. 63 systems across 21 business categories.",
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — Financial Intelligence Systems for Business Owners`,
    description:
      "Practical financial and operational intelligence systems built around the numbers that matter.",
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Financial Intelligence Systems for Business Owners`,
    description:
      "Practical financial and operational intelligence systems built around the numbers that matter.",
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
    <html lang="en" className={`${poppins.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-bg text-fg antialiased">
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
