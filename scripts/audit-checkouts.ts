import { PRODUCTS, canBuyNow } from "../src/lib/products";
import { loadCsvExport } from "./lib/sources";
import { matchCsvRow } from "./lib/match";

function main() {
  const csvRows = loadCsvExport();
  let mapped = 0;
  let missing = 0;
  let wrongMappings = 0;

  const urlCounts = new Map<string, string[]>();

  for (const p of PRODUCTS) {
    const csvRow = matchCsvRow(csvRows, p.industry, p.tierLabel);
    const csvUrl = csvRow?.["Sales page Thank you page"] || null;

    if (p.digistoreCheckoutUrl) {
      mapped++;
      urlCounts.set(p.digistoreCheckoutUrl, [...(urlCounts.get(p.digistoreCheckoutUrl) ?? []), p.id]);
    } else if (csvUrl) {
      missing++;
      console.log(`MISSING: ${p.id} -- CSV has a checkout URL but product data doesn't`);
    }

    if (csvUrl && p.digistoreCheckoutUrl && csvUrl !== p.digistoreCheckoutUrl) {
      wrongMappings++;
      console.log(`WRONG MAPPING: ${p.id} website=${p.digistoreCheckoutUrl} csv=${csvUrl}`);
    }
  }

  const duplicateUrls = [...urlCounts.entries()].filter(([, ids]) => ids.length > 1);
  if (duplicateUrls.length > 0) {
    console.log("\nDUPLICATE CHECKOUT URLS (shared across products -- should never happen):");
    duplicateUrls.forEach(([url, ids]) => console.log(`  ${url} -> ${ids.join(", ")}`));
  }

  console.log(`\n${PRODUCTS.length} products`);
  console.log(`${mapped} mapped checkout URLs`);
  console.log(`${missing} missing`);
  console.log(`${wrongMappings} wrong mappings`);
  console.log(`${duplicateUrls.length} duplicate URL(s)`);

  console.log("\n------------------------------------------------");
  console.log("APPROVAL STATUS (a mapped checkout URL is not the same as 'live')");
  console.log("------------------------------------------------");
  for (const status of ["approved", "pending", "rejected", "coming_soon"] as const) {
    console.log(`${status.toUpperCase()}: ${PRODUCTS.filter((p) => p.approvalStatus === status).length} / ${PRODUCTS.length}`);
  }
  const purchasable = PRODUCTS.filter((p) => canBuyNow(p));
  console.log(`\nCURRENTLY PURCHASABLE (submitted to Digistore24, Buy Now live): ${purchasable.length} / ${PRODUCTS.length} -- ${purchasable.map((p) => p.digistoreProductId).join(", ") || "none"}`);

  const ok = missing === 0 && wrongMappings === 0 && duplicateUrls.length === 0;
  console.log(`\nRESULT: ${ok ? "PASS" : "FAIL"}`);
  if (!ok) process.exit(1);
}

main();
