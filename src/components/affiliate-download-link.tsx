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

/**
 * Triggers every file in `files` as its own download, staggered so browsers
 * don't block it as a multi-download popup. No single oversized zip is
 * generated or stored -- GitHub rejects any tracked file over 100MB, so
 * "download everything" means "download all 12 kits" rather than one
 * combined archive. See the commit that introduced this for the full story.
 */
export function AffiliateDownloadAllLink({
  kit,
  files,
  className,
  children,
}: {
  kit: string;
  files: { href: string; name: string }[];
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        track({ name: "affiliate_kit_download", kit });
        files.forEach((f, i) => {
          setTimeout(() => {
            const a = document.createElement("a");
            a.href = f.href;
            a.download = f.name;
            document.body.appendChild(a);
            a.click();
            a.remove();
          }, i * 350);
        });
      }}
    >
      {children}
    </button>
  );
}
