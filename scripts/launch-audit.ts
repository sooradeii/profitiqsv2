import { execSync, spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { PRODUCTS } from "../src/lib/products";
import { LEGAL_ENTITY } from "../src/lib/site-config";

const ROOT = path.resolve(__dirname, "..");
const APP_DIR = path.join(ROOT, "src", "app");

function runCheck(label: string, cmd: string): boolean {
  try {
    execSync(cmd, { stdio: "pipe", cwd: ROOT });
    console.log(`${label}: PASS`);
    return true;
  } catch {
    console.log(`${label}: FAIL`);
    return false;
  }
}

function checkRoutesExist(): boolean {
  const expected = [
    "page.tsx", "products/page.tsx", "products/[id]/page.tsx",
    "industries/page.tsx", "industries/[slug]/page.tsx",
    "essential/page.tsx", "elite/page.tsx", "complete/page.tsx",
    "compare/page.tsx", "affiliate/page.tsx", "about/page.tsx",
    "contact/page.tsx", "faq/page.tsx", "legal-information/page.tsx",
    "privacy-policy/page.tsx", "terms/page.tsx", "refund-policy/page.tsx",
    "disclaimer/page.tsx", "robots.ts", "sitemap.ts", "not-found.tsx",
  ];
  let ok = true;
  for (const rel of expected) {
    if (!fs.existsSync(path.join(APP_DIR, rel))) {
      console.log(`  MISSING ROUTE FILE: ${rel}`);
      ok = false;
    }
  }
  return ok;
}

function checkSeoMetadata(): boolean {
  let ok = true;
  const pages = [
    "page.tsx", "products/page.tsx", "industries/page.tsx", "essential/page.tsx",
    "elite/page.tsx", "complete/page.tsx", "compare/page.tsx", "affiliate/page.tsx",
    "about/page.tsx", "contact/page.tsx", "faq/page.tsx", "legal-information/page.tsx",
    "privacy-policy/page.tsx", "terms/page.tsx", "refund-policy/page.tsx", "disclaimer/page.tsx",
    "products/[id]/page.tsx", "industries/[slug]/page.tsx",
  ];
  for (const rel of pages) {
    const full = path.join(APP_DIR, rel);
    if (!fs.existsSync(full)) continue;
    const content = fs.readFileSync(full, "utf-8");
    if (!/export const metadata|export (async )?function generateMetadata/.test(content)) {
      console.log(`  NO METADATA EXPORT: ${rel}`);
      ok = false;
    }
    if (!/alternates:\s*{\s*canonical/.test(content)) {
      console.log(`  NO CANONICAL URL: ${rel}`);
      ok = false;
    }
  }
  return ok;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url: string, tries = 30): Promise<boolean> {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.status === 200) return true;
    } catch {
      // not up yet
    }
    await sleep(1000);
  }
  return false;
}

async function runResponsiveQa(): Promise<boolean> {
  let server: ChildProcess | undefined;
  try {
    server = spawn("npm", ["run", "start"], { cwd: ROOT, shell: true, stdio: "ignore" });
    const up = await waitForServer("http://localhost:3000/");
    if (!up) {
      console.log("  server did not come up in time");
      return false;
    }
    execSync("node scripts/qa-sweep.mjs", { stdio: "inherit", cwd: ROOT });
    return true;
  } catch {
    return false;
  } finally {
    if (server && server.pid) {
      try {
        execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: "ignore" });
      } catch {
        server.kill();
      }
    }
  }
}

async function main() {
  console.log("PROFITIQS LAUNCH AUDIT\n");

  const total = PRODUCTS.length;
  console.log("CATALOG");
  console.log(`${total} / 63\n`);

  console.log("TIERS");
  const e = PRODUCTS.filter((p) => p.tier === "essential").length;
  const el = PRODUCTS.filter((p) => p.tier === "elite").length;
  const c = PRODUCTS.filter((p) => p.tier === "complete").length;
  console.log(`${e} / ${el} / ${c}  (expected 21 / 21 / 21)\n`);

  console.log("PRICES");
  const pricesOk = runCheck("  audit-prices", "npm run audit-prices");
  console.log("");

  console.log("PRODUCT DATA");
  const productsOk = runCheck("  audit-products", "npm run audit-products");
  console.log("");

  console.log("COVERS");
  const missingCovers = PRODUCTS.filter(
    (p) => !p.coverImage || !fs.existsSync(path.join(ROOT, "public", p.coverImage.replace(/^\//, ""))),
  );
  console.log(missingCovers.length === 0 ? "PASS" : `FAIL (${missingCovers.length} missing)`);
  console.log("");

  console.log("CHECKOUT MAPPINGS");
  const checkoutsOk = runCheck("  audit-checkouts", "npm run audit-checkouts");
  console.log("");

  console.log("ROUTES");
  const routesOk = checkRoutesExist();
  console.log(routesOk ? "PASS" : "FAIL");
  console.log("");

  console.log("SEO");
  const seoOk = checkSeoMetadata();
  console.log(seoOk ? "PASS" : "FAIL");
  console.log("");

  console.log("LEGAL");
  console.log(LEGAL_ENTITY.confirmed ? "PASS" : "BLOCKED (no real legal entity name/address/VAT ID provided -- see src/lib/site-config.ts)");
  console.log("");

  console.log("COMPLIANCE");
  const complianceOk = runCheck("  audit-compliance", "npm run audit-compliance");
  console.log("");

  console.log("BUILD");
  const buildOk = runCheck("  next build", "npm run build");
  console.log("");

  console.log("LINT");
  const lintOk = runCheck("  eslint", "npm run lint");
  console.log("");

  console.log("RESPONSIVE QA (7 breakpoints x every real route, production server)");
  const qaOk = buildOk ? await runResponsiveQa() : false;
  console.log(qaOk ? "PASS" : "FAIL");
  console.log("");

  const catalogOk = total === 63 && e === 21 && el === 21 && c === 21;
  const coversOk = missingCovers.length === 0;

  const allOk =
    catalogOk && pricesOk && productsOk && coversOk && checkoutsOk &&
    routesOk && seoOk && complianceOk && buildOk && lintOk && qaOk;
  const legalBlocked = !LEGAL_ENTITY.confirmed;

  console.log("================================================");
  console.log("RESULT:");
  if (allOk && !legalBlocked) {
    console.log("PASS");
  } else if (allOk && legalBlocked) {
    console.log("BLOCKED -- everything else passes; legal entity information is the only unresolved item (see LEGAL above). Not fabricated, not published.");
  } else {
    console.log("BLOCKED -- see failing sections above.");
  }
  console.log("================================================");

  if (!allOk) process.exit(1);
}

main();
