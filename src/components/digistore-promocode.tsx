"use client";

import Script from "next/script";

declare global {
  interface Window {
    digistorePromocode?: (config: { product_id: number; adjust_domain: boolean }) => void;
  }
}

/**
 * Digistore24 affiliate promocode tracking. Loads DS24's own script and
 * initializes it with one real product ID belonging to this page's
 * niche -- this only captures affiliate attribution (?aff=/#aff= on the
 * URL) for whichever real product the visitor eventually buys via the
 * page's own Buy Now buttons. It does not change, redirect, or select
 * which product gets purchased -- each Buy Now button still points to
 * its own real Digistore24 checkout URL, untouched.
 */
export function DigistorePromocode({ referenceProductId }: { referenceProductId: string }) {
  return (
    <Script
      src="https://www.digistore24-scripts.com/service/digistore.js"
      strategy="afterInteractive"
      onLoad={() => {
        window.digistorePromocode?.({ product_id: Number(referenceProductId), adjust_domain: true });
      }}
    />
  );
}
