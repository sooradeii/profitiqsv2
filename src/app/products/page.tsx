import type { Metadata } from "next";
import { ProductCatalog } from "./catalog";

export const metadata: Metadata = {
  title: "Products",
  description: "63 financial intelligence systems across 21 business categories — Essential, Elite, and Complete tiers.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:py-20">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">Products</h1>
      <p className="mt-3 max-w-xl text-base text-fg-soft">
        Financial intelligence systems built for specific business models and operating environments.
      </p>
      <div className="mt-10">
        <ProductCatalog />
      </div>
    </div>
  );
}
