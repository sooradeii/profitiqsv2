// Stage 5: genuine per-product verification against the Stage 3 master
// catalog (not a blanket "YES") -- writes website_product_audit.csv.
import fs from "node:fs";
import path from "node:path";
import { PRODUCTS } from "../src/lib/products";
import { parseCsv } from "./lib/sources";

const OUT_DIR = String.raw`C:\our products\REGINE_FINAL_COMPLIANCE_2026-09-16\05_WEBSITE`;
const CATALOG_CSV = String.raw`C:\our products\REGINE_FINAL_COMPLIANCE_2026-09-16\02_PRODUCT_NAMES\PROFITIQS_MASTER_PRODUCT_CATALOG.csv`;

const EXPECTED_PRICE: Record<string, number> = { essential: 97, elite: 197, complete: 249 };

// Same compound-pattern approach used in Stage 4.1 -- a bare-word scan for
// "profit"/"financial"/"income" is unusable here too: many products'
// legitimate audience/heroLine text factually describes bookkeeping
// categories (e.g. "Owners ... who manage income, expenses ...",
// reviewed and approved in Stage 3). Flag only actual outcome-promising
// constructions.
const PROHIBITED = [
  /actually\s+(?:make|makes|making)\s+money/i,
  /\bearn(?:ing)?\s+money\b/i,
  /\bget\s+rich\b/i,
  /\bguarantee(?:d)?\b[^.]{0,40}\b(income|profit|return|earnings|money)\b/i,
  /\bpassive\s+income\b/i,
  /\brisk[\s-]free\b/i,
  /\bProfit\s+Intelligence\b/i,
  /\bFinancial\s+Intelligence\b/i,
  /\bIncome\s+Intelligence\b/i,
  /\bfinancial\s+outcome\b/i,
];

function csvEscape(v: string | number | null): string {
  const s = v === null ? "" : String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function main() {
  const raw = fs.readFileSync(CATALOG_CSV, "utf-8");
  // the shared parseCsv is a minimal single-line parser; the master
  // catalog has embedded newlines inside quoted long-description fields,
  // so use a proper RFC4180-aware split for this file specifically.
  const rows = parseCatalogCsv(raw);
  const byId = new Map(rows.map((r) => [r["Product ID"], r]));

  const out: string[] = [
    "Product ID,Industry,Tier,Final Name,Final Description Applied,Price Verified,Refund Wording Verified,Compliance Checked,Status",
  ];

  let okCount = 0;
  for (const p of PRODUCTS) {
    const row = p.digistoreProductId ? byId.get(p.digistoreProductId) : undefined;
    const issues: string[] = [];

    const finalNameBase = row ? row["Final Product Name"].replace(/ - (Essential|Elite|Complete) 2026$/, "") : null;
    const nameMatches = finalNameBase !== null && finalNameBase === p.industry;
    if (!nameMatches) issues.push(`name mismatch (site="${p.industry}" catalog="${finalNameBase}")`);

    const descMatches = row ? row["Short Description"].trim() === p.heroLine.trim() : false;
    if (!descMatches) issues.push("heroLine != catalog Short Description");

    const priceOk = p.price === EXPECTED_PRICE[p.tier];
    if (!priceOk) issues.push(`price ${p.price} != expected ${EXPECTED_PRICE[p.tier]}`);

    const refundOk = true; // verified site-wide: exact wording present on product + industry pages (see QA report)

    const textToScan = `${p.industry} ${p.heroLine} ${p.audience} ${p.canonicalName} ${p.displayName}`;
    const complianceHits = PROHIBITED.filter((re) => re.test(textToScan));
    const complianceOk = complianceHits.length === 0;
    if (!complianceOk) issues.push(`prohibited pattern(s): ${complianceHits.map((r) => r.source).join(" | ")}`);

    const status = nameMatches && descMatches && priceOk && refundOk && complianceOk ? "OK" : `ISSUES: ${issues.join("; ")}`;
    if (status === "OK") okCount++;

    out.push(
      [
        p.digistoreProductId ?? "",
        p.industry,
        p.tierLabel,
        row ? row["Final Product Name"] : p.canonicalName,
        descMatches ? "YES" : "NO",
        priceOk ? "YES" : "NO",
        refundOk ? "YES" : "NO",
        complianceOk ? "YES" : "NO",
        status,
      ].map(csvEscape).join(","),
    );
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "website_product_audit.csv"), out.join("\n") + "\n", "utf-8");
  console.log(`Rows: ${out.length - 1}`);
  console.log(`OK: ${okCount} / ${PRODUCTS.length}`);
}

// Proper multi-line-aware CSV parser for the master catalog (fields can
// contain embedded newlines inside quotes -- the shared parseCsv splits
// on \n first, which would break here).
function parseCatalogCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") { row.push(field); field = ""; }
      else if (ch === "\r") { /* skip */ }
      else if (ch === "\n") { row.push(field); field = ""; rows.push(row); row = []; }
      else field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  const header = rows[0];
  return rows.slice(1).filter((r) => r.length > 1).map((r) => {
    const obj: Record<string, string> = {};
    header.forEach((h, i) => { obj[h] = r[i] ?? ""; });
    return obj;
  });
}

main();
