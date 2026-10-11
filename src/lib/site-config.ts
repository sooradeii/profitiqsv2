// Central site configuration. Never hardcode these values in components.
import { getNiches } from "./products";

export const SITE = {
  name: "ProfitIQS",
  legalMark: "ProfitIQS™",
  tagline: "Business Management Systems",
  supportEmail: "support@profitiqs.com",
  supportPhone: "+91 8925416836",
  url: "https://www.profitiqs.com",
};

/** CONFIRMED via direct Digistore24 Compliance feedback (Erica, DS24
 * Compliance): 60 days -- see products.ts header for the full history.
 * The canonical export used site-wide is REFUND_POLICY_STATUS /
 * REFUND_DAYS from "@/lib/products" -- kept in sync here for anyone
 * importing from site-config instead. */
export const REFUND_POLICY_STATUS: "confirmed" | "unconfirmed" = "confirmed";
export const REFUND_DAYS: number | null = 60;

/**
 * CONFIRMED via direct Digistore24 Compliance feedback (Erica, DS24
 * Compliance). Profit IQS / ProfitIQS is operated by an individual
 * (Sabari B), not a registered company -- do not describe it as an LLC,
 * corporation, Pvt Ltd, GmbH, Inc., or any other company type. No VAT ID
 * or commercial register number exists; both are correctly disclosed as
 * "None" rather than omitted or invented.
 */
export const LEGAL_ENTITY = {
  legalName: "Sabari B" as string | null,
  isRegisteredCompany: false,
  address: "144, Shri Ganapathi Nagar, Morai, Avadi, Chennai-55, India" as string | null,
  email: "support@profitiqs.com" as string | null,
  phone: "+91 8925416836" as string | null,
  contactPerson: "Sabari B" as string | null,
  responsibleForContent: "Sabari B" as string | null,
  commercialRegister: null as string | null,
  vatId: null as string | null,
  confirmed: true,
};

/**
 * TEMPORARY Digistore24 compliance review mode. While true, the public
 * site exposes only the niches listed in PUBLISHED_PRODUCTS, all 3
 * tiers each (currently 7 niches / 21 products: 1099 Contractor,
 * Airbnb, Auto Repair Shop, Cleaning Service, Dental Practice,
 * Electrical Contractor, Pest Control) -- everything else (the
 * remaining industries/products, the full catalog pages) stays
 * completely intact in the codebase and data (PRODUCTS, routes,
 * components) but is not publicly reachable: product/industry pages
 * for anything not published return a real 404, catalog-listing
 * routes (/products, /essential, /elite, /complete, /compare) stay
 * disabled outright (/industries is enabled, filtered to the
 * published niches -- see src/app/industries/page.tsx), and both the
 * sitemap and robots.txt only reference published routes.
 *
 * To restore the full catalog later: set REVIEW_MODE to false (or
 * expand PUBLISHED_PRODUCTS to the full PRODUCTS id list). No other
 * code changes, no rebuild of product data, no route deletions are
 * required -- every gate in the codebase reads from these two
 * constants (plus the two `dynamicParams` literals that must be
 * flipped by hand -- see the comment next to each, and run
 * `npm run audit-review-mode` to confirm they're in sync).
 */
export const REVIEW_MODE = true;
export const PUBLISHED_PRODUCTS: string[] = [
  "1099-income-essential",
  "1099-income-elite",
  "1099-income-complete",
  "airbnb-essential",
  "airbnb-elite",
  "airbnb-complete",
  "auto-repair-essential",
  "auto-repair-elite",
  "auto-repair-complete",
  "cleaning-service-essential",
  "cleaning-service-elite",
  "cleaning-service-complete",
  "dental-practice-essential",
  "dental-practice-elite",
  "dental-practice-complete",
  "electrical-contractor-essential",
  "electrical-contractor-elite",
  "electrical-contractor-complete",
  "pest-control-essential",
  "pest-control-elite",
  "pest-control-complete",
];

export function isPublishedProduct(productId: string): boolean {
  return !REVIEW_MODE || PUBLISHED_PRODUCTS.includes(productId);
}

/** The one niche slug published in review mode (derived from
 * PUBLISHED_PRODUCTS' id prefix -- "auto-repair-complete" ->
 * "auto-repair" -- rather than hardcoded twice). Used to gate
 * /industries/[slug] to that one niche instead of 404ing it outright,
 * since the brief wants all 3 tiers shown together on one page. */
export const PUBLISHED_NICHE_SLUGS: string[] = REVIEW_MODE
  ? Array.from(new Set(PUBLISHED_PRODUCTS.map((id) => id.replace(/-(essential|elite|complete)$/, ""))))
  : [];

export function isPublishedNicheSlug(slug: string): boolean {
  return !REVIEW_MODE || PUBLISHED_NICHE_SLUGS.includes(slug);
}

/** The primary (Complete-tier) product review mode is built around --
 * used by the review homepage, nav, and footer as the main Buy Now
 * target. Falls back to the first published id if PUBLISHED_PRODUCTS
 * is ever reordered. */
export const REVIEW_PRIMARY_PRODUCT_ID =
  PUBLISHED_PRODUCTS.find((id) => id.endsWith("-complete")) ?? PUBLISHED_PRODUCTS[0] ?? "auto-repair-complete";

/** The flagship published niche -- first in PUBLISHED_NICHE_SLUGS
 * (Auto Repair). Used by the review homepage hero and the header's
 * Buy Now CTA; the other published niches are reachable via the
 * Industries nav link. */
export const REVIEW_PRIMARY_NICHE_SLUG = PUBLISHED_NICHE_SLUGS[0] ?? "auto-repair";

const FULL_MAIN_NAV = [
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Compare", href: "/compare" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
];

const REVIEW_MAIN_NAV = [
  { label: "Industries", href: "/industries" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const MAIN_NAV = REVIEW_MODE ? REVIEW_MAIN_NAV : FULL_MAIN_NAV;

const FULL_FOOTER_LINKS = {
  Products: [
    { label: "All Products", href: "/products" },
    { label: "Essential", href: "/essential" },
    { label: "Elite", href: "/elite" },
    { label: "Complete", href: "/complete" },
  ],
  Industries: [
    { label: "All Industries", href: "/industries" },
    { label: "Compare Tiers", href: "/compare" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  Legal: [
    { label: "Legal Information", href: "/legal-information" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms", href: "/terms" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

const REVIEW_FOOTER_LINKS = {
  Industries: PUBLISHED_NICHE_SLUGS.map((slug) => {
    const niche = getNiches().find((n) => n.slug === slug);
    return { label: niche?.shortName ?? slug, href: `/industries/${slug}` };
  }),
  Product: [
    { label: "How It Works", href: "/how-it-works" },
    { label: "FAQ", href: "/faq" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Legal Information", href: "/legal-information" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms", href: "/terms" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

export const FOOTER_LINKS = REVIEW_MODE ? REVIEW_FOOTER_LINKS : FULL_FOOTER_LINKS;
