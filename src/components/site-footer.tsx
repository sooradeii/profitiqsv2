import Link from "next/link";
import { SITE, FOOTER_LINKS } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-semibold uppercase tracking-wide text-fg-soft">{group}</p>
              <ul className="mt-4 space-y-2.5">
                {links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-fg-soft transition-colors hover:text-fg">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-fg-soft sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {SITE.legalMark}. All rights reserved.</p>
          <a href={`mailto:${SITE.supportEmail}`} className="hover:text-fg">{SITE.supportEmail}</a>
        </div>
      </div>
    </footer>
  );
}
