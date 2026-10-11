// Verifies the TEMPORARY Digistore24 review-mode gate is configured
// correctly: full catalog data still intact, the one published product
// points at the real 720175 checkout, and the simplified nav doesn't
// leak links to the hidden catalog. Complements qa-sweep.mjs, which
// verifies the actual HTTP behavior (200 vs 404) against a running
// build -- this script checks the source data/config directly, so it
// runs fast and without a server.
import fs from "node:fs";
import path from "node:path";
import { PRODUCTS, getProductById, getProductsByNiche } from "../src/lib/products";
import {
  REVIEW_MODE,
  PUBLISHED_PRODUCTS,
  PUBLISHED_NICHE_SLUGS,
  MAIN_NAV,
  FOOTER_LINKS,
  isPublishedProduct,
} from "../src/lib/site-config";

const ROOT = path.resolve(__dirname, "..");

let ok = true;
function check(label: string, pass: boolean, detail?: string) {
  console.log(`  ${pass ? "PASS" : "FAIL"} -- ${label}${detail ? `: ${detail}` : ""}`);
  if (!pass) ok = false;
}

const EXPECTED_PUBLISHED_NICHES = [
  "1099-income",
  "airbnb",
  "auto-repair",
  "cleaning-service",
  "construction",
  "dental-practice",
  "digital-marketing-agency",
  "ecommerce",
  "electrical-contractor",
  "hvac",
  "pest-control",
].sort();

console.log("REVIEW MODE AUDIT\n");

check("REVIEW_MODE is on", REVIEW_MODE === true);
check("exactly 33 published products (11 niches x 3 tiers)", PUBLISHED_PRODUCTS.length === 33, String(PUBLISHED_PRODUCTS.length));
check("exactly 11 published niches", PUBLISHED_NICHE_SLUGS.length === 11, PUBLISHED_NICHE_SLUGS.join(", "));
check(
  "published niches are the expected 11",
  JSON.stringify([...PUBLISHED_NICHE_SLUGS].sort()) === JSON.stringify(EXPECTED_PUBLISHED_NICHES),
  PUBLISHED_NICHE_SLUGS.join(", "),
);
check("each published niche has exactly 3 published tiers", PUBLISHED_NICHE_SLUGS.every((slug) =>
  PUBLISHED_PRODUCTS.filter((id) => id.startsWith(`${slug}-`)).length === 3,
));

console.log("\nFULL CATALOG DATA STILL INTACT (nothing deleted)");
check("63 products still in PRODUCTS", PRODUCTS.length === 63, `found ${PRODUCTS.length}`);
for (const tier of ["essential", "elite", "complete"] as const) {
  const n = PRODUCTS.filter((p) => p.tier === tier).length;
  check(`21 ${tier} products still present`, n === 21, `found ${n}`);
}
const hiddenCount = PRODUCTS.filter((p) => !isPublishedProduct(p.id)).length;
check("30 products correctly hidden but recoverable", hiddenCount === 30, `found ${hiddenCount}`);
const hiddenNicheCount = new Set(PRODUCTS.map((p) => p.slug)).size - PUBLISHED_NICHE_SLUGS.length;
check("10 industries correctly hidden but recoverable", hiddenNicheCount === 10, `found ${hiddenNicheCount}`);

console.log("\nAUTO REPAIR -- ALL 3 TIERS PUBLISHED WITH REAL CHECKOUTS");
const autoRepairTiers = getProductsByNiche("auto-repair");
check("3 Auto Repair products found", autoRepairTiers.length === 3, `found ${autoRepairTiers.length}`);
const EXPECTED = {
  "auto-repair-essential": { digistoreProductId: "727149", price: 97 },
  "auto-repair-elite": { digistoreProductId: "727007", price: 197 },
  "auto-repair-complete": { digistoreProductId: "720175", price: 249 },
};
for (const [id, expected] of Object.entries(EXPECTED)) {
  const p = getProductById(id);
  check(`${id} exists and is published`, !!p && isPublishedProduct(id));
  if (p) {
    check(`${id}: digistoreProductId is ${expected.digistoreProductId}`, p.digistoreProductId === expected.digistoreProductId, p.digistoreProductId ?? "null");
    check(
      `${id}: checkout URL is the real ${expected.digistoreProductId} checkout`,
      p.digistoreCheckoutUrl === `https://www.checkout-ds24.com/product/${expected.digistoreProductId}`,
      p.digistoreCheckoutUrl ?? "null",
    );
    check(`${id}: price is $${expected.price}`, p.price === expected.price, String(p.price));
  }
}

console.log("\nNAVIGATION DOESN'T LEAK THE HIDDEN CATALOG");
const navHrefs = MAIN_NAV.map((i) => i.href);
const footerHrefs = Object.values(FOOTER_LINKS).flat().map((i) => i.href);
// "/industries" is intentionally enabled in review mode (filtered to
// published niches), so it's excluded from this forbidden list.
const forbidden = ["/products", "/essential", "/elite", "/complete", "/compare"];
for (const href of forbidden) {
  check(`nav does not link to ${href}`, !navHrefs.includes(href));
  check(`footer does not link to ${href}`, !footerHrefs.includes(href));
}
check("nav links to the industries listing", navHrefs.includes("/industries"));
check(
  "footer links to every published niche's industry page",
  PUBLISHED_NICHE_SLUGS.every((slug) => footerHrefs.includes(`/industries/${slug}`)),
  footerHrefs.filter((h) => h.startsWith("/industries/")).join(", "),
);
check(
  "no footer/nav link points at a hidden (unpublished) niche or product",
  [...navHrefs, ...footerHrefs].every((href) => {
    const industryMatch = href.match(/^\/industries\/([a-z0-9-]+)$/);
    if (industryMatch) return PUBLISHED_NICHE_SLUGS.includes(industryMatch[1]);
    const productMatch = href.match(/^\/products\/([a-z0-9-]+)$/);
    if (productMatch) return PUBLISHED_PRODUCTS.includes(productMatch[1]);
    return true;
  }),
);

console.log("\nNO FULL-CATALOG MESSAGING ON THE REVIEW-MODE HOMEPAGE");
// Checks the ReviewHomePage SOURCE specifically (not FullCatalogHomePage,
// which legitimately still says these things for when the catalog is
// restored) -- extracted by its function boundaries so this doesn't
// false-positive on the other, unused half of the same file.
const homeSrc = fs.readFileSync(path.join(ROOT, "src/app/page.tsx"), "utf-8");
const reviewHomeStart = homeSrc.indexOf("function ReviewHomePage()");
check("ReviewHomePage function found in src/app/page.tsx", reviewHomeStart !== -1);
const reviewHomeSrc = reviewHomeStart !== -1 ? homeSrc.slice(reviewHomeStart) : "";
const FORBIDDEN_CATALOG_PHRASES = [
  /21 business categories/i,
  /\b63 (products|systems)\b/i,
  /explore all industries/i,
  /find your industry/i,
];
for (const re of FORBIDDEN_CATALOG_PHRASES) {
  check(`ReviewHomePage does not contain /${re.source}/`, !re.test(reviewHomeSrc));
}

console.log("\nDYNAMIC-PARAMS LITERALS IN SYNC WITH REVIEW_MODE");
// Next.js requires `dynamicParams` to be a literal boolean it can
// statically parse at build time -- it can't be a computed
// `!REVIEW_MODE` expression, so these two files hardcode the literal
// by hand. If REVIEW_MODE ever flips without updating these, hidden
// products/industries would silently start rendering via on-demand
// SSR instead of 404ing. Catch that mismatch here, before a build.
const DYNAMIC_PARAMS_FILES = [
  "src/app/products/[id]/page.tsx",
  "src/app/industries/[slug]/page.tsx",
];
for (const rel of DYNAMIC_PARAMS_FILES) {
  const full = path.join(ROOT, rel);
  const src = fs.readFileSync(full, "utf-8");
  const m = src.match(/export const dynamicParams = (true|false);/);
  check(`${rel} has a literal dynamicParams export`, !!m);
  if (m) {
    const literal = m[1] === "true";
    check(`${rel}: dynamicParams (${m[1]}) matches !REVIEW_MODE`, literal === !REVIEW_MODE, `REVIEW_MODE=${REVIEW_MODE}`);
  }
}

console.log("\n================================================");
console.log(ok ? "RESULT: PASS" : "RESULT: FAIL");
console.log("================================================");

if (!ok) process.exit(1);
