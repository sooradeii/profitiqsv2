"use client";

import { track } from "@/lib/analytics";

export function AffiliateDownloadLink({
  kit,
  href,
  className,
  children,
}: {
  kit: string;
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      download
      className={className}
      onClick={() => track({ name: "affiliate_kit_download", kit })}
    >
      {children}
    </a>
  );
}
