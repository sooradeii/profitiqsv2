"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { SITE, MAIN_NAV, REVIEW_MODE, REVIEW_PRIMARY_PRODUCT_ID } from "@/lib/site-config";

const HEADER_CTA = REVIEW_MODE
  ? { href: `/products/${REVIEW_PRIMARY_PRODUCT_ID}`, label: "Buy Now" }
  : { href: "/industries", label: "Find Your System" };

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      style={{ top: "var(--ds24-top-offset, 0px)" }}
      className={
        scrolled
          ? "sticky z-50 border-b border-border bg-surface/95 backdrop-blur transition-shadow duration-200 shadow-[0_1px_0_0_rgba(17,19,24,0.04),0_8px_24px_-16px_rgba(17,19,24,0.15)]"
          : "sticky z-50 border-b border-transparent bg-surface/95 backdrop-blur transition-shadow duration-200"
      }
    >
      <div className={`mx-auto flex w-full max-w-[1280px] items-center justify-between px-5 transition-[height] duration-200 sm:px-8 ${scrolled ? "h-14" : "h-16"}`}>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/assets/brand/profitiqs-logo.png" alt="" width={26} height={26} priority />
          <span className="font-display text-[15px] font-bold tracking-tight text-fg">
            {SITE.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-fg-soft transition-colors hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href={HEADER_CTA.href}
            className="rounded-[var(--radius-control)] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            {HEADER_CTA.label}
          </Link>
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-[var(--radius-control)] text-fg lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-surface px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-[var(--radius-control)] px-3 py-3 text-sm font-medium text-fg hover:bg-surface-muted"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={HEADER_CTA.href}
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-[var(--radius-control)] bg-accent px-3 py-3 text-center text-sm font-semibold text-white"
            >
              {HEADER_CTA.label}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
