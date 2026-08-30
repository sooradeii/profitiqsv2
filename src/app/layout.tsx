import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE } from "@/lib/site-config";

// Per explicit direction: Inter (UI/body) + Manrope (display/headlines).
// No serif, no italic display treatment, no more than two families.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
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
    <html lang="en" className={`${inter.variable} ${manrope.variable} h-full`}>
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
