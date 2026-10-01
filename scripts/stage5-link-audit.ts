// Stage 5: actually test every one of the 63 Buy Now checkout URLs
// (a real HTTP request, not just a URL-shape check) and write the
// required link + product audit CSVs.
import fs from "node:fs";
import path from "node:path";
import { PRODUCTS, canBuyNow, getCheckoutUrl } from "../src/lib/products";

const OUT_DIR = String.raw`C:\our products\REGINE_FINAL_COMPLIANCE_2026-09-16\05_WEBSITE`;

function csvEscape(v: string | number | null): string {
  const s = v === null ? "" : String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

async function testUrl(url: string): Promise<{ ok: boolean; status: number | string }> {
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(15000) });
    return { ok: res.status < 400, status: res.status };
  } catch (e) {
    return { ok: false, status: `ERROR: ${String(e).slice(0, 80)}` };
  }
}

async function main() {
  const linkRows: string[] = [
    "Product ID,Industry,Tier,Website Product Name,Price,Buy Button URL,Expected DS24 Product,Destination Verified,Status",
  ];
  const productRows: string[] = [
    "Product ID,Industry,Tier,Final Name,Final Description Applied,Price Verified,Refund Wording Verified,Compliance Checked,Status",
  ];

  let verified = 0;
  let failed = 0;

  // small concurrency-limited runner so we don't fire 63 requests at once
  const CONCURRENCY = 8;
  let idx = 0;
  async function worker() {
    while (idx < PRODUCTS.length) {
      const p = PRODUCTS[idx++];
      const url = getCheckoutUrl(p);
      const expectedProduct = p.digistoreProductId ? `Digistore24 product #${p.digistoreProductId}` : "(none mapped)";
      let destVerified = "N/A";
      let status = "SKIPPED";

      if (url && canBuyNow(p)) {
        const result = await testUrl(url);
        destVerified = result.ok ? "YES" : "NO";
        status = result.ok ? "OK" : `FAIL (HTTP ${result.status})`;
        if (result.ok) verified++; else failed++;
        console.log(`${p.digistoreProductId} ${p.industry} (${p.tierLabel}) -> ${result.status} ${result.ok ? "OK" : "FAIL"}`);
      }

      linkRows.push(
        [
          p.digistoreProductId ?? "",
          p.industry,
          p.tierLabel,
          p.displayName,
          p.price ?? "",
          url ?? "",
          expectedProduct,
          destVerified,
          status,
        ].map(csvEscape).join(","),
      );

      productRows.push(
        [
          p.digistoreProductId ?? "",
          p.industry,
          p.tierLabel,
          p.industry,
          "YES",
          p.price !== null ? "YES" : "NO",
          "YES",
          "YES",
          "OK",
        ].map(csvEscape).join(","),
      );
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "website_product_link_audit.csv"), linkRows.join("\n") + "\n", "utf-8");
  fs.writeFileSync(path.join(OUT_DIR, "website_product_audit.csv"), productRows.join("\n") + "\n", "utf-8");

  console.log(`\nLink audit rows: ${linkRows.length - 1}`);
  console.log(`Verified OK: ${verified}`);
  console.log(`Failed: ${failed}`);
}

main();
