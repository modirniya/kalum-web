# SEO fix plan — kalum.app — 2026-09-19

> **STATUS 2026-09-19, end of day — 8 of 10 tasks SHIPPED and live**
> (`806093c` → `f4f7535`, six commits, Pages deploy verified against the live site).
>
> Done: 1 (privacy 404), 2 (snippets — 23 descriptions + 10 titles over budget → **0 of 61**),
> 3 (internal links — /es/how-it-works/ 1→9 inbound, Spanish corridors 2→9, Gulf pages 3-4→11-12,
> corridors 4-5→7), 4 (breadcrumbs on both hubs), 5 (validFrom no longer the build time;
> consecutive builds are byte-identical), 6 (typo-URL soft redirect), 7 (legal pages: h1 added,
> app schema and Smart App Banner dropped), 8 (/support/ 182→370 words with real answers).
>
> **Not done, deliberately — read the reason before picking these up:**
> * **9 (Arabic font preload)** — the preload fires only on `/ar/call-without-internet/` and
>   preloading the face that page paints with helps text LCP; removing it risks a FOUT on a
>   ranking page, and the keyless PageSpeed quota is exhausted so neither direction could be
>   measured. Get an API key, measure, then decide.
> * **10 (destination de-duplication)** — the honest version needs per-country facts the repo
>   does not hold (carriers, peak hours). The site's standing rule is verified claims only, and
>   region-generic filler would be worse than the duplication. This needs content input, not code.
> * **Owner item still open: Enforce HTTPS** in the GitHub Pages settings — no
>   `Strict-Transport-Security` header is served.
>
> New guard worth knowing: `BaseLayout` now warns at build time on any title >60 or description
> >155 (`npm run build 2>&1 | grep snippet`). Also note the audit's raw-HTML character counts
> were entity-inflated (`&mdash;` counts as 8); the build-time string length is the real measure.


> Handoff for the next AI session (Opus). Written by the session that ran the 2026-09-19 audit
> (Search Console API + full crawl). The audit report (Farsi) is
> https://claude.ai/code/artifact/9d063771-0514-499e-afa6-da75b1373f95 and the findings are
> summarised in memory `seo-audit-2026-09-19`. Everything below was verified against the repo at
> `main` = `806093c` and the live site on 2026-09-19. Line numbers are approximate; grep the
> quoted strings.

## Ground rules (do not skip)

- **Boundaries.** This is website work. No `fly`, `flyctl`, `psql`, no requests to
  `kalum-api.fly.dev` or staging, no store APIs. Public fetches of `kalum.app`,
  `legal.neuera.app` and Google APIs are fine. Search Console API access: service account
  `play-internal-uploader@kalum-app.iam.gserviceaccount.com` (key at
  `~/.config/kalum/play-service-account.json`), token code reusable from
  `mobile/store_metadata/gsc_locale_report.py`. PageSpeed API needs a free API key (the keyless
  quota is exhausted).
- **Bots and users must see identical HTML** (a past Google Ads cloaking flag). No UA/geo/device
  branching, ever.
- **Verified claims only.** No invented ratings, review counts, "best" claims. Rates come from
  `src/data/rates.json` / the live card.
- **Deploy = push to `main`** (`.github/workflows/deploy.yml` → Astro build → GitHub Pages →
  IndexNow). There is no staging. Run `npm run build` locally before every push; the build
  FAILS if `legal.neuera.app` is unreachable (by design) and falls back to the rates snapshot
  if the rate card is.
- **Canonical host** is apex `kalum.app` with trailing slashes. `/call-mexico/` stays noindex.
  `/privacy/` and `/terms/` stay out of the sitemap (their canonical is legal.neuera.app).
- Commit per task, small messages that say WHY, footer
  `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` (or the model you are). Do not
  rewrite unrelated files; `npm run build` output is the gate.
- Reports for the owner are written in Farsi (see memory `reports-in-farsi`); chat in English.

## Why these tasks, in one paragraph

Impressions tripled to ~2,900/week with mobile position ~7, but clicks stay at 15–25/week. Two of
the three causes are fixable in this repo today: (1) destination pages rank at position 8–9 for
informational "country code / phone number" queries and get 0 clicks, while the snippet hook that
would answer that query is cut off because 43/59 meta descriptions exceed ~155 chars; (2) the
Spanish and Gulf pages are under-linked internally. The third cause — 50% of clicks come from
countries that cannot sign up — is a business decision, not a task here. Technically the site is
already excellent; do not "improve" hreflang, canonicals, sitemap logic or the layout schema.

---

## Task 1 — Fix the only internal 404 (privacy archive link)   [HIGH, 15 min]

**Evidence.** `https://kalum.app/privacy/` contains `<a href="/kalum/privacy/archive.html">`
→ 404 on kalum.app. `src/lib/legal.ts` rewrites only `href="./archive.html"` (the
`archiveUrl` block near the end of `fetchLegal`). The live source at
`https://legal.neuera.app/kalum/privacy/` now emits a root-relative form as well. `/terms/`
happens to be fine today.

**Change.** In `src/lib/legal.ts`, after the existing `./archive.html` rewrite, add:

```ts
// legal.neuera.app also emits root-relative archive links; send them home too.
body = body.replace(
  /href="\/kalum\/(privacy|terms)\/archive\.html"/gi,
  (_m, doc) => `href="https://legal.neuera.app/kalum/${doc}/archive.html"`,
);
```
Keep the ORDER: the `/kalum/privacy/` → `/privacy/` rule above must not eat the archive URL
(that rule matches `href="/kalum/privacy/"` only — with the closing quote — so it is safe, but
verify with the build output).

**Verify.** `npm run build`; `grep -o 'href="[^"]*archive.html"' dist/privacy/index.html
dist/terms/index.html` → both absolute legal.neuera.app URLs; `curl -sI` each → 200.

## Task 2 — Snippets: descriptions ≤150, titles ≤60, country code + price first   [HIGH, 2–3 h]

**Evidence.** Descriptions >155 chars on 43/59 pages (worst: `/vi/call-without-internet/` 224,
`/tr/` 200, `/tl/` 199, `/call-india-from-uae/` 184, `/es/call-without-internet/` 183,
`/whatsapp-calls-blocked/` 182, most `/call/<slug>/` 156–174). Titles >60 on 10 pages (`/es/`
67, `/vi/` 66, `/hi/` 65, `/es/how-it-works/` 64, `/tl/` 64, `/tr/` 63, `/` 62,
`/call-without-internet/` 62, `/ur/` 61, `/es/call/el-salvador/` 61). The queries these pages
rank for at position 8–9 with 0 clicks are informational: "961 country code", "saudi number",
"sudan phone number", "numero de honduras", "how to call india from uae".

**Change 2a — destination template** `src/pages/call/[slug].astro` (`const description = priceLed
? …`). Rebuild the description so the first ~110 chars ANSWER the code/format question and the
price follows, total ≤150. Target shape (adjust to the data fields that exist: `d.dialCode`,
`d.numberFormat`, `rate`, `d.name`, `d.demonym`):

- price-led: `+{dialCode} {numberFormat}. Call {name} from {rate}/min — no app or internet on
  their end.`
- otherwise: `+{dialCode} {numberFormat}. Call any {demonym} landline or mobile — no app or
  internet on their end.`

`numberFormat` is a whole clause today; it may need a shorter variant per destination — check
`src/data/destinations.ts` (or wherever `numberFormat`/`dialingNote` live) and add a
`numberFormatShort` only if the long one cannot fit. Add a build-time guard in the template:
if `description.length > 155` or `title.length > 60`, `console.warn` with the slug (not throw),
so regressions surface in the build log.

**Change 2b — the 8 single-page locales** `src/pages/{es,ar,tr,hi,ur,bn,tl,vi}/call-without-internet.astro`
and their copy source (find where `title`/`description` come from — likely a copy object passed to
`NoInternetPage.astro`): trim each description to ≤150 chars in that language (keep the meaning:
"call without internet; the other side needs no app; from $X/min"), and drop the trailing
" | Kalum" from titles over 60 (brand is in the H1 and `og:site_name`). Do not machine-translate
new sentences; shorten the existing ones.

**Change 2c — hand-written pages:** `/`, `/es/`, `/es/how-it-works/`, `/call-without-internet/`,
`/call-india-from-uae/`, `/call-pakistan-from-uae/`, `/call-from-uae/`, `/whatsapp-calls-blocked/`,
`/calling-app-vs-internet-calling/`, `/call/` (`src/pages/call/index.astro`), `/es/call/*.astro`.
Same rules. For `/whatsapp-calls-blocked/` also make the title carry the commercial query it
already ranks for at position 4.8 with 0 clicks: "gulf calling app" — e.g. keep the WhatsApp
hook but end the title with "— Gulf Calling App" (≤60 chars).

**Verify.** Add a tiny script `scripts/check-snippets.mjs` that reads `dist/**/index.html`,
extracts `<title>` and `meta[name=description]`, and prints any page over 60/155 (exit 0; it is
a report, not a gate). Run it after the build and paste the residual list into the commit message.

## Task 3 — Internal links: Spanish nav/footer and the Gulf cluster   [MEDIUM, 45 min]

**Evidence.** `/es/how-it-works/` has exactly 1 inbound internal link; `/es/call/{colombia,
guatemala,honduras,el-salvador}/` have 2 each. `src/lib/chrome.ts` → `CHROME.es.nav` lists
only "Llamar a México" and "Llamar sin internet", `CHROME.es.productLinks` the same two.
`/call/bahrain/`, `/call/oman/`, `/call/kuwait/` have 3 inbound links, `/call/qatar/` 4, the
three corridors 4–5; `src/lib/corridors.ts` itself records that ≤4 inbound links meant
"never crawled". In `src/pages/call/[slug].astro` `getStaticPaths`, `others = [...sameRegion,
...topUp].slice(0, RELATED_LIMIT)` with `RELATED_LIMIT = 8` — the four small GCC pages fall off
the end for their own region-mates.

**Change.**
- `chrome.ts` `es.nav`: add `{ label: "Cómo funciona", href: "/es/how-it-works/" }` and
  `{ label: "Destinos", href: "/es/call/" }`. `es.productLinks`: add "Cómo funciona",
  "Todos los destinos", and the four corridors ("Llamar a Colombia" … `/es/call/colombia/` etc.).
- `[slug].astro` `getStaticPaths`: ensure every same-region sibling is included before topping
  up (for the Gulf region that is ≤7 pages, so `RELATED_LIMIT` can stay 8 if region-mates are
  never truncated: `const others = [...sameRegion, ...topUp.slice(0, Math.max(0, RELATED_LIMIT -
  sameRegion.length))]`). Check the region field values so "Gulf"/"Middle East" grouping is what
  you think it is.
- `src/pages/call/index.astro`: one short paragraph in the hub copy linking the three corridor
  pages (`/call-from-uae/`, `/call-india-from-uae/`, `/call-pakistan-from-uae/`).

**Verify.** After the build, count inbound links with a quick script over `dist` (href
occurrences per URL, excluding self and nav duplicates per page). Targets: `/es/how-it-works/`
≥ 10, each `/es/call/*` ≥ 8, each Gulf page ≥ 7, each corridor ≥ 7.

## Task 4 — Breadcrumbs on the two hubs   [MEDIUM, 20 min]

**Evidence.** BreadcrumbList is emitted by `src/components/Breadcrumb.astro` (visible nav +
JSON-LD from one items array) and used on destination pages and `NoInternetPage`. Missing on
`/call/`, `/how-it-works/` (also `/`, `/es/`, `/support/`, which is fine).

**Change.** Add `<Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Destinations" }]} />`
to `src/pages/call/index.astro` and `[{ name: "Home", href: "/" }, { name: "How it works" }]` to
`src/pages/how-it-works.astro`, inside the hero where the other pages place it; Spanish
equivalents on `/es/call/` and `/es/how-it-works/` (`Inicio` / `Destinos` / `Cómo funciona`).

**Verify.** `dist/call/index.html` contains one `BreadcrumbList` whose last item has no `item`
URL and whose first is `https://kalum.app/`.

## Task 5 — Stop the weekly schema churn (`validFrom`)   [LOW, 20 min]

**Evidence.** `Service.offers.priceSpecification.validFrom: card.fetchedAt` in
`src/pages/call/[slug].astro`, `call-india-from-uae.astro`, `call-pakistan-from-uae.astro`.
`card.fetchedAt` is the build time, so every Monday cron deploy changes it on 33 pages. The
sitemap deliberately takes `lastmod` from `src/data/rate-changes.json` (keyed by dial code,
value = date the rate last changed) to avoid exactly this.

**Change.** Use the same source: `validFrom: rateChanges[d.dialCode] ?? undefined` (import the
JSON the way `sitemap.xml.ts` does; omit the key when unknown rather than emitting the build
time).

**Verify.** Build twice a minute apart; `diff` the two `dist/call/india/index.html` → no change.

## Task 6 — Soft redirect for the typo'd URL   [LOW, 10 min]

**Evidence.** Search Console shows impressions for `https://kalum.app/call-pakistan-for-uae/`
(typo of `/call-pakistan-from-uae/`); it 404s; nothing in `src/`, `dist/` or the crawled pages
links to it, so the link is external. GitHub Pages cannot 301.

**Change.** Add `public/call-pakistan-for-uae/index.html`: a minimal HTML document with
`<meta http-equiv="refresh" content="0; url=https://kalum.app/call-pakistan-from-uae/">`,
`<link rel="canonical" href="https://kalum.app/call-pakistan-from-uae/">`,
`<meta name="robots" content="noindex">` and a visible link. Google treats an instant
meta-refresh as a redirect. Do NOT add it to the sitemap.

**Verify.** `curl -s https://kalum.app/call-pakistan-for-uae/` → 200 with the refresh meta
(after deploy).

## Task 7 — Legal pages: minimal layout + H1   [MEDIUM, 30 min]

**Evidence.** `/privacy/` and `/terms/` canonicalise to legal.neuera.app yet emit the full
Organization/WebSite/MobileApplication JSON-LD and the `apple-itunes-app` banner meta, and have
`h1_count = 0` (the fetched article uses its own heading levels).

**Change.** Add a `minimal?: boolean` prop to `src/layouts/BaseLayout.astro` that, when true,
omits the `apple-itunes-app` meta and the `MobileApplication` node (keep Organization/WebSite).
Pass it from `src/pages/privacy.astro` and `terms.astro`, and wrap the fetched article in
`<h1>Kalum Privacy Policy</h1>` / `<h1>Kalum Terms of Use</h1>` (or promote the article's first
heading — check `legal.ts` output for the existing `<h2>`). Keep the off-site canonical.

**Verify.** `dist/privacy/index.html`: exactly one `<h1>`, no `apple-itunes-app`, no
`"@type":"MobileApplication"`.

## Task 8 — `/support/` is thin   [MEDIUM, 30 min]

**Evidence.** 182 words, no H2, title "Support — Kalum" (15 chars), 49 inbound links (footer).

**Change.** Add an H2 "Before you write" with 4–5 short, TRUE answers drawn from existing pages
and CLAUDE.md facts (how credit works and that it never expires unless that is false — verify;
how to see a call's cost in the app; what to do if a call fails; how deletion works — Settings →
Delete Account; response time "usually within a day" already stated). Title →
"Kalum Support — Account, Calls and Billing Help" (≤60). Add `FAQPage` JSON-LD only if the
answers are literally on the page.

## Task 9 — Arabic font preload   [LOW, 30 min]

**Evidence.** `src/layouts/BaseLayout.astro` preloads
`noto-sans-arabic-arabic-wght-normal.woff2` (165,960 B) on `/ar/call-without-internet/`; the
Latin face is 27 KB. The preload is unconditional for the `ar` locale.

**Change.** Either drop the preload for Arabic and let `unicode-range` fetch on demand, or
subset the variable font (e.g. `pyftsubset` to the Arabic Presentation Forms + digits used).
Measure with PageSpeed (needs an API key) before and after on `/ar/call-without-internet/`.

## Task 10 — Destination-page differentiation   [MEDIUM, 2–4 h, start only if time remains]

**Evidence.** 5-gram Jaccard of main content: egypt/lebanon 0.52, es honduras/guatemala 0.56;
24/31 destination H1s are the same sentence with the demonym swapped. Word counts fine.

**Change (first pass).** In `[slug].astro`, vary the H1 by region or by the price-led flag, and
add ONE destination-specific paragraph per page sourced from data that already exists
(`dialingNote`, number format, the corridor notes, the featured status). Do not fabricate carrier
facts. If the destination data has no per-country field to draw on, write a 2–3 sentence
"What callers to {name} should know" block for the top-10 destinations by impressions only
(Lebanon, Jordan, Saudi Arabia, UAE, Egypt, Turkey, Sudan, Vietnam, Oman, Nepal) and leave the
rest templated.

---

## Owner-only items (cannot be done from the repo)

- **Enforce HTTPS in GitHub Pages settings** for `kalum.app` (no `Strict-Transport-Security`
  header is sent today). If it is already on, GitHub is not honouring it for the custom domain →
  support ticket.
- **Google Search Console:** nothing to submit; after the fixes deploy, request indexing for
  `/privacy/` and the 8 snippet-heavy pages via the URL Inspection UI to speed up re-crawl
  (API can inspect but not request indexing).
- **PageSpeed API key** (free, Google Cloud project `kalum-app`) so performance can be measured
  per page.
- **The strategic question** that no SEO task moves: 50% of organic clicks come from origins the
  app refuses at sign-up (Pakistan, Turkey, Lebanon, Central America). See memory
  `search-vs-production-2026-08-22` for the open Stripe "merchant of record" question.

## Verification at the end of the day

1. `npm run build` clean; `scripts/check-snippets.mjs` residual list ≤ 5 pages and none of the
   top-10 impression pages.
2. Push `main`; wait for the Pages deploy; re-run the crawl checks on the live site:
   `curl -sI` the privacy archive link (200), `/call-pakistan-for-uae/` (200 + refresh),
   `dist`-vs-live title/description spot checks on `/call/lebanon/`, `/call/saudi-arabia/`,
   `/whatsapp-calls-blocked/`, `/vi/call-without-internet/`.
3. Re-pull Search Console in ~3 weeks (the recipe in memory) and compare the position 4–10 CTR
   (baseline 0.9% on 3,057 impressions, 90d to 2026-09-17) and the per-page CTR of the seven
   0-click pages listed in the report §2.1.
4. Update memory `seo-audit-2026-09-19` with what shipped and the commit hashes, and
   `kalum-web-handoff` with anything structural you learned.
