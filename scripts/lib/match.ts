import type { MasterCatalogRow } from "./sources";

/** Same matching logic used at generation time (see the Python generator) --
 * find the CSV row whose product name contains the tier label and every
 * significant word of the real niche name. Re-implemented here so audits
 * verify independently rather than trusting the generator's own output. */
export function matchCsvRow(
  csvRows: Record<string, string>[],
  nicheName: string,
  tierLabel: string,
): Record<string, string> | undefined {
  const tierLower = tierLabel.toLowerCase();
  const nicheWords = (nicheName.match(/[a-zA-Z]+/g) ?? [])
    .filter((w) => w.length > 2 && !["profit", "intelligence", "system", "the", "and"].includes(w.toLowerCase()));

  return csvRows.find((row) => {
    const name = (row["Product name"] ?? "").toLowerCase();
    if (!name.includes(tierLower)) return false;
    return nicheWords.every((w) => name.includes(w.toLowerCase()));
  });
}

export function catalogRow(
  catalog: MasterCatalogRow[],
  slug: string,
  tier: string,
): MasterCatalogRow | undefined {
  return catalog.find((r) => r.slug === slug && r.tier.toLowerCase() === tier.toLowerCase());
}
