// Central site configuration. Never hardcode these values in components.

export const SITE = {
  name: "ProfitIQS",
  legalMark: "ProfitIQS™",
  tagline: "Financial Intelligence Systems",
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

export const MAIN_NAV = [
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Compare", href: "/compare" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
];

export const FOOTER_LINKS = {
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
