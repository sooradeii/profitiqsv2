"use client";

import { useEffect } from "react";

/**
 * Digistore24's trust badge renders itself as a real sticky bar (a full-
 * width top banner and, per its own config, a second bottom banner) --
 * not a small corner widget. Left alone, both directly overlap this
 * site's own sticky header and page content. This component does not
 * touch DS24's script or markup at all (off-limits) -- it only measures
 * the real height of whatever DS24 actually renders, once it renders,
 * and exposes that as CSS variables the rest of the site's layout reads
 * (site-header's sticky offset, body's bottom padding) so the two
 * systems stack instead of overlapping. No-op on every page where these
 * elements don't exist.
 */
export function DigistoreBadgeOffset() {
  useEffect(() => {
    const root = document.documentElement;
    let topEl: HTMLElement | null = null;
    let bottomEl: HTMLElement | null = null;

    const applyHeights = () => {
      root.style.setProperty("--ds24-top-offset", `${topEl?.offsetHeight ?? 0}px`);
      root.style.setProperty("--ds24-bottom-offset", `${bottomEl?.offsetHeight ?? 0}px`);
    };

    const ro = new ResizeObserver(applyHeights);

    // DS24's second-stage loader injects these elements asynchronously,
    // some time after its own script finishes loading -- watch for that
    // just until both are found once, then stop watching the DOM tree
    // and rely on ResizeObserver alone for ongoing size changes.
    const findElements = () => {
      topEl ??= document.querySelector<HTMLElement>('[id^="ds24b-"][class*="ds24b-top"]');
      bottomEl ??= document.querySelector<HTMLElement>('[id^="ds24b-"][class*="ds24b-bottom"]');
      if (topEl) ro.observe(topEl);
      if (bottomEl) ro.observe(bottomEl);
      applyHeights();
      return !!topEl && !!bottomEl;
    };

    if (!findElements()) {
      const mo = new MutationObserver(() => {
        if (findElements()) mo.disconnect();
      });
      mo.observe(document.body, { childList: true, subtree: true });
      // Safety net: DS24's loader may never add a "bottom" bar at all
      // (config-dependent) -- don't watch the whole tree forever.
      const timeout = setTimeout(() => mo.disconnect(), 15000);
      return () => {
        mo.disconnect();
        clearTimeout(timeout);
        ro.disconnect();
        root.style.removeProperty("--ds24-top-offset");
        root.style.removeProperty("--ds24-bottom-offset");
      };
    }

    return () => {
      ro.disconnect();
      root.style.removeProperty("--ds24-top-offset");
      root.style.removeProperty("--ds24-bottom-offset");
    };
  }, []);

  return null;
}
