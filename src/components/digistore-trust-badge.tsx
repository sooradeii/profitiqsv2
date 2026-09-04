import Script from "next/script";

/**
 * Digistore24 Sales Page Trust Badge -- exact code as provided by
 * Digistore24, unmodified. next/script with a stable id both places it
 * correctly for a third-party widget script and dedupes automatically if
 * this component were ever rendered more than once on the same page.
 */
export function DigistoreTrustBadge() {
  return (
    <Script
      id="digistore24-trusted-badge"
      strategy="afterInteractive"
      src="https://www.digistore24.com/trusted-badge/47295/cid4xVLgIw7VcoK/salespage"
    />
  );
}
