import type { Metadata } from "next";
import { Poppins, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE } from "@/lib/site-config";

// Type direction, revised per explicit request: Poppins for body/UI, Syne
// for display headlines -- bold, tight negative tracking, real presence.
// JetBrains Mono for prices/stat numerals so figures read as live data.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["500", "700"],
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
    <html lang="en" className={`${poppins.variable} ${syne.variable} ${jetbrainsMono.variable} h-full`}>
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
