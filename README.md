# SaaSGauge — Free SaaS metrics calculators & a board-ready Health Score

> **Concept (one line):** A free, fast, privacy-first suite of 22 SaaS metrics
> calculators plus a flagship "SaaS Health Score" report — monetised through
> templates (Pro Pack) and paid metrics reviews, **not advertising**.

SaaSGauge is an evergreen, search-driven online asset. Every calculator runs
client-side (nothing leaves the browser), each metric has its own SEO landing
page with sourced benchmarks and FAQ schema, and the whole thing deploys as a
static-first Next.js app to Vercel's free tier.

**Built with:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS
· dynamic OG images (`next/og`) · App-Router `sitemap.ts`/`robots.ts`.

---

## Why this, and why it isn't AI slop

- **Real utility, not word count.** 22 working calculators + a weighted Health
  Score that produces a printable report. The "content" is tools and decision
  scoring, not filler articles.
- **Accurate & sourced.** Margin-adjusted LTV, gross-profit CAC payback,
  annualised churn, Rule of 40, magic number, quick ratio — the rigorous
  versions, each with linked, real sources and benchmark caveats.
- **Buyers, not eyeballs.** SaaS operators buy templates and reviews. Revenue
  comes from a one-time **Pro Pack** and **paid metrics reviews**, with email
  capture feeding both. No display ads, by design.
- **Low maintenance.** Formulas and benchmarks are evergreen. The site is
  static; the only moving parts are two optional API routes (email + lead) that
  degrade gracefully when unconfigured.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — the app runs with everything unset
npm run dev                  # http://localhost:3000
```

Build / verify / run production:

```bash
npm run build      # type-checked production build (52 prerendered pages)
npm run typecheck  # tsc --noEmit
npm run test       # node:test unit tests for the metrics engine (zero deps)
npm run start      # serve the production build
```

The sellable **Pro Pack** assets live in `product/` (SaaS model CSV + formulas,
benchmark database, board / fundraising / Notion templates, printable cheat
sheet). Zip that folder and upload it to your checkout provider.

---

## Deploy (Vercel, ~5 minutes, free tier)

1. Import the repo at **vercel.com → Add New → Project**.
2. Framework preset auto-detects **Next.js**. No build settings needed.
3. Add env vars from the table below (all optional to start — set
   `NEXT_PUBLIC_SITE_URL` once you have a domain).
4. Deploy. Add your custom domain in **Project → Settings → Domains**.

Alternative hosts (Netlify, Cloudflare Pages, etc.) work too; this is a standard
Next.js app with two Node API routes and one edge route (`/og`).

After first deploy: register the domain in **Google Search Console** and submit
`https://yourdomain.com/sitemap.xml`; optionally set
`NEXT_PUBLIC_PLAUSIBLE_DOMAIN` or `NEXT_PUBLIC_GA_MEASUREMENT_ID` for analytics.

---

## Environment variables

Everything is optional; each integration degrades gracefully. See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO, sitemap, OG images |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Enables Plausible analytics |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Enables GA4 (alternative to Plausible) |
| `BUTTONDOWN_API_KEY` | Email list via Buttondown |
| `CONVERTKIT_API_KEY` / `CONVERTKIT_FORM_ID` | Email list via Kit/ConvertKit |
| `EMAIL_WEBHOOK_URL` | Generic email webhook (Zapier/Make/n8n) |
| `LEAD_WEBHOOK_URL` | Where the "metrics review" form posts |
| `RESEND_API_KEY` / `LEAD_NOTIFY_EMAIL` | Email lead notifications via Resend |
| `NEXT_PUBLIC_PRO_CHECKOUT_URL` | Pro Pack checkout (Gumroad/Lemon Squeezy/Stripe link) |
| `NEXT_PUBLIC_PRO_PRICE` | Display price for the Pro Pack |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public contact email |

**Email/lead behaviour:** with no provider set, `/api/subscribe` and `/api/lead`
validate input and return success (logging server-side) so the UX is testable.
Set a provider to actually deliver. The lead form includes a honeypot field.

---

## Monetisation (no ads)

1. **Pro Pack (digital product).** Board-ready report template, a SaaS model
   spreadsheet, a Notion dashboard, and an expanded benchmark database (see
   `product/`). Sell via Gumroad / Lemon Squeezy / a Stripe Payment Link — paste
   the URL into `NEXT_PUBLIC_PRO_CHECKOUT_URL` and the `/pricing` buttons go
   live. Until then, the page shows a **waitlist** email capture automatically.
2. **Paid metrics reviews (lead-gen / services).** The `/contact` form is a
   high-intent lead magnet for fractional-CFO-style reviews.
3. **Email list.** The cheat-sheet capture builds an owned audience.

---

## Content & SEO surface

- **22 calculator landing pages** (`/calculators/<slug>`), each with intro,
  formula, live tool, benchmarks, FAQ schema, related tools, sources, and a
  shareable-link button.
- **Flagship `/health-score`** — the shareable, printable hero asset.
- **`/benchmarks`** — a reference hub for every benchmark range.
- **6 guides** (`/guides/*`) — practical, tied to calculators.
- **Glossary** (`/glossary`) — 23 definitions with FAQ schema.
- **Cheat sheet** (`/cheat-sheet`) — print-to-PDF one-pager of every formula.
- **Resources** (`/resources`) — cheat-sheet lead magnet (email capture).
- **Legal** — terms, privacy, disclaimer, disclosure (templated; have counsel
  review). Disclaimers are deliberate: this avoids giving definitive advice.

Structured data: `Organization`, `WebSite`, `WebApplication`, `FAQPage`,
`BreadcrumbList`, `Article`, `ItemList`. Sitemap & robots are generated
automatically.

---

## Analytics events

Defined in `src/lib/analytics.ts` (fire to Plausible and/or GA4 if configured):
`calculator_used`, `health_score_run`, `email_submit`, `lead_submit`,
`pro_cta_click`, `report_print`, `share_click`.

**KPIs to watch first:** organic impressions/clicks (Search Console),
`calculator_used` & `health_score_run` rate, `email_submit` conversion,
`pro_cta_click` → purchase, `lead_submit` count.

---

## Growth plan

**30 days — index & instrument:** deploy, connect domain, submit sitemap to
Search Console + Bing, turn on analytics, ship the cheat-sheet, seed a few
relevant communities with the Health Score.

**90 days — compound content & launch Pro Pack:** add long-tail
calculators/guides (the registry in `src/lib/metrics.ts` makes a new calculator
~1 object), launch the Pro Pack on Gumroad, start light link-building.

**180 days — own the category:** publish an annual benchmark roundup, A/B test
CTAs and email copy, prune/merge thin pages, double down on what ranks.

---

## Project structure

```
src/
  app/                  # routes (App Router)
    calculators/[slug]  # 22 dynamic SEO calculator pages
    guides/[slug]       # guide articles
    health-score/       # flagship report tool
    benchmarks/         # benchmark reference hub
    cheat-sheet/        # printable one-pager
    api/{subscribe,lead}# graceful email + lead endpoints
    og/route.tsx        # dynamic OG image
    sitemap.ts robots.ts manifest.ts
  components/            # UI (Calculator, HealthScore, EmailCapture, …)
  lib/
    metrics.ts          # the engine: all formulas, benchmarks, FAQs, sources
    healthScore.ts guides.ts glossary.ts site.ts seo.ts analytics.ts env.ts
product/                # the sellable Pro Pack assets
tests/                  # zero-dependency node:test suite
```

**Add a calculator:** append one object to `METRICS` in `src/lib/metrics.ts`.
It automatically gets a page, sitemap entry, and structured data.

---

## Disclaimers

SaaSGauge provides educational tools and general benchmark context only — not
financial, investment, accounting, tax or legal advice. Benchmark figures are
drawn from public industry sources and vary by stage and segment. The legal
pages are general templates; review them with qualified counsel before launch.
