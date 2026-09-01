import fs from "node:fs";
import path from "node:path";
import { PRODUCTS, REFUND_DAYS, REFUND_POLICY_STATUS, DS24_ACTIVE_PRODUCT_IDS, canBuyNow } from "../src/lib/products";
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

  const dsActiveOk = DS24_ACTIVE_PRODUCT_IDS.length > 0 && DS24_ACTIVE_PRODUCT_IDS.every((id) => PRODUCTS.some((p) => p.digistoreProductId === id));
  const gatingCorrect = PRODUCTS.every((p) => canBuyNow(p) === (!!p.digistoreProductId && DS24_ACTIVE_PRODUCT_IDS.includes(p.digistoreProductId) && !!p.digistoreCheckoutUrl));
  const purchasable = PRODUCTS.filter((p) => canBuyNow(p));
  console.log(`\nBUY NOW GATING: ${gatingCorrect && dsActiveOk ? `OK -- canBuyNow() true only for DS24_ACTIVE_PRODUCT_IDS (${DS24_ACTIVE_PRODUCT_IDS.join(", ")})` : "BLOCKED -- canBuyNow() does not match the id-based gate"}`);
  console.log(`CURRENTLY PURCHASABLE: ${purchasable.length} / ${PRODUCTS.length} -- ${purchasable.map((p) => `${p.id} (${p.digistoreProductId})`).join(", ") || "none"}`);
  if (!gatingCorrect || !dsActiveOk) pass = false;

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
