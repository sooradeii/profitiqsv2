import Script from "next/script";

/**
 * Digistore24 Thank You Page Trust Badge -- exact code as provided by
 * Digistore24, unmodified. Sales Page badge usage was removed per
 * Digistore24 Compliance (Regine) request; this Thank You Page badge
 * was not part of that request and remains.
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
