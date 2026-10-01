import type { MetadataRoute } from "next";
import { PRODUCTS, getNiches } from "@/lib/products";
import { SITE, REVIEW_MODE, isPublishedProduct, isPublishedNicheSlug } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = (
    REVIEW_MODE
      ? [
          "",
          "/how-it-works",
          "/about",
          "/contact",
          "/faq",
          "/legal-information",
          "/privacy-policy",
          "/terms",
          "/refund-policy",
          "/disclaimer",
        ]
      : [
          "",
          "/products",
          "/industries",
          "/essential",
          "/elite",
          "/complete",
          "/compare",
          "/about",
          "/contact",
          "/faq",
          "/legal-information",
          "/privacy-policy",
          "/terms",
          "/refund-policy",
          "/disclaimer",
        ]
  ).map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
  }));

  const productRoutes = PRODUCTS.filter((p) => isPublishedProduct(p.id)).map((p) => ({
    url: `${SITE.url}/products/${p.id}`,
    lastModified: new Date(),
  }));

  // Only the published niche's industry page is indexable in review
  // mode -- every other industry is excluded.
  const industryRoutes = (REVIEW_MODE ? getNiches().filter((n) => isPublishedNicheSlug(n.slug)) : getNiches()).map(
    (n) => ({
      url: `${SITE.url}/industries/${n.slug}`,
      lastModified: new Date(),
    }),
  );

  return [...staticRoutes, ...productRoutes, ...industryRoutes];
}
