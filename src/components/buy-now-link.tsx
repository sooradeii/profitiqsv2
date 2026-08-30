"use client";

import { track } from "@/lib/analytics";

export function BuyNowLink({
  productId,
  price,
  url,
  className,
  children,
}: {
  productId: string;
  price: number | null;
  url: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={url}
      className={className}
      onClick={() => {
        track({ name: "buy_now_click", productId, price });
        track({ name: "digistore_outbound_click", productId, url });
      }}
    >
      {children}
    </a>
  );
}
