import type { MetadataRoute } from "next";
import { PRODUCTS, getNiches } from "@/lib/products";
import { SITE, REVIEW_MODE, isPublishedProduct, isPublishedNicheSlug } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  if (REVIEW_MODE) {
    // TEMPORARY Digistore24 review mode: these routes already 404 for
    // every non-published product/industry, but disallow them too so
    // crawlers never even request the ones that still exist statically.
    //
    // IMPORTANT: "/products" and "/industries" are anchored with `$`
    // (exact match only) -- a bare `Disallow: /products` is a PREFIX
    // match per the robots.txt spec and would also block the published
    // /products/auto-repair-* pages, which must stay indexable. Hidden
    // product/industry pages are listed individually instead of with a
    // prefix, for the same reason.
    const hiddenProductRoutes = PRODUCTS.filter((p) => !isPublishedProduct(p.id)).map((p) => `/products/${p.id}`);
    const hiddenIndustryRoutes = getNiches().filter((n) => !isPublishedNicheSlug(n.slug)).map((n) => `/industries/${n.slug}`);

    return {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/products$",
          "/industries$",
          "/essential$",
          "/elite$",
          "/complete$",
          "/compare$",
          ...hiddenProductRoutes,
          ...hiddenIndustryRoutes,
        ],
      },
      sitemap: `${SITE.url}/sitemap.xml`,
    };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
