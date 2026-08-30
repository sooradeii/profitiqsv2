import type { MetadataRoute } from "next";
import { PRODUCTS, getNiches } from "@/lib/products";
import { SITE } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/products",
    "/industries",
    "/essential",
    "/elite",
    "/complete",
    "/compare",
    "/affiliate",
    "/about",
    "/contact",
    "/faq",
    "/legal-information",
    "/privacy-policy",
    "/terms",
    "/refund-policy",
    "/disclaimer",
  ].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
  }));

  const productRoutes = PRODUCTS.map((p) => ({
    url: `${SITE.url}/products/${p.id}`,
    lastModified: new Date(),
  }));

  const industryRoutes = getNiches().map((n) => ({
    url: `${SITE.url}/industries/${n.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes, ...industryRoutes];
}
