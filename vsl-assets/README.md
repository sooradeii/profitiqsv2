# ProfitIQS — VSL Reference Kit (all 21 products)

This folder exists so a VSL (video sales letter) can be written and produced without needing the
real .xlsx workbooks or the full Field Guide PDFs (~500MB across the catalog) — everything a script
actually needs is already pulled out into `brief.md` per niche, plus a small set of real proof
screenshots.

**Brand:** ProfitIQS · **Platform:** sold through Digistore24 · **Support:** support@profitiqs.com
**Naming:** every product is `[Industry] Business Intelligence System™` (a few niches use a
different real name — Small Business Command Center™, Rental Property Management System™,
Trucking Owner-Operator Business Management System™ — use the exact name in each niche's own
`brief.md`, don't normalize it).
**Pricing (same across all 21 niches):** Essential $97 · Elite $197 · Complete $249 — one-time
Digistore24 purchase, not a subscription.
**Live site:** https://www.profitiqs.com — every niche has a real page at
`/industries/<slug>` (see each brief for its own slug/URL).

## How this folder is organized

```
vsl-assets/
  README.md              <- this file
  01-1099-income/
    brief.md              <- everything a VSL needs for this niche (see below)
    visuals/
      cover-essential.png  cover-elite.png   <- real product cover art
      dashboard.png                          <- a real, visually dense screenshot chosen as the hero proof shot
      <4 more>.png                           <- real screenshots of other sheets, spread across the workbook
  02-airbnb/
    ...
  ... through 21-trucking-owner-operator/
```

Folder numbers match the niche's position in the catalog, not necessarily release order.

## What's in every `brief.md`

Pulled directly from the real, already-shipped product data (the same source of truth the live
site and the affiliate kit use) — nothing in here is invented:

- **Pricing + what's included** per tier, with real Digistore24 product IDs and checkout URLs
- **Buyer profiles** — the real archetypes who buy this product
- **Pain points** — written to be used as a VSL's opening hook/agitation
- **Why they actually buy** — the real motivations
- **Common mistakes this audience makes** — good material for a cold open
- **Real KPIs the product tracks** — for the proof/features section
- **Objections, with the honest answer to each** — pre-empt these in the script
- **Who it's NOT for** — saying this on camera builds trust, don't skip it
- **The real Elite sheet list** — proof of depth (don't read it on camera, it's just what the
  screenshots are pulled from)
- **Existing short-form hook lines** — angle ideas already written, not a script to copy verbatim
- **A couple of hypothetical scenario lines** — illustrative only, these are not real customers and
  must not be presented as testimonials

## Rules for whoever writes the VSL from this

- Never invent a customer, a dollar outcome, a results claim, or a specific time saved. The
  "hypothetical" scenario lines in each brief are explicitly illustrative — if you use one, keep it
  framed as a hypothetical/sample-data example, not a real result.
- Don't claim "approved by Digistore24" — check current marketplace status before implying it.
- Every niche's commission/compliance rules live in the affiliate kit, not here — if the VSL is for
  affiliates rather than direct buyers, see `_affiliate_kit/source/00-Master-Affiliate-Kit/` for the
  Compliance Guide.
- Price, product IDs and checkout URLs in each brief are real and live — double check against
  `_affiliate_kit/source/98-Source-and-Build/checkout_links.json` if anything looks like it might
  have changed since this was generated.

## Full catalog at a glance

| # | Niche | Real product name |
|---|---|---|
| 1 | 01-1099-contractor/ | 1099 Contractor Business Intelligence System™ |
| 2 | 02-airbnb/ | Airbnb Business Intelligence System™ |
| 3 | 03-auto-repair/ | Auto Repair Shop Business Intelligence System™ |
| 4 | 04-cleaning-service/ | Cleaning Service Business Intelligence System™ |
| 5 | 05-construction/ | Construction Job Cost Business Intelligence System™ |
| 6 | 06-dental/ | Dental Practice Business Intelligence System™ |
| 7 | 07-digital-marketing-agency/ | Digital Marketing Agency Business Intelligence System™ |
| 8 | 08-ecommerce/ | Ecommerce Business Intelligence System™ |
| 9 | 09-electrical-contractor/ | Electrical Contractor Business Intelligence System™ |
| 10 | 10-hvac/ | HVAC Business Intelligence System™ |
| 11 | 11-pest-control/ | Pest Control Business Intelligence System™ |
| 12 | 12-landscaping/ | Landscaping Business Intelligence System™ |
| 13 | 13-lawn-care/ | Lawn Care Business Intelligence System™ |
| 14 | 14-manufacturing/ | Manufacturing Business Intelligence System™ |
| 15 | 15-plumbing-contractor/ | Plumbing Contractor Business Intelligence System™ |
| 16 | 16-property-management/ | Property Management Business Intelligence System™ |
| 17 | 17-rental-portfolio/ | Rental Property Management System™ |
| 18 | 18-restaurant/ | Restaurant Business Intelligence System™ |
| 19 | 19-roofing/ | Roofing Business Intelligence System™ |
| 20 | 20-small-business/ | Small Business Command Center™ |
| 21 | 21-trucking-owner-operator/ | Trucking Owner-Operator Business Management System™ |
