// Central site configuration. Never hardcode these values in components.

export const SITE = {
  name: "ProfitIQS",
  legalMark: "ProfitIQS™",
  tagline: "Financial Intelligence Systems",
  supportEmail: "support@profitiqs.com",
  url: "https://www.profitiqs.com",
};

/** Confirmed via two independent real sources that agree (see products.ts
 * header): DS24_MASTER_CATALOG.json's own refund_policy field and the
 * live Digistore24 CSV export both say 90 days. Not a guess. */
export const REFUND_DAYS = 90;

/**
 * REAL BLOCKER -- do not fill these with invented values. No legal entity
 * name, registered address, or VAT ID exists in any source file provided
 * for this project (checked DS24_MANUAL_PLAYBOOK.md, DS24_MASTER_CATALOG,
 * the old site's own /legal page, and the products root directory).
 * `/legal-information` renders an honest "pending" state instead of
 * fabricated placeholders, and the compliance/launch audits report this
 * section BLOCKED until real values are supplied here.
 */
export const LEGAL_ENTITY = {
  legalName: null as string | null,
  address: null as string | null,
  vatId: null as string | null,
  confirmed: false,
};

export const MAIN_NAV = [
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Compare", href: "/compare" },
  { label: "Affiliates", href: "/affiliate" },
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
    { label: "Affiliates", href: "/affiliate" },
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
