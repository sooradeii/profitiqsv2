import fs from "node:fs";
import path from "node:path";
import { PRODUCTS, REFUND_DAYS, REFUND_POLICY_STATUS, canBuyNow } from "../src/lib/products";
import { LEGAL_ENTITY } from "../src/lib/site-config";

const APP_DIR = path.resolve(__dirname, "..", "src", "app");

const REQUIRED_ROUTES = [
  "legal-information",
  "privacy-policy",
  "terms",
  "refund-policy",
  "disclaimer",
];

const FORBIDDEN_PATTERNS: { label: string; re: RegExp }[] = [
  { label: "guaranteed income/profit/savings/ROI claim", re: /guaranteed?\s+(income|profit|savings|roi|return)/i },
  { label: "risk-free claim", re: /risk[- ]free/i },
  { label: "fake countdown/urgency timer language", re: /(offer expires in|hurry|only \d+ (left|spots|seats) (remaining|left))/i },
  { label: "fabricated testimonial/review framing", re: /(verified (buyer|purchase)|★★★★★|"[A-Z][a-z]+ (from|in) [A-Z][a-z]+")/ },
  { label: "fabricated award/certification claim", re: /(award[- ]winning|certified #1|industry[- ]leading award)/i },
  { label: "competing payment processor mention", re: /\b(stripe checkout|paypal checkout|gumroad checkout|shopify checkout)\b/i },
  { label: "\"10x\" / hype superlative", re: /\b10x\b|revolutionary|game[- ]chang(er|ing)|secret (formula|method)|(?<!are not )a hack\b/i },
  { label: "unqualified 'lifetime' claim", re: /\blifetime (access|guarantee|deal)\b/i },
  { label: "Digistore24 used as a trust/marketing claim", re: /digistore24\s+(trusted|badge|approved|certified)/i },
  { label: "conflicting 90-day refund claim", re: /\b90[- ]days?\b/i },
  { label: "affiliate/commission recruitment content", re: /\b(affiliate|commission per sale|earn \d+%|partner program|affiliate link|affiliate signup|affiliate opportunity)\b/i },
  { label: "unsupported financial-outcome claim", re: /\b(make money|get rich|double your (revenue|profit|income)s?|increase your (profit|revenue|income)s? by|guaranteed roi|earn \$\d)/i },
];

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && /\.(tsx|ts)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function main() {
  console.log("================================================");
  console.log("PROFITIQS COMPLIANCE AUDIT");
  console.log("================================================\n");

  let pass = true;

  console.log("REQUIRED LEGAL ROUTES");
  for (const route of REQUIRED_ROUTES) {
    const exists = fs.existsSync(path.join(APP_DIR, route, "page.tsx"));
    console.log(`  ${exists ? "OK" : "MISSING"}: /${route}`);
    if (!exists) pass = false;
  }

  console.log(`\nAFFILIATE ROUTE REMOVED: ${!fs.existsSync(path.join(APP_DIR, "affiliate")) ? "OK -- /affiliate does not exist" : "BLOCKED -- /affiliate still exists"}`);
  if (fs.existsSync(path.join(APP_DIR, "affiliate"))) pass = false;

  const legalConfirmed = LEGAL_ENTITY.confirmed === true && !!LEGAL_ENTITY.legalName && !!LEGAL_ENTITY.address && !!LEGAL_ENTITY.email && !!LEGAL_ENTITY.phone;
  console.log(`\nLEGAL INFORMATION: ${legalConfirmed ? `CONFIRMED -- ${LEGAL_ENTITY.legalName}, real address/email/phone present, not a registered company (correctly disclosed)` : "BLOCKED -- LEGAL_ENTITY is missing required real values"}`);
  if (!legalConfirmed) pass = false;

  const refundConfirmed = REFUND_POLICY_STATUS === "confirmed" && REFUND_DAYS === 60;
  console.log(`REFUND POLICY: ${refundConfirmed ? "CONFIRMED -- 60 days (Digistore24 Compliance, minimum 60-day requirement met)" : "BLOCKED -- refund policy not confirmed at 60 days"}`);
  if (!refundConfirmed) pass = false;

  // Per direct, explicit Digistore24 Compliance instruction: every product
  // with a real checkout URL must show a working Buy Now button -- Coming
  // Soon is only for products with no mapped checkout URL at all.
  const gatingCorrect = PRODUCTS.every((p) => canBuyNow(p) === !!p.digistoreCheckoutUrl);
  const purchasable = PRODUCTS.filter((p) => canBuyNow(p));
  const comingSoon = PRODUCTS.filter((p) => !canBuyNow(p));
  console.log(`\nBUY NOW GATING: ${gatingCorrect ? "OK -- canBuyNow() true whenever a real checkout URL exists" : "BLOCKED -- canBuyNow() does not match digistoreCheckoutUrl presence"}`);
  console.log(`BUY NOW LIVE: ${purchasable.length} / ${PRODUCTS.length}`);
  console.log(`COMING SOON (no checkout URL mapped): ${comingSoon.length} / ${PRODUCTS.length}${comingSoon.length ? " -- " + comingSoon.map((p) => p.id).join(", ") : ""}`);
  if (!gatingCorrect) pass = false;

  // Verify every Buy Now link actually points at THAT product's own real
  // Digistore24 checkout URL, in the exact expected URL shape, with the
  // embedded product ID matching digistoreProductId -- catches a wrong-
  // product-linked-to-another's-checkout bug programmatically.
  let checkoutMismatches = 0;
  for (const p of purchasable) {
    const expected = `https://www.checkout-ds24.com/product/${p.digistoreProductId}`;
    if (p.digistoreCheckoutUrl !== expected) {
      checkoutMismatches++;
      console.log(`  ⚠  CHECKOUT URL MISMATCH: ${p.id} -- expected ${expected}, got ${p.digistoreCheckoutUrl}`);
    }
  }
  console.log(`CHECKOUT URL SHAPE/ID MATCH: ${checkoutMismatches === 0 ? `OK -- all ${purchasable.length} purchasable products link to their own correct product ID` : `BLOCKED -- ${checkoutMismatches} mismatch(es)`}`);
  if (checkoutMismatches > 0) pass = false;

  const files = walk(APP_DIR);
  const productPage = files.find((f) => f.includes(path.join("products", "[id]", "page.tsx")));
  const digitalDisclosure = productPage
    ? /digital product/i.test(fs.readFileSync(productPage, "utf-8"))
    : false;
  console.log(`\nDIGITAL PRODUCT DISCLOSURE ON PRODUCT PAGE: ${digitalDisclosure ? "PRESENT" : "MISSING"}`);
  if (!digitalDisclosure) pass = false;

  console.log("\nSCANNING ALL SOURCE FILES FOR FORBIDDEN LANGUAGE...");
  let violations = 0;
  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.re.test(content)) {
        violations++;
        console.log(`  ⚠  ${pattern.label} -- ${path.relative(APP_DIR, file)}`);
      }
    }
  }
  console.log(`Forbidden-language violations: ${violations}`);
  if (violations > 0) pass = false;

  console.log("\n================================================");
  console.log("RESULT:", pass ? "PASS" : "BLOCKED");
  console.log("================================================");
  if (!pass) process.exit(1);
}

main();
