# Handoff Brief — Build-time "rates" SEO section on kalum-web

> **Authored by a prior AI session as a handoff.** You (the reader) are a fresh AI coding instance with zero prior context. This brief was assembled by an earlier agent that read all four repos on this machine, verified the backend router/controller/plug source, and empirically hit the live API. Everything you need to implement the feature without asking the user basics is below. Where a fact was verified against live code or a live HTTP request, it is marked **(verified)**. Paths are absolute. Today's date for staleness math: **2026-07-31**.
>
> **One honesty caveat about "verified":** the live `/api/voice/rates` JSON **body** could NOT be fetched — it returns 403 (App Check, see §5). So the response **shape** is verified from backend source (`voice_controller.ex`), but any specific sample rate values shown below are **illustrative** (drawn from the launch-pricing note), not scraped from a live response.

---

## 1. Purpose & the ask

**Goal statement:** Give Kalum's marketing site (`kalum.app`) per-country international-calling-rate pages plus a rates hub whose rate figures are **fetched at BUILD TIME from the backend's live dynamic-pricing data and baked into static HTML**, so the public pages rank for high-intent "cost to call {country}" queries and stay roughly in sync with what the app charges — without manual rate re-entry.

**The single most important rule (already decided, non-negotiable):** rates must be fetched at **build time** and rendered into static HTML, exactly like the existing `fetchLegal()` build-time fetch. **Never** fetch rates client-side with JS — Googlebot defers/throttles JS rendering and most AI/Bing crawlers don't execute JS at all, so a browser-injected rate is invisible to the crawlers this feature exists to serve. If the rate is not in `view-source:`, the feature has failed.

**Critical scoping reality — this is NOT greenfield.** kalum-web *already ships* a mature programmatic per-country system that is essentially "the rates section," just with hardcoded numbers. The real job is **~80% "stop the existing pages going stale / automate rate upkeep"** and **~20% "widen coverage"** — NOT building a parallel `/rates/` URL tree. See §4 and §6.

**You are NOT implementing yet if a prerequisite is unresolved.** There is a hard backend blocker (App Check) that gates the entire build-time-fetch approach. Resolve §5 and the §10 open questions **first**.

---

## 2. Project map (all local on this machine)

| Repo | Absolute path | What it is | How it deploys |
|---|---|---|---|
| **Marketing site** (THIS is where you build) | `/Users/parham.mn/StudioProjects/KALUM/kalum-web` | Astro 5 static site generator (SSG), Tailwind v4 via `@tailwindcss/vite`, TypeScript. No React/islands — `.astro` files render to pure static HTML at build. | GitHub Pages via `.github/workflows/deploy.yml` (`withastro/action@v3`, ubuntu runner, node 20). Triggers: push to `main`, `workflow_dispatch`, **weekly cron `0 3 * * 1` (Mon 03:00 UTC)**. Site host `https://kalum.app` (apex). |
| **Backend** (owns the rate data) | `/Users/parham.mn/StudioProjects/KALUM/kalum-backend` | Phoenix/Elixir API at `https://kalum-api.fly.dev`. Serves the rate card at `GET /api/voice/rates`. Runs on Fly. Has Oban for cron jobs. | Fly deploy. Prod pins App Check to real mode (see §5). |
| **Mobile app** (authoritative product facts) | `/Users/parham.mn/StudioProjects/KALUM/mobile` | Flutter iOS+Android client — the actual product. Its `CLAUDE.md` is the source of truth for product/pricing/positioning facts. | App Store / Play. Not touched by this feature. |
| **Legal site** (the build-time-fetch precedent) | `/Users/parham.mn/StudioProjects/neuera-legal` | Static HTML at `legal.neuera.app`. Holds Terms/Privacy (Kalum's live at `neuera-legal/kalum/terms/index.html`). | Static hosting. kalum-web fetches Terms/Privacy from it **at build time** via `src/lib/legal.ts` `fetchLegal()` — **this is your architectural template.** |

---

## 3. Product, positioning & pricing facts

**Kalum** is a strict-**prepaid VoIP international calling service**. **Entity-name nuance (all three forms verified live, so don't guess):** the Kalum Terms operator clause reads *"operated by **NeuEra Apps**"* (`neuera-legal/kalum/terms/index.html`); the legal-site copyright footer reads *"© 2026 **NeuEra Apps LLC**. All rights reserved."*; and the **kalum-web** site footer (`src/components/Footer.astro`) currently renders *"© {year} **Neuera** · Kalum is a product of Neuera."* There is **no "Parham Modirniya"** string anywhere in either repo (an earlier draft claimed the footer credited him — it does not). On new public marketing pages, **match the string the surrounding kalum-web chrome already uses — the Footer's "Neuera"** — rather than introducing a new variant; reserve "NeuEra Apps LLC" for legal/copyright contexts. Do not invent an entity name.

Users in ~46 origin countries place **outbound** voice calls to landlines and mobiles in ~200 destination countries over WiFi/data, routed to the real PSTN via Twilio. The person called needs **no app, no smartphone, no internet** — their phone rings like any normal call.

**Positioning — GENERAL provider, NOT MENA/diaspora-first.** As of 2026-07-23 Kalum is deliberately positioned as a general international-calling provider for anyone in a supported origin country. Consequence for the site: **the rates hub must not lead with a favored region** (no "Call the Middle East" hero, no priority corridor). Group/order destinations neutrally; make **search/browse** the way users find a country. (The current hub `/call/index.astro` is already neutral — H1 "Cheap international calls, by destination." — keep it that way.)

**Two separate country lists — rate pages are DESTINATIONS.** The app keeps two lists (`mobile/lib/core/models/country.dart`): `supportedCountries` (~46 **origin** signup countries, Stripe-constrained) and `callableCountries` (200+ **destination** countries). **Rate pages are driven off destinations / the rate feed, NEVER off the ~46 origins.**

- ⚠️ **Do NOT generate rate pages for Syria, Iran, or Cuba.** They are sanctioned exclusions removed from `callableCountries` (Twilio rejects them). A public rate/availability page for a sanctioned destination is a compliance risk, not just dead content.
- ⚠️ **US/Canada are one merged app entry** (`code: 'US_CA'`, `dialCode: '+1'`), but the backend rate feed may key them separately. "One app entry" ≠ "one rate page" — decide the +1 mapping explicitly. The site currently has **no +1 destinations at all.**

**Pricing model:**
- Credit sold in **three prepaid packs, identical on iOS and Android: $4.99 / $9.99 / $24.99.** Credit is **1:1 with dollars paid** (a $4.99 purchase = $4.99 credit). **No bonus tiers, no separate "credit" unit, no free or trial credit** — the $4.99 pack is the entry point. **Credit never expires.** Balance is shown as a plain USD figure. (Android billed via Stripe; iOS via Apple IAP.) Marketing copy must not imply a free tier, promo, or bonus.
- **Dynamic cost-plus per-minute rates** are LIVE in prod: rates vary by destination and **change over time** as carrier costs move. Live examples from the launch note: US ~$0.03, Germany ~$0.06, India ~$0.09, Mexico ~$0.04; some remote corridors exceed **$3/min**. (Note: `destinations.ts` currently hardcodes *stale* figures — e.g. India 5¢, Mexico 6¢ — which is exactly the drift this feature fixes.) **The rate shown before dialing is the rate billed** — no separate "real" price. Any static snapshot **drifts** and must be framed as indicative + timestamped (see §8 legal hedge).

---

## 4. kalum-web architecture + the existing per-country pages + SEO roadmap

The programmatic per-country system **already exists** — study it; you are extending it, not replacing it.

**Key files (all under `/Users/parham.mn/StudioProjects/KALUM/kalum-web`):**

- **`src/lib/destinations.ts`** — single data source. Exports `destinations: Destination[]` (**31 curated countries** — verified: 31 `slug:` entries). Each row is a hand-written object: `slug`, `region` (`"Americas" | "Middle East" | "Africa" | "Asia"` — that union order), `name`, `demonym`, `dialCode` (string, no `+`, e.g. `"52"`), **`rateCents` (integer US cents — HARDCODED; field comment: "copied from the live rate table")**, `intro` (marketing prose), `dialingNote` (per-country numbering-plan facts), optional `voipRestricted`. Also exports:
  - `RATES_AS_OF = "March 23, 2026"` and `RATES_AS_OF_ES = "23 de marzo de 2026"` — **manually stamped, currently ~4 months stale (verified).**
  - `rateLabel(d)` (verified): renders `< 100¢` as `"6¢"`, `≥ 100¢` as `"$1.10"` (`(cents/100).toFixed(2)`).
  - `nameAtSentenceStart`, `featuredSlugs`/`featuredDestinations()`, `voipRestrictedDestinations()`.
- **`src/pages/call/[slug].astro`** — `getStaticPaths()` maps every `Destination` → `/call/{slug}/`. Renders (verified): title `Call {name} — {rate}/min to Any Phone | Kalum`, meta description with the rate, an H1, a "How to call" block, a **6-question FAQ** (Q1 is literally *"How much does it cost to call {name} with Kalum?"*), an "other destinations" cross-link cloud, and a JSON-LD `@graph` with `BreadcrumbList` + `FAQPage`. **The rate figure (`rateLabel(d)`) + `RATES_AS_OF` are threaded through the title, meta, H1, every FAQ answer, and a `rateNote`** that already says *"The app always shows the current rate before you dial."*
- **`src/pages/call/index.astro`** — this is ALREADY the rates hub (verified). BaseLayout title `International Calling Rates by Country — from {minRate}¢/min | Kalum` where `minRate = Math.min(...destinations.map(d => d.rateCents))` (self-updating). Groups destinations by a **fixed region display order `["Americas","Middle East","Asia","Africa"]`** (a grouping order, not a MENA-first hero — neutral H1 "Cheap international calls, by destination."). Copy already concedes the app shows "live rates for 180+ countries before you dial."
- **`src/pages/sitemap.xml.ts`** — hand-maintained page list + `...destinations.map(d => ({ path: \`/call/${d.slug}/\`, lastmod: SEO_CONTENT_UPDATE }))`. `lastmod` is a **manual constant `SEO_CONTENT_UPDATE = "2026-07-20"`, deliberately NOT the build date** (verified) so the weekly cron redeploy doesn't cry-wolf "updated!" on every page.
- **`src/lib/legal.ts` → `fetchLegal(url)`** — THE build-time-fetch precedent (verified). Runs at build in Node during `astro build` on the GitHub runner; plain `fetch()` of `legal.neuera.app` (with `User-Agent: "kalum-web build"`); extracts the `<article class="legal-document current-document">` wrapper, strips inline `<script>`/`on*` handlers, rewrites cross-links; **returns `{ body, fetchedAt: new Date().toISOString() }`**. **Fails CLOSED:** any non-2xx or missing article `throw`s so the build aborts "loudly rather than shipping an empty or stale page."
- **`.github/workflows/deploy.yml`** — build+deploy (`withastro/action@v3`, node 20; separate `deploy` job via `actions/deploy-pages@v4`). The **weekly cron exists specifically to keep build-time-fetched (legal) data fresh** ("keeps /privacy and /terms within ~7 days of the legal.neuera.app source"). After deploy, an **IndexNow** ping submits sitemap URLs to Bing/Yandex — but it is **skipped on the cron** (`if: github.event_name != 'schedule'`, comment "nothing changes there"), `continue-on-error: true`. (verified)
- **`astro.config.mjs`** (verified): `site: 'https://kalum.app'`, **`trailingSlash: 'always'`**. Every emitted URL is apex + trailing slash.
- **`src/lib/i18n.ts`** — `alternatesFor()` builds bidirectional hreflang + x-default (only for the three EN↔ES pairs in `localizedPairs`, which include `/call/mexico/ ↔ /es/call/mexico/`); sitemap emits `xhtml:link` alternates.
- **Spanish `/es/` subtree** (verified: `src/pages/es/index.astro`, `src/pages/es/call/mexico.astro`, `src/pages/es/call-without-internet.astro`). It is tiny and **hand-authored — it does NOT share the destinations render pipeline.** `es/call/mexico.astro` single-sources the rate via `rateLabel(d)` from `destinations.ts` but hand-writes Spanish prose (incl. the spelled-out "los mismos seis centavos por minuto") and uses a parallel `RATES_AS_OF_ES`.

**Existing SEO roadmap constraints** (`docs/visibility-roadmap.md`, `docs/owner-todo.md` — both exist, verified): all phases shipped; GitHub Pages static-only (no server logic/headers/geo/UA behavior — reinforces build-time baking); **bots and users must see identical content** (cloaking is a hard no — another reason client-side rate JS is disallowed); **verified claims only**; the roadmap **explicitly rejects duplicate URL trees** (`visibility-roadmap.md:296` verbatim: *"Separate `/how-to-call-X/` pages — would cannibalize `/call/X/`."*). A brand-new `/rates/{country}/` tree would cannibalize `/call/{slug}/` — **do not build one.**

**The drift problem this feature fixes:** `rateCents` is hand-copied from the admin panel and `RATES_AS_OF` is hand-stamped (now ~4 months old), while the app runs dynamic pricing that changes ~daily. The site's static cents are guaranteed to diverge from the app.

---

## 5. ⚠️⚠️ GATING BLOCKER — Backend rates API contract AND the App Check gotcha

> **READ THIS BEFORE WRITING ANY CODE. This gates the entire approach.** A GitHub Actions build **cannot** simply `fetch('https://kalum-api.fly.dev/api/voice/rates')` — it will get a **403**. A backend change (or an App-Check token minted in CI) is a **prerequisite** to any web work.

### 5.1 The empirical proof (verified 2026-07-31, live prod — re-confirmed twice this review)

```
$ curl -s -o /dev/null -w "%{http_code}" https://kalum-api.fly.dev/api/voice/rates
403
$ curl -s https://kalum-api.fly.dev/api/voice/rates
{"error":"app_check_required"}
```

### 5.2 Why it blocks (mechanism, all verified in source)

- **Router** (`kalum-backend/lib/kalum_web/router.ex`, the "Public rate card — deliberately unauthenticated" scope, **line 161**): both `/voice/rates` (line 163) and `/voice/quote` (line 168) are `pipe_through [:api, :maintenance_gate, :app_check, :rate_limit_public_rates]`. The route comment confirms the data is intentionally public marketing info: *"Still gated by App Check (genuine app instances only) + a per-IP flood limit."*
- **`:app_check`** pipeline (router line 107) = `plug KalumWeb.Plugs.VerifyAppCheck`.
- **`VerifyAppCheck`** (`lib/kalum_web/plugs/verify_app_check.ex`): in **placeholder mode** (dev/test) it passes everything through; in **real mode** it reads header `x-firebase-appcheck` — **nil or empty → `send_resp(403, {"error":"app_check_required"})` + `halt()`**; present-but-invalid → `403 {"error":"app_check_failed"}`. (verified line-by-line)
- **Production is hard-pinned to real mode with no escape hatch:** `config/prod.exs` line 16 sets `app_check_mode: :real`, and `config/runtime.exs` **line 238** **raises on boot** if `APP_CHECK_MODE=placeholder` is set in prod (*"APP_CHECK_MODE=placeholder is forbidden in production. This would disable App Check verification."*). Verification (`lib/kalum/auth/firebase_app_check.ex`) is a full RS256 JWT check against Firebase's JWKS (`https://firebaseappcheck.googleapis.com/v1beta/jwks`) with issuer (project-id **or** project-number) and audience (`projects/<project_id>`) validation. **There is no static bypass token, no CI allowlist, no IP exemption, no debug backdoor in the plug** — it fully delegates to Firebase.

A CI build is not a genuine app instance, so App Check is *designed* to reject it. **A `fetchLegal`-style fail-closed helper pointed at this URL would 403 and abort every marketing deploy.**

### 5.3 The API contract — `GET /api/voice/rates` (shape verified against `voice_controller.ex`)

| Property | Value |
|---|---|
| Method / Path | `GET https://kalum-api.fly.dev/api/voice/rates` |
| Auth | **None** (no Bearer needed — it's deliberately unauthenticated; a Bearer token is simply ignored). App Check is the ONLY blocker — don't waste time trying to authenticate. |
| Query params | none |
| Blocker | `X-Firebase-AppCheck` header required in prod, else **403** (see above). |
| Rate limit | Per-IP (keyed on `Fly-Client-IP`, un-spoofable, falls back to `remote_ip`): **120 req/min** (`public_rates`). 429 `{"error":"rate_limit_exceeded","retry_after":<seconds>}` + `retry-after` header on breach. Far above a build's needs. |
| Maintenance | Also behind `:maintenance_gate` → **503 `{"error":"maintenance"}`** if admin toggled maintenance. Build must tolerate. |
| Cache-Control | `public, max-age=900` when `basis="from"`; `public, max-age=3600` when `basis="flat"`. |

**Response body** — the **field structure** is verified against `voice_controller.ex`; the two sample rows below are **illustrative** (their specific values come from the launch-pricing note — the live body sits behind the 403 and was NOT fetched during this review):
```json
{
  "rates": [
    { "country_code": "91", "country_name": "India",  "rate_per_minute": "0.09" },
    { "country_code": "52", "country_name": "Mexico", "rate_per_minute": "0.04" }
  ],
  "basis": "from"
}
```
One request returns **all rows** — the whole rate table (~218 destinations, per the backend's own rate-limiter comment "ETS-cached reference data (218 rows)"). Field semantics — read carefully, three traps:

1. ⚠️ **`country_code` is the E.164 DIAL CODE as a string** (`"91"`=India, `"52"`=Mexico, `"1"`=US/Canada, `"880"`=Bangladesh), **NOT ISO alpha-2**. It matches `Destination.dialCode`. So the join for the curated 31 is `destination.dialCode === row.country_code`. **Do NOT derive slugs or flag emoji from `country_code`** — dial codes aren't 1:1 with countries (`+1` = US/Canada/NANP, `+7` = Russia/Kazakhstan). Slug/display from `country_name` (or the curated `Destination`). If you ever add `+1` countries, you need longest-dial-code-first matching (mirrors the app's `phone_utils`).
2. ⚠️ **`rate_per_minute` is a decimal serialized as a STRING** (`"0.06"`, via `Decimal.to_string`), USD dollars per minute — NOT a JSON number. Convert to the site's `rateCents` with `Math.round(parseFloat(x) * 100)`.
3. ⚠️ **`basis` is expected `"from"` in prod today** (dynamic pricing live) — each row is the country's **cheapest prefix**, mobile ≠ landline. `basis` flips to `"flat"` only if pricing goes static. The backend controller doc explicitly warns: rendering a `"from"` figure as a flat rate *"would let the card contradict `GET /api/voice/quote`, which is exactly the trust failure prefix pricing exists to remove."* **This collides with the site's "one flat rate, landlines and mobiles alike" copy — see §8.**

`GET /api/voice/quote?to=<E.164>` exists but is **App-Check-gated AND needs a live per-number lookup (infinite input space) — NOT suitable for build-time static pages.** Use `/rates` only.

### 5.4 Ranked mitigations (evaluate; a recommendation follows)

**A. (RECOMMENDED) Backend: carve `GET /api/voice/rates` out of `:app_check` — OR add a twin public endpoint.** Either drop `:app_check` from the existing public-rates scope, or add e.g. `GET /api/public/rates` piped `[:api, :maintenance_gate, :rate_limit_public_rates]` reusing `VoiceController.rates/2` + `Telephony.list_effective_rates/0` verbatim. ~5–10 lines in `router.ex`. No new infra, no CI secrets, no token expiry, single source of truth, same JSON shape/cache headers, per-IP flood limit stays. The data is already public marketing info by the backend's own router comment. **This is the smallest clean unblock and the recommended prerequisite.** It's a backend PR, not a web-repo change — get it merged/deployed first.

**B. (Most build-robust) Backend Oban cron publishes a static `rates.json` snapshot** to a public path/object store on a schedule; the site reads that flat file at build. Fully decouples the build from live-API availability/maintenance. More infra than A — pick if you want builds to never depend on the API being up.

**C. Committed snapshot in kalum-web, refreshed by a credentialed scheduled Action** that writes `src/data/rates.json` and commits it; SSG reads the committed file. Robust/offline builds, but the refresh job still needs a working fetch path → depends on A or D existing (chicken-and-egg alone). (Note: `src/data/` does not exist yet — you'd create it.)

**D. (LAST RESORT) Mint a Firebase App Check debug token in CI.** Register a debug token, have CI exchange it via Firebase's `exchangeDebugToken` REST for a short-lived (~1h) real JWT, send as `X-Firebase-AppCheck`. No backend change, but fragile: short-lived token, project-number + debug secret in CI secrets, semantically abuses debug tokens, breaks silently on rotation, and the backend's custom JWKS verification must be validated end-to-end first. Use only if a backend change is truly impossible.

**Recommended path: A** (backend un-gate / twin endpoint) **+ fail-open to a committed snapshot** (see §8). Regardless of option, the build must fall back to a committed last-good `rates.json` on any non-200 (403/429/503/network) so a deploy never ships missing prices.

### 5.5 How the numbers are derived (`kalum-backend/lib/kalum/telephony.ex` `list_effective_rates/0`, verified)

Reads the rate table (`list_rates/0`, one row per destination, `country_code` unique string) and branches on `DynamicPricing.mode()`: **`:dynamic` (LIVE in prod)** → prices each country's cheapest prefix from the cost deck (`CostDeck.country_minimums/1` + `DynamicPricing.price_from_cost/1`), returns `basis = :from`; **countries with no deck coverage fall back to their static table rate** (the `:error` branch keeps the original row → the card is always complete). **static mode** → flat table rates, `basis = :flat`. The deck refreshes ~daily and the table changes monthly at most, so a build-time snapshot refreshed each deploy stays "roughly in sync" — exactly the feature's goal.

---

## 6. SEO strategy for the rates section

**The win is 80% "keep existing high-quality pages fresh + scale without manual rate upkeep," 20% "new pages." The risk is over-building thin pages and forking a redundant `/rates/` tree.**

- **Reuse `/call/[slug]/` and `/call/` — do NOT mint `/rates/[slug]/`.** `/call/[slug]/` already targets both "call X" and "X rate" intent in one URL; `/call/index.astro` already owns "international calling rates by country." A second URL for the same country+rate = keyword cannibalization + doorway duplication = **Scaled-Content-Abuse** exposure (Google's Aug & Dec 2025 SpamBrain enforcement targets "keyword-swap variations of the same page"). If a distinct rate-table view is wanted, make it a **single** enriched hub, not N duplicate detail pages.
- **Query clusters per country X** (all destination-templated, bottom-funnel, high commercial intent): `call {X} rate` / `{X} calling rates` (head term, already in title); `how much does it cost to call {X}` (already a verbatim FAQ Q1 — feeds AI Overviews/featured snippets, which reward a direct one-sentence answer containing the number); `cheapest way to call {X}` (Kalum's "no app on their end" + single landline/mobile rate is a genuine differentiator); `cost to call {X} from {origin}` / `call {X} from iphone/android`. Competitors (Boss Revolution `/en-us/country/…` + `/rates`, Rebtel `/en/rates/`, KeepCalling `/international-calls/…`) validate the structure — Kalum's edge is pages that read like pages for a person (dialing notes, local-context hooks), which post-2025 Google rewards.
- **Anti-thin-content rules (existential here):** (1) **Keep the hand-authored `intro` + `dialingNote` per country** — the country-specific numbering-plan facts are the genuine per-page value; when you switch the *rate* to build-time fetch, do NOT template the intro/dialingNote too. (2) **Do NOT auto-explode to all ~200 destinations with templated "Call {name} for {rate}/min" copy.** Tier by search volume; hand-author intro+dialingNote for high-value corridors; let the honest "the app shows live rates for 180+ countries" claim cover the long tail without minting a thin page each. A page is "substantive enough to publish" only if it has: unique intro, country-specific dialing note, live rate, FAQ block, and ≥1 local hook. Otherwise it belongs in the hub table, not its own URL.
- **Schema — do it, but calibrate:** keep the existing `FAQPage` JSON-LD (helps AI Overviews / snippet extraction) but **don't expect the accordion rich result** — Google restricted FAQ rich results to gov/health domains in Aug 2023. **`Offer`/`PriceSpecification` will NOT produce a pricing rich snippet** (those are for `Product`/shopping SKUs, not a per-minute service rate); add it only as semantic hygiene for AI answer engines, shaped as a `Service`/`Offer → priceSpecification` `UnitPriceSpecification` (`price`, `priceCurrency:"USD"`, `referenceQuantity` 1 `MIN`). **Keep it distinct from the site-wide `MobileApplication` schema in `BaseLayout.astro` which declares `Offer.price:"0"`** (the app is free to download) so the two prices don't conflate. Validate any new JSON-LD with Google's Rich Results Test + schema.org validator; claim only what's verifiable.
- **Freshness signals:** replace `RATES_AS_OF`/`RATES_AS_OF_ES` with the fetch `fetchedAt` (like `fetchLegal`) so "Rate as of…" can never drift; ride the existing weekly cron for auto-refresh (free); but bump sitemap `lastmod` and ping IndexNow **only when a rate actually changed** (see §8). Reinforces the general-provider positioning: a broad neutral hub covering Mexico, India, the Philippines, Germany, Nigeria etc. signals "we serve everyone," not diaspora-first.

---

## 7. Concrete step-by-step implementation plan (Astro-specific, references real files)

> Do NOT start steps 3+ until the §5 App Check prerequisite is resolved (step 0/1).

0. **Resolve the App Check blocker FIRST (§5.4).** Get the backend change deployed (recommended: mitigation A — un-gate `GET /api/voice/rates` or add `GET /api/public/rates`). Re-run the `curl` from §5.1 against the chosen URL and confirm a **200 with the JSON body** from an un-App-Checked client before proceeding. This is a hard gate.

1. **Confirm the reachable URL + shape.** Note the exact path build will fetch (the un-gated one) and verify the response `{rates:[{country_code,country_name,rate_per_minute}], basis}` for real (this review only ever saw the 403).

2. **Create `src/lib/rates.ts`** mirroring `src/lib/legal.ts`:
   - `export async function fetchRates(url): Promise<{ rates: RateRow[]; basis: "from"|"flat"; fetchedAt: string }>`.
   - `RateRow = { dialCode: string; name: string; rateCents: number }` where `rateCents = Math.round(parseFloat(row.rate_per_minute) * 100)` and `dialCode = row.country_code`.
   - Include a `rateCentsForDialCode(rates, dialCode): number | null` helper (exact match on the curated dialCodes; return `null` on miss — see §8 match-failure rule).
   - **Fail-open (differs from `fetchLegal`, which fails closed):** on any non-200/parse error, log a warning and return the **committed last-good snapshot** (`src/data/rates.json`) so a backend hiccup or a residual 403 doesn't kill the marketing deploy. Only fail the build if there is neither a live response nor a snapshot.

3. **Commit a fallback snapshot `src/data/rates.json`** (the current live response once reachable; `src/data/` doesn't exist yet — create it). This doubles as the delta source for `lastmod`/IndexNow (§8).

4. **Wire live rates into `src/lib/destinations.ts` consumption.** Cleanest: keep `destinations.ts` as the curated list (slug/region/name/demonym/dialCode/intro/dialingNote) but **drop the hardcoded `rateCents` as the source of truth** — resolve each destination's rate at build from `fetchRates()` by `dialCode`, falling back to the committed snapshot, and only then to any baked-in default. Because `destinations.ts` is plain data (not async), do the merge in a small build helper (e.g. `getDestinationsWithLiveRates()` in `rates.ts`) that the `.astro` pages call in frontmatter, OR fetch in each page's frontmatter and pass through. Keep `rateLabel()` (verified: `≥100¢ → "$1.10"`, else `"6¢"`) as the renderer.

5. **Update `src/pages/call/[slug].astro`:** replace `RATES_AS_OF` usage with `fetchedAt`-derived date; if `basis === "from"`, switch the price phrasing to **"from {rate}/min"** in title/H1/meta/FAQ/`rateNote` and adjust the "landlines and mobiles, one rate" assertions (§8). Handle a `null` rate (no matching feed row) by falling back to the snapshot value or omitting the page — never render `undefined`/`$0.00`.

6. **Update `src/pages/call/index.astro`:** `minRate` already self-derives from the data — it will pick up live rates automatically. If `basis === "from"`, adjust the "from {minRate}¢/min" hub title/copy accordingly (title already reads "from" — good). Keep the neutral, non-MENA-first grouping.

7. **Grep for spelled-out figures in prose that a data swap won't fix** (§8): Mexico `intro` "same six cents a minute" in `destinations.ts` and "los mismos seis centavos por minuto" in `src/pages/es/call/mexico.astro`. Either drop the baked figure or regenerate that prose. Handle `RATES_AS_OF_ES` locale date from `fetchedAt`.

8. **Sitemap `lastmod` delta (`src/pages/sitemap.xml.ts`):** keep the manual-constant behavior for unchanged pages; for each `/call/{slug}/` whose rate changed vs the committed snapshot, bump its `lastmod` to the build date. (The committed snapshot from step 3 gives you the diff for free.)

9. **`.github/workflows/deploy.yml`:** the weekly cron already refreshes build-time data — rates ride it for free. **Re-gate the IndexNow step:** change `if: github.event_name != 'schedule'` so IndexNow fires when **a rate actually changed this build** (even on cron), while quiet weeks stay silent. If mitigation C (a separate scheduled commit job) is chosen, add that workflow and have it commit `src/data/rates.json`. (Also note: the build step uses `withastro/action@v3`; if the fetch URL/secret needs to be an env var, wire it into that step's `env:`/`with:`.)

10. **`/es/` scope decision:** `src/pages/es/call/mexico.astro` is hand-authored and off-pipeline. Decide whether live rates extend to `/es/` now (touch that file directly + `RATES_AS_OF_ES`) or defer. Keep EN/ES dates in sync either way.

11. **Verify build-time baking:** run `astro build`, open the built `/call/{slug}/index.html`, and confirm the rate is literal text in `view-source` (not JS-injected). Validate JSON-LD. Confirm every new/changed URL is apex + trailing slash and registered in the sitemap (and hreflang alternates if localized).

---

## 8. Gotchas & constraints checklist (consolidated)

- ⚠️ **App Check 403 gates everything (§5).** Resolve before any web code. No static bypass exists in prod.
- ⚠️ **`basis:"from"` vs the "flat rate" promise — the #1 content-accuracy trap.** Prod returns cheapest-prefix "from" figures (mobile ≠ landline), but every destination page asserts "one rate, landlines and mobiles alike." Switch to "from {rate}/min" phrasing and rewrite the flat-rate FAQ/`intro` prose when `basis === "from"`. The backend explicitly calls the naive wiring a trust failure.
- **Legal "indicative rates" hedge (required on every rate page + hub).** Public rates must be **indicative**; the in-app rate is authoritative. The governing Terms clause for *call rates* is **§5.3** (verified verbatim: *"The rate shown in the app at the moment you start a call is the rate that will be applied to that call."*) — cite §5.3, **NOT §5.2** (§5.2's *"The price displayed in-app at the moment of purchase is authoritative"* governs the **pack price**, not the per-minute rate). Add a banner like: *"Indicative rates in USD, updated {fetchedAt date}. Rates vary by destination and can change; the price shown in the Kalum app before you dial is the rate you pay. See Terms §5 for billing details."* Don't restate billing partially — billing is per-minute **rounded up to the next whole minute**, 1-minute minimum, **all attempts billed** (incl. unanswered/busy/failed), **$0.50/min fallback** for unlisted destinations, **minimum balance 1.5× the per-minute rate** to start a call (Terms §5.4/§5.5, verified) — link, don't paraphrase.
- **Rate figures baked in prose won't update from a data swap.** Grep spelled-out numbers before wiring: Mexico "same six cents a minute" (`destinations.ts`) + "los mismos seis centavos por minuto" (`es/call/mexico.astro`).
- **Trailing-slash + apex routing.** `trailingSlash: 'always'`, `site: 'https://kalum.app'`. Every URL must be `https://kalum.app/.../`.
- **Spanish `/es/` pages are hand-authored, off-pipeline.** Extending live rates there = editing those files (or building the deferred per-locale table). Keep `RATES_AS_OF_ES` in sync.
- **Deploy order.** Backend un-gate (or snapshot publisher) must ship **before** the web build tries to fetch, or the first build fails/falls back to snapshot.
- **Freshness cron.** Weekly `0 3 * * 1` already refreshes build-time data — rates piggyback for free. But **IndexNow is skipped on cron** (`if: github.event_name != 'schedule'`) — re-gate it on "did a rate change?" so genuinely-changed pages get re-crawled.
- **`RATES_AS_OF` / `RATES_AS_OF_ES` → derive from `fetchedAt`** (EN + ES formatting), like `fetchLegal`'s return. Currently ~4 months stale.
- **Sitemap `lastmod` is intentionally manual, not build date.** Bump only for slugs whose rate actually moved (committed snapshot = the diff).
- **Fail-open, not fail-closed, for rates** (opposite of `fetchLegal`). Commit a last-good snapshot; on any non-200 use it, don't abort the whole marketing deploy.
- **Match failures.** A curated `dialCode` with no matching `country_code` row → fall back to snapshot or omit the page; never render `undefined`/`$0.00`.
- **`country_code` is a dial code, not ISO.** Don't derive slugs/flags from it. `+1` = US/Canada/NANP (`"1787"` = Puerto Rico shares the space) — needs longest-match if you add +1 countries. Site currently has zero +1 destinations.
- **`rate_per_minute` is a string in dollars.** `Math.round(parseFloat*100)` → cents.
- **Sanctioned exclusions.** No pages for Syria/Iran/Cuba (compliance, not just 404).
- **High-rate rendering / marketability.** Live rates include corridors >$3/min. `rateLabel` already handles ≥$1 ("$1.10"). If you ever auto-generate from the full table, filter/handle high rates and unmarketable corridors.
- **No free/trial credit; 1:1 credit; three packs $4.99/$9.99/$24.99.** Copy must not imply a free tier, promo, or bonus.
- **Bots and users must see identical content** (cloaking = hard no) — another reason client-side rate JS is disallowed.
- **Global crawlability ≠ global signup.** A visitor in a non-supported origin can view rates but cannot subscribe; don't imply anyone anywhere can become a customer.
- **Entity name (all forms verified live).** kalum-web's own footer (`src/components/Footer.astro`) renders **"Neuera"** ("Kalum is a product of Neuera"); the Kalum Terms say Kalum is **"operated by NeuEra Apps"**; the legal-site copyright line says **"NeuEra Apps LLC"**. Match the kalum-web footer's "Neuera" on new marketing pages; reserve "NeuEra Apps LLC" for legal/copyright. There is **no "Parham Modirniya"** string in either repo — don't introduce one.

---

## 9. Definition of done / success criteria

- The App Check prerequisite is resolved: the build fetches rates from a reachable endpoint (or committed snapshot) and gets a **200**, verified by `curl` and by a green `astro build`.
- Rate figures on `/call/{slug}/` and `/call/` originate from a **build-time fetch** and appear as **literal text in `view-source`** (confirmed by inspecting the built HTML) — no client-side rate JS anywhere.
- Every rate page and the hub carry the **indicative-rates hedge** citing Terms **§5.3**, with a date derived from `fetchedAt` (no more `"March 23, 2026"`).
- When `basis === "from"`, all price phrasing reads **"from {rate}/min"** and no copy asserts a single flat landline+mobile rate; spelled-out prose figures (Mexico) are reconciled.
- No `/rates/` tree was created; the existing `/call/` scaffold was extended. Hand-authored `intro`+`dialingNote` preserved per country; no thin auto-exploded pages.
- No pages exist for Syria/Iran/Cuba; no rate renders as `undefined`/`$0.00`; match failures fall back to snapshot or omit.
- A backend hiccup / residual 403 does **not** fail the marketing deploy (fail-open to committed snapshot verified).
- Sitemap `lastmod` bumps only for slugs whose rate changed; IndexNow fires on genuine rate changes (incl. cron) and stays quiet otherwise.
- All URLs are apex + trailing slash and registered in the sitemap (+ hreflang if localized); new JSON-LD validates and doesn't conflate with the app's free `Offer.price:"0"`.
- EN/ES date + rate copy in sync (or `/es/` deferral explicitly documented).

---

## 10. Open questions to resolve FIRST (lead with App Check)

1. **App Check decision (BLOCKER — decide before anything else).** Which §5.4 mitigation? Recommended: **A** — backend un-gates `GET /api/voice/rates` (or adds `GET /api/public/rates`) so a tokenless CI build gets 200. Who owns the backend PR, and what is the final URL the web build will fetch? **No web implementation starts until this returns 200 to an un-App-Checked client.**
2. **URL shape confirmation.** Confirm the intent is to **extend `/call/[slug]/` + `/call/`** (recommended — roadmap `visibility-roadmap.md:296` rejects duplicate trees) rather than a new `/rates/` tree.
3. **`basis:"from"` copy model.** Product/legal sign-off on switching flat-rate copy to "from {rate}/min" site-wide, and rewriting the affected FAQ/`intro` prose.
4. **Fail-open vs fail-closed.** Confirm rates should fail-open to a committed snapshot (recommended), unlike `fetchLegal`.
5. **Coverage scope.** Keep the curated **31** (recommended for launch, tier-expand by search volume) vs widen now — and the anti-thin-content bar for adding any country.
6. **US/Canada + any `+1` destinations.** Whether to add +1 countries at all (needs longest-dial-code matching + the merged `US_CA` mapping decision). Default: don't, for this pass.
7. **`/es/` scope.** Extend live rates to `/es/call/mexico.astro` now, or defer? Keep EN/ES dates in sync regardless.
8. **IndexNow re-gating + `lastmod` delta.** Confirm the "bump/ping only on real rate change" approach and that a committed snapshot is the accepted delta source.
9. **Entity name.** Three live variants exist — kalum-web footer **"Neuera"**, Terms **"operated by NeuEra Apps"**, legal copyright **"NeuEra Apps LLC"**. Confirm which to print on the new rate pages (default: match the existing kalum-web footer "Neuera"; reserve "LLC" for legal/copyright). No "Parham Modirniya" string exists in either repo.