import { PRODUCTS } from "../src/lib/products";
import { loadMasterCatalog } from "./lib/sources";
import { catalogRow } from "./lib/match";

function main() {
  const catalog = loadMasterCatalog();
  let present = 0;
  let mismatches = 0;

  for (const p of PRODUCTS) {
    if (p.price !== null) present++;
    const row = catalogRow(catalog, p.slug, p.tier);
    if (row && row.price_usd !== p.price) {
      mismatches++;
      console.log(`MISMATCH: ${p.id} website=$${p.price} canonical=$${row.price_usd}`);
    }
    if (!row) {
      mismatches++;
      console.log(`NO CANONICAL SOURCE ROW: ${p.id}`);
    }
  }

  console.log(`\n${PRODUCTS.length} products`);
  console.log(`${present} prices present`);
  console.log(`${mismatches} mismatches`);
  console.log(`\nRESULT: ${mismatches === 0 && present === PRODUCTS.length ? "PASS" : "FAIL"}`);
  if (mismatches > 0 || present !== PRODUCTS.length) process.exit(1);
}

main();
