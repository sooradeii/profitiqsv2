import Script from "next/script";

/**
 * Digistore24 Thank You Page Trust Badge -- exact code as provided by
 * Digistore24, unmodified. A separate badge/cid from the Sales Page
 * badge (see digistore-trust-badge.tsx) -- DS24 issues one per page
 * type from their dashboard.
 */
export function DigistoreThankYouBadge() {
  return (
    <Script
      id="digistore24-thankyou-badge"
      strategy="afterInteractive"
      src="https://www.digistore24.com/trusted-badge/47296/QxGxImWnG5Yg2pg/thankyoupage"
    />
  );
}
