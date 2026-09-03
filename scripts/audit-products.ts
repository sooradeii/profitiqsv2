import { PRODUCTS, canBuyNow } from "../src/lib/products";
import { loadMasterCatalog, loadCsvExport } from "./lib/sources";
import { matchCsvRow, catalogRow } from "./lib/match";

function main() {
  console.log("================================================");
  console.log("PROFITIQS PRODUCT AUDIT");
  console.log("================================================\n");

  const catalog = loadMasterCatalog();
  const csvRows = loadCsvExport();

  let pass = true;

  const total = PRODUCTS.length;
  console.log(`TOTAL PRODUCTS: ${total} / 63`);
  if (total !== 63) pass = false;

  for (const tier of ["essential", "elite", "complete"] as const) {
    const count = PRODUCTS.filter((p) => p.tier === tier).length;
    console.log(`${tier.toUpperCase()}: ${count} / 21`);
    if (count !== 21) pass = false;
  }

  const missingNames = PRODUCTS.filter((p) => !p.industry || !p.displayName);
  console.log(`\nMISSING NAMES: ${missingNames.length}`);
  if (missingNames.length) pass = false;

  const idCounts = new Map<string, number>();
  for (const p of PRODUCTS) idCounts.set(p.id, (idCounts.get(p.id) ?? 0) + 1);
  const dupIds = [...idCounts.entries()].filter(([, c]) => c > 1);
  console.log(`DUPLICATE IDS: ${dupIds.length}`);
  if (dupIds.length) { pass = false; dupIds.forEach(([id]) => console.log(`  - ${id}`)); }

  const slugTierCounts = new Map<string, number>();
  for (const p of PRODUCTS) {
    const key = `${p.slug}::${p.tier}`;
    slugTierCounts.set(key, (slugTierCounts.get(key) ?? 0) + 1);
  }
  const dupSlugs = [...slugTierCounts.entries()].filter(([, c]) => c > 1);
  console.log(`DUPLICATE SLUG+TIER: ${dupSlugs.length}`);
  if (dupSlugs.length) pass = false;

  const missingPrices = PRODUCTS.filter((p) => p.price === null);
  console.log(`MISSING PRICES: ${missingPrices.length}`);
  if (missingPrices.length) { pass = false; missingPrices.forEach((p) => console.log(`  - ${p.id}`)); }

  let priceMismatches = 0;
  for (const p of PRODUCTS) {
    const row = catalogRow(catalog, p.slug, p.tier);
    if (row && row.price_usd !== p.price) {
      priceMismatches++;
      console.log(`  PRICE MISMATCH: ${p.id} website=${p.price} catalog=${row.price_usd}`);
    }
  }
  console.log(`PRICE MISMATCHES (vs DS24_MASTER_CATALOG.json): ${priceMismatches}`);
  if (priceMismatches) pass = false;

  const missingCovers = PRODUCTS.filter((p) => !p.coverImage);
  console.log(`MISSING COVERS: ${missingCovers.length}`);
  if (missingCovers.length) pass = false;

  const missingCategories = PRODUCTS.filter((p) => !p.category);
  console.log(`MISSING CATEGORIES: ${missingCategories.length}`);
  if (missingCategories.length) pass = false;

  const missingTiers = PRODUCTS.filter((p) => !p.tier || !p.tierLabel);
  console.log(`MISSING TIERS: ${missingTiers.length}`);
  if (missingTiers.length) pass = false;

  let missingCheckoutVsCsv = 0;
  let invalidCheckoutMappings = 0;
  for (const p of PRODUCTS) {
    const csvRow = matchCsvRow(csvRows, p.industry, p.tierLabel);
    const csvUrl = csvRow?.["Sales page Thank you page"] || null;
    if (csvUrl && !p.digistoreCheckoutUrl) {
      missingCheckoutVsCsv++;
      console.log(`  MISSING CHECKOUT (CSV has one): ${p.id}`);
    }
    if (p.digistoreCheckoutUrl && csvUrl && p.digistoreCheckoutUrl !== csvUrl) {
      invalidCheckoutMappings++;
      console.log(`  CHECKOUT MISMATCH: ${p.id} website=${p.digistoreCheckoutUrl} csv=${csvUrl}`);
    }
    if (p.digistoreCheckoutUrl && !/^https:\/\/www\.checkout-ds24\.com\/product\/\d+$/.test(p.digistoreCheckoutUrl)) {
      invalidCheckoutMappings++;
      console.log(`  INVALID CHECKOUT URL FORMAT: ${p.id} -> ${p.digistoreCheckoutUrl}`);
    }
  }
  console.log(`MISSING CHECKOUT URLS (vs CSV): ${missingCheckoutVsCsv}`);
  console.log(`INVALID CHECKOUT MAPPINGS: ${invalidCheckoutMappings}`);
  if (missingCheckoutVsCsv || invalidCheckoutMappings) pass = false;

  console.log("\n------------------------------------------------");
  console.log("APPROVAL STATUS (informational)");
  console.log("------------------------------------------------");
  for (const status of ["approved", "pending", "rejected", "coming_soon"] as const) {
    const count = PRODUCTS.filter((p) => p.approvalStatus === status).length;
    console.log(`${status.toUpperCase()}: ${count} / ${total}`);
  }
  const purchasable = PRODUCTS.filter((p) => canBuyNow(p));
  const comingSoon = PRODUCTS.filter((p) => !canBuyNow(p));
  console.log(`\nBUY NOW LIVE (real checkout URL mapped): ${purchasable.length} / ${total}`);
  console.log(`COMING SOON (no checkout URL mapped): ${comingSoon.length} / ${total}`);
  if (comingSoon.length > 0) {
    comingSoon.forEach((p) => console.log(`   - ${p.industry} — ${p.tierLabel} (${p.id}): no checkout URL`));
  }

  console.log("\n================================================");
  console.log("RESULT:", pass ? "PASS" : "FAIL");
  console.log("================================================");
  if (!pass) process.exit(1);
}

main();
