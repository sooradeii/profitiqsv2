import fs from "node:fs";
import path from "node:path";

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

  const legalInfoContent = fs.readFileSync(path.join(APP_DIR, "legal-information", "page.tsx"), "utf-8");
  const legalConfirmed = /LEGAL_ENTITY\.confirmed/.test(legalInfoContent);
  console.log(`\nLEGAL INFORMATION: ${legalConfirmed ? "references LEGAL_ENTITY.confirmed gate (BLOCKED until real data provided)" : "WARNING -- no confirmation gate found"}`);

  const PRODUCTS_LIB = path.resolve(__dirname, "..", "src", "lib", "products.ts");
  const productsSrc = fs.readFileSync(PRODUCTS_LIB, "utf-8");
  const approvalGated = /canBuyNow[\s\S]{0,120}approvalStatus === "approved"/.test(productsSrc);
  console.log(`\nBUY NOW GATING: ${approvalGated ? "canBuyNow() requires approvalStatus === \"approved\" (checkout URL alone is not enough)" : "BLOCKED -- canBuyNow() does not gate on real approval status"}`);
  if (!approvalGated) pass = false;

  const refundPageContent = fs.readFileSync(path.join(APP_DIR, "refund-policy", "page.tsx"), "utf-8");
  const hardcodedRefundDays = /\b\d{1,3}-day\b/i.test(refundPageContent);
  console.log(`REFUND POLICY PAGE: ${hardcodedRefundDays ? "BLOCKED -- publishes a specific day count while the policy is unconfirmed" : "no hardcoded day count (consistent with unconfirmed status)"}`);
  if (hardcodedRefundDays) pass = false;

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
