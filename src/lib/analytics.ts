"use client";

/**
 * Centralized analytics events. No analytics provider is configured (no
 * real GA4/Segment/PostHog credentials exist in this project's source
 * files, so nothing is wired up rather than inventing one) -- every event
 * funnels through this one function so a provider can be plugged in later
 * by editing exactly this file. Never invent event names or fire events
 * from multiple places for the same action; always go through track().
 */

export type AnalyticsEvent =
  | { name: "product_view"; productId: string; slug: string; tier: string }
  | { name: "product_search"; query: string; resultCount: number }
  | { name: "industry_view"; slug: string }
  | { name: "tier_view"; tier: "essential" | "elite" | "complete" }
  | { name: "buy_now_click"; productId: string; price: number | null }
  | { name: "digistore_outbound_click"; productId: string; url: string };

export function track(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { dataLayer?: unknown[] };
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event: event.name, ...event });
  }
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event);
  }
}
