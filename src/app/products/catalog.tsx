"use client";

import { useEffect, useMemo, useState } from "react";
import { PRODUCTS, getCategories, type Tier } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { track } from "@/lib/analytics";

type SortKey = "name" | "category" | "price-asc" | "price-desc";

export function ProductCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [tier, setTier] = useState<Tier | "All">("All");
  const [sort, setSort] = useState<SortKey>("name");

  const categories = useMemo(() => ["All", ...getCategories()], []);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (tier !== "All" && p.tier !== tier) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !p.industry.toLowerCase().includes(q) &&
          !p.category.toLowerCase().includes(q) &&
          !p.tags.some((t) => t.toLowerCase().includes(q))
        ) {
          return false;
        }
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "category") return a.category.localeCompare(b.category) || a.industry.localeCompare(b.industry);
      if (sort === "price-asc") return (a.price ?? 0) - (b.price ?? 0);
      if (sort === "price-desc") return (b.price ?? 0) - (a.price ?? 0);
      return a.industry.localeCompare(b.industry) || a.tier.localeCompare(b.tier);
    });

    return list;
  }, [query, category, tier, sort]);

  useEffect(() => {
    if (!query) return;
    const handle = setTimeout(() => {
      track({ name: "product_search", query, resultCount: filtered.length });
    }, 500);
    return () => clearTimeout(handle);
  }, [query, filtered.length]);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, industries, tags..."
          aria-label="Search products"
          className="min-w-[220px] flex-1 rounded-[var(--radius-control)] border border-border bg-surface px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:border-accent"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-[var(--radius-control)] border border-border bg-surface px-4 py-2.5 text-sm"
          aria-label="Filter by category"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value as Tier | "All")}
          className="rounded-[var(--radius-control)] border border-border bg-surface px-4 py-2.5 text-sm"
          aria-label="Filter by tier"
        >
          <option value="All">All tiers</option>
          <option value="essential">Essential</option>
          <option value="elite">Elite</option>
          <option value="complete">Complete</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-[var(--radius-control)] border border-border bg-surface px-4 py-2.5 text-sm"
          aria-label="Sort products"
        >
          <option value="name">Sort: A–Z</option>
          <option value="category">Sort: Category</option>
          <option value="price-asc">Sort: Price low to high</option>
          <option value="price-desc">Sort: Price high to low</option>
        </select>
      </div>

      <p className="mt-4 text-xs text-fg-soft">{filtered.length} of {PRODUCTS.length} products</p>

      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-[var(--radius-card)] border border-dashed border-border py-16 text-center">
          <p className="text-sm font-semibold text-fg">No products match those filters</p>
          <p className="mt-1 text-sm text-fg-soft">Try clearing the search or category filter.</p>
        </div>
      )}
    </div>
  );
}
