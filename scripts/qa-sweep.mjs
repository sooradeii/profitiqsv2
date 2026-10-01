// Production QA sweep: every real route x viewport breakpoints from the
// spec (1440/1280/1024/768/480/390/375). Checks HTTP status, horizontal
// overflow, broken <img>, console errors, and forbidden phrases. Run
// against `npm run start` (production build), not the dev server.

import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, "..");
const BASE_URL = process.env.QA_BASE_URL || "http://localhost:3000";

const productsSrc = readFileSync(path.join(SITE_ROOT, "src", "lib", "products.ts"), "utf-8");
const slugs = [...new Set([...productsSrc.matchAll(/\bslug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]))];
const productIds = [...productsSrc.matchAll(/\bid:\s*"([a-z0-9-]+-(?:essential|elite|complete))"/g)].map((m) => m[1]);

// Read REVIEW_MODE / PUBLISHED_PRODUCTS the same way products.ts is read
// above -- parsed from source, not imported, so this plain .mjs script
// doesn't need a TS loader. Keeps this sweep honest about exactly what
// the live site currently gates, instead of hardcoding route
// expectations that could drift from src/lib/site-config.ts.
const siteConfigSrc = readFileSync(path.join(SITE_ROOT, "src", "lib", "site-config.ts"), "utf-8");
const REVIEW_MODE = /\bREVIEW_MODE\s*=\s*true/.test(siteConfigSrc);
const PUBLISHED_PRODUCTS = REVIEW_MODE
  ? [...siteConfigSrc.matchAll(/"([a-z0-9-]+)"/g)]
      .map((m) => m[1])
      .filter((id) => productIds.includes(id))
  : productIds;
const PUBLISHED_NICHE_SLUGS = REVIEW_MODE
  ? [...new Set(PUBLISHED_PRODUCTS.map((id) => id.replace(/-(essential|elite|complete)$/, "")))]
  : slugs;

const STATIC_ROUTES = REVIEW_MODE
  ? [
      "/", "/how-it-works", "/about", "/contact", "/faq",
      "/legal-information", "/privacy-policy", "/terms", "/refund-policy", "/disclaimer",
      "/thank-you",
    ]
  : [
      "/", "/products", "/industries", "/essential", "/elite", "/complete",
      "/compare", "/about", "/contact", "/faq",
      "/legal-information", "/privacy-policy", "/terms", "/refund-policy", "/disclaimer",
      "/thank-you",
    ];

// Catalog-listing routes that are disabled outright (not data-driven)
// while REVIEW_MODE is on -- swept too, but expected to 404, which
// proves the gate is actually working instead of just assuming it.
const DISABLED_STATIC_ROUTES = REVIEW_MODE
  ? ["/products", "/industries", "/essential", "/elite", "/complete", "/compare"]
  : [];

const routes = [
  ...STATIC_ROUTES.map((r) => ({ route: r, expectedStatus: 200 })),
  ...DISABLED_STATIC_ROUTES.map((r) => ({ route: r, expectedStatus: 404 })),
  ...slugs.map((s) => ({
    route: `/industries/${s}`,
    expectedStatus: REVIEW_MODE ? (PUBLISHED_NICHE_SLUGS.includes(s) ? 200 : 404) : 200,
  })),
  ...productIds.map((id) => ({
    route: `/products/${id}`,
    expectedStatus: REVIEW_MODE ? (PUBLISHED_PRODUCTS.includes(id) ? 200 : 404) : 200,
  })),
];

const VIEWPORTS = [
  { name: "1440w", width: 1440, height: 900 },
  { name: "1280w", width: 1280, height: 800 },
  { name: "1024w", width: 1024, height: 768 },
  { name: "768w", width: 768, height: 1024 },
  { name: "480w", width: 480, height: 900 },
  { name: "390w", width: 390, height: 844 },
  { name: "375w", width: 375, height: 812 },
];

const FORBIDDEN_PHRASES = [
  /guaranteed?\s+(income|profit|savings|roi|return)/i,
  /risk-free/i,
  /offer expires in/i,
];

let totalChecks = 0;
const failures = [];

async function checkRoute(context, route, expectedStatus) {
  for (const vp of VIEWPORTS) {
    totalChecks++;
    const page = await context.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });

    const consoleErrors = [];
    page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
    page.on("pageerror", (err) => consoleErrors.push(String(err)));

    let status = null;
    try {
      const resp = await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle", timeout: 30000 });
      status = resp ? resp.status() : null;
    } catch (e) {
      failures.push({ route, viewport: vp.name, kind: "navigation-error", detail: String(e).slice(0, 200) });
      await page.close();
      continue;
    }

    if (status !== expectedStatus) failures.push({ route, viewport: vp.name, kind: "http-status", detail: `expected ${expectedStatus}, got ${status}` });

    // A route expected to 404 (review-mode-hidden product/industry/
    // catalog page) only needs its status + the page-health checks
    // below -- its content is the generic not-found page, not
    // product content, so skip the forbidden-phrase scan for it.
    if (expectedStatus !== 200) {
      const overflow404 = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      if (overflow404) failures.push({ route, viewport: vp.name, kind: "horizontal-overflow", detail: "404 page overflow" });
      // Chromium itself logs "Failed to load resource: ... 404" for the
      // main-frame navigation whenever the server correctly returns the
      // expected 404 -- that's the status check above confirming success,
      // not an application error, so it's excluded here specifically.
      const realErrors = consoleErrors.filter((e) => !/Failed to load resource.*404/.test(e));
      if (realErrors.length > 0) failures.push({ route, viewport: vp.name, kind: "console-error", detail: realErrors.slice(0, 3).join(" | ").slice(0, 300) });
      await page.close();
      continue;
    }

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (overflow) {
      const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
      failures.push({ route, viewport: vp.name, kind: "horizontal-overflow", detail: `scrollWidth=${scrollW}` });
    }

    const brokenImgs = await page.evaluate(() =>
      Array.from(document.images).filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.src));
    if (brokenImgs.length > 0) failures.push({ route, viewport: vp.name, kind: "broken-image", detail: brokenImgs.join(", ").slice(0, 300) });

    const bodyText = await page.evaluate(() => document.body.innerText);
    for (const re of FORBIDDEN_PHRASES) {
      if (re.test(bodyText)) failures.push({ route, viewport: vp.name, kind: "forbidden-phrase", detail: re.source });
    }

    if (consoleErrors.length > 0) failures.push({ route, viewport: vp.name, kind: "console-error", detail: consoleErrors.slice(0, 3).join(" | ").slice(0, 300) });

    await page.close();
  }
}

async function main() {
  console.log(`QA SWEEP: ${routes.length} routes x ${VIEWPORTS.length} viewports = ${routes.length * VIEWPORTS.length} checks\n`);
  const browser = await chromium.launch();
  const context = await browser.newContext();
  for (const r of routes) await checkRoute(context, r.route, r.expectedStatus);
  await browser.close();

  console.log(`Total checks run: ${totalChecks}`);
  console.log(`Failures: ${failures.length}\n`);

  if (failures.length > 0) {
    const byKind = {};
    for (const f of failures) byKind[f.kind] = (byKind[f.kind] || 0) + 1;
    console.log("Failures by kind:", byKind);
    for (const f of failures.slice(0, 60)) console.log(`  [${f.viewport}] ${f.route} -- ${f.kind}: ${f.detail}`);
    console.log("\nRESULT: FAIL");
    process.exit(1);
  } else {
    console.log("RESULT: PASS");
  }
}

main();
