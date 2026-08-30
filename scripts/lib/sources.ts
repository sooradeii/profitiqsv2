import fs from "node:fs";
import path from "node:path";

// Real source-of-truth files live outside this project, in the shared
// products root. Every audit re-parses these fresh rather than trusting
// the generated src/lib/products.ts blindly.
const SOURCE_ROOT = path.resolve(__dirname, "..", "..", "..", "..");

export const MASTER_CATALOG_PATH = path.join(SOURCE_ROOT, "DS24_MASTER_CATALOG.json");
export const CSV_EXPORT_PATH = path.join(SOURCE_ROOT, "DS24_CSV_EXPORT.csv");

export interface MasterCatalogRow {
  niche: string;
  category: string;
  slug: string;
  tier: string;
  internal_product_name: string;
  customer_product_name: string;
  price_usd: number | null;
  ds24_product_id: string | null;
  checkout_url: string | null;
  cover_path: string | null;
  cover_exists: boolean;
  refund_policy: string | null;
  approval_status: string;
}

export function loadMasterCatalog(): MasterCatalogRow[] {
  const raw = fs.readFileSync(MASTER_CATALOG_PATH, "utf-8");
  return JSON.parse(raw);
}

/** Minimal quoted-CSV parser -- handles embedded commas inside quoted
 * fields, which is all this export needs (no escaped quotes within a
 * field in this data). */
export function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r\n|\n/).filter((l) => l.length > 0);
  const header = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row: Record<string, string> = {};
    header.forEach((h, i) => {
      row[h] = cells[i] ?? "";
    });
    return row;
  });
}

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        cells.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
  }
  cells.push(cur);
  return cells;
}

export function loadCsvExport(): Record<string, string>[] {
  let raw = fs.readFileSync(CSV_EXPORT_PATH, "utf-8");
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1); // strip BOM
  return parseCsv(raw);
}
