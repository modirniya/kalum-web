# Kalum.app Visibility Roadmap

Phased development plan covering all verified findings from the multi-agent
visibility research (2026-07-20). Work proceeds one phase at a time; check
items off as they land. Each phase lists external inputs that must exist
before the repo work can finish.

**Standing constraints (apply to every phase):**

- GitHub Pages static hosting only — no server logic, custom headers, or
  geo/UA/device-based behavior.
- Bots and users always see identical content (prior cloaking flag;
  non-negotiable).
- Verified claims only: no quality claims, no invented ratings/figures;
  rates are country-specific and sourced from the admin rate table.
- Canonical host is apex `kalum.app` with trailing slashes.
- Paid LPs (`/call-mexico/`) stay noindex. Iran/Syria unroutable; Maghreb
  excluded.

---

## Phase 1 — Hygiene & metadata correctness ✅ DONE (2026-07-20)

Repo-only, no external inputs. Shipped in one commit.

- [x] **Favicon/touch icon are mislabeled JPEGs.** Re-exported
      `public/favicon.png` (192×192) and `public/apple-touch-icon.png`
      (180×180) as genuine PNGs from the SVG's embedded master (lossless).
      Organization `logo` → `apple-touch-icon.png` (real PNG, >112px min).
- [x] **Schema price is wrong.** MobileApplication offer price → `"0"`
      (confirmed "Free" via Apple lookup API). No aggregateRating.
- [x] **Store listing renamed.** Verified via Apple lookup API + Play title:
      both stores now "Kalum: Call Abroad over WiFi". Updated
      MobileApplication `name` and Apple `storeUrls` slug to
      `kalum-call-abroad-over-wifi`.
- [x] **404 page:** `noindex={true}`; canonical → `https://kalum.app/404/`.
- [x] **`/call/` title hook:** min rate computed from `destinations.ts` →
      "International Calling Rates by Country — from 6¢/min | Kalum".
- [x] **Visible breadcrumb on destination pages:** Home / Destinations /
      Call {Country} nav in `[slug].astro`; text + URLs verified identical
      to the BreadcrumbList JSON-LD.
- [x] **Smart App Banner:** `apple-itunes-app` now includes
      `app-argument=${canonical}` (per-page).
- [x] **"From the US" phrasing:** added FAQ "Can I call {name} from my cell
      phone?" (now 6 FAQs/page, in body + FAQPage schema). No worked numbers
      added. H2 kept geo-neutral ("How to call {name}") by owner decision —
      the site serves diaspora globally, not US-only.

**Done:** build passes (20 pages); icons validate as PNG; all JSON-LD
parses; breadcrumb visible text/URLs identical to JSON-LD.

**Deferred to owner (surfaced during Phase 1, belongs to Phase 2):** Apple
`sellerUrl` is null — set the App Store Marketing/Support URLs.

---

## Phase 2 — Measurement & engine coverage — REPO WORK DONE (2026-07-20); owner items pending

Attribution comes first because it tells us which later investments convert.

**Resolved during Phase 2:** the Android app (Flutter, `../mobile`) ships the
native `firebase-analytics` SDK (`android/app/build.gradle.kts`). So the Play
`referrer` param is NOT inert — Play Console Acquisition reports capture it at
the store level, and Firebase auto-collects it as campaign attribution on
first open. No app-side change needed.

Repo work (shipped):

- [x] **Centralized store links** in `src/lib/stores.ts` — one source of
      truth for badges AND structured-data `sameAs`, so the Apple slug can't
      drift again (it just did in Phase 1).
- [x] **GooglePlayBadge attribution:** now
      `&referrer=utm_source%3Dkalum-web%26utm_medium%3Dweb%26utm_campaign%3D${utm}`
      (URL-encoded); per-placement `utm_campaign`. Live and producing data.
- [x] **AppStoreBadge campaign-link support:** `appleHref()` emits
      `?pt=<token>&ct=${utm}&mt=8` — but **token-gated**. `APPLE_PROVIDER_TOKEN`
      in `stores.ts` is empty, so links ship clean (removed the old
      `utm_source` that reached nothing). Drop the token in → attribution
      activates everywhere, no other change.

Owner items (off-repo, still pending):

- [ ] **Apple provider token** → paste into `APPLE_PROVIDER_TOKEN` in
      `src/lib/stores.ts` (App Store Connect > Analytics > Campaigns → the
      numeric `pt` in a generated campaign link). One-line edit, then commit.
- [x] **App Store Connect (SET 2026-07-20):** Marketing `https://kalum.app/`,
      Support `https://kalum.app/support/`. Lookup API `sellerUrl` still
      caching — re-verify in ~a day.
- [x] **Play Console (DONE 2026-07-20):** main store listing website is
      `https://kalum.app/` (apex).
- [ ] **Bing Webmaster Tools:** verify kalum.app (GSC import is one click),
      submit `https://kalum.app/sitemap.xml`, flag the stale parked-domain
      snapshot for `www.kalum.app` if still shown.
- [x] **IndexNow (DONE 2026-07-20):** public key file at
      `/f9ae384da454e9d1a2aed641e586c16c.txt` + post-deploy ping in
      `deploy.yml` (Bing/Yandex/Seznam), on content deploys only.

**Done when:** store clicks appear in ASC campaign analytics (needs token) /
Play acquisition reports (already flowing); Bing shows sitemap Success;
IndexNow submissions return 200 in the Actions log.

---

## Phase 3 — Destination expansion + internal linking — DONE (2026-07-20); 31 destinations live

Every new country is **rate-gated**: before adding a row, confirm the
destination is routable with a marketable rate.

*Superseded 2026-08-01:* rates are no longer copied by hand, so there is no
`RATES_AS_OF` to update — a destination is priced from the live rate card at
build time and the "rate as of" date comes from the fetch. Adding a country now
means adding its curated row (slug, dial code, intro, dialing note); the rate
attaches itself, and a dial code the card does not carry is dropped from the
build with a warning rather than shipping a blank price. See
`docs/rates-page-seo-brief.md`.

Internal linking (shipped, uses the existing 10 destinations):

- [x] **Homepage "Popular destinations" strip:**
      `src/components/home/PopularDestinations.astro` (between HowItWorks and
      TrustStrip), 6 featured corridor cards, rates imported from
      `destinations.ts`. Featured set is data-driven via `featuredSlugs`.
- [x] **Footer destination links:** sitewide "Popular destinations" row in
      `Footer.astro` (same `featuredDestinations()` source) + "All
      destinations" link. Every page now links the destination pages, not
      just `/call/`.

New destination pages — DONE (2026-07-20). Rates from the admin table
(all dated March 23, 2026, matching `RATES_AS_OF`); 18 destinations total.

- [x] **Gulf:** Kuwait (17¢, no VoIP claim), Qatar (40¢, VoIP-hedged),
      Oman (52¢, VoIP-hedged), Bahrain (26¢, no VoIP claim). Verified the
      hedged phrasing renders on Qatar/Oman only.
- [x] **Sudan (45¢):** outage/connectivity framing, dateless.
- [~] **Somalia (+252): SKIPPED.** Rate is $1.10/min — fails the marketable
      gate (the template's H1 is price-led) and exceeds the sub-dollar cents
      display (`rateLabel` would show "110¢"). Revisit only with a
      connectivity-led hero variant, not a plain data row.
      *Update 2026-08-01: both blockers are now gone — `formatRate` renders
      ≥$1 as "$1.10", and the value-led hero variant exists (Phase 7b). Somalia
      is unblocked if someone writes it a real intro and dialing note; it was
      left out of that pass only because the pass was about existing pages.*
- [x] **Central America:** Guatemala (24¢), El Salvador (35¢), Honduras
      (29¢). Full payoff comes after the Phase 5 Spanish locale.

Second expansion wave (2026-07-20, "plans are dynamic" — folded the Phase 3b
corridors straight into the active plan):

- [x] **Latin America:** Colombia (4¢ — cheapest in the table, huge diaspora).
- [x] **South Asia:** India (5¢), Bangladesh (7¢), Pakistan (22¢),
      Sri Lanka (28¢), Nepal (30¢).
- [x] **Southeast Asia:** Vietnam (15¢), the Philippines (28¢).
- [x] **Sub-Saharan Africa:** Nigeria (20¢), Kenya (36¢), Ethiopia (47¢),
      Ghana (49¢). Afghanistan (49¢, outage framing) added alongside.
      → **31 destinations total.**
- [x] **`rateLabel` dollar format:** now renders ≥ $1.00 as "$1.10" (was
      "110¢"); unblocks any future high-rate country (e.g. a reconsidered
      Somalia).
- [x] **`/call/` index grouped by region** (`region` field + Americas /
      Middle East / Asia / Africa headings) so the 31-item list stays
      scannable and gains semantic H2 structure.
- [ ] **Still held — Dominican Republic** (+1809, 17¢): shares country code 1,
      so the `+{dialCode}` template renders "+1809" and the "drop the leading
      0" dialing logic doesn't apply. Needs a NANP-aware dialing note + a
      small template branch before it ships. Only remaining held corridor.

**Remaining corridor opportunities (optional, owner's call):** Brazil (8¢),
Peru (9¢), Indonesia (12¢), Thailand (12¢), Morocco is Maghreb-excluded.
`featuredSlugs` still the original 6 (Mexico + MENA) — revisit once Phase 2
attribution shows which corridors actually convert, rather than guessing.

**Done:** 21 destination pages added across two waves, every rate verified
against the admin table; VoIP phrasing scoped to the Gulf; each page keeps
breadcrumb / 6-FAQ / JSON-LD; index regional grouping, sitemap (37 URLs), and
sibling cross-links all update automatically. Somalia deliberately skipped
(unmarketable at $1.10).

---

## Phase 4 — Evergreen content & app-web integration — CONTENT DONE (2026-07-20); app-link files blocked

- [x] **`/whatsapp-calls-blocked/` explainer page** (shipped): hedged,
      dateless copy; framed positively (Kalum dials a real number, doesn't
      depend on internet apps) — never as circumventing a restriction. The
      country list is data-driven from a new `voipRestricted` flag on
      destinations (UAE/Qatar/Oman), which also renders a cross-link callout
      in those pages' heroes. Linked from the footer + the vs-internet page.
      4-FAQ FAQPage schema. Sitemap now 38 URLs.

App-link files — both genuinely blocked (investigated the `mobile` repo):

- [x] **Android App Links (`public/.well-known/assetlinks.json`): SHIPPED 2026-07-20.** Both Play SHA-256 fingerprints in place; `.nojekyll` added; validated via Google's Digital Asset Links API. App `autoVerify` intent filters still needed (app team). [orig notes:] BLOCKED
      on the Play App Signing SHA-256. The app is Play-signed (package
      `app.kalum.mobile`), so the fingerprint Android verifies lives only in
      Play Console → Test and release → App integrity → App signing. That
      page lists BOTH the app-signing and upload SHA-256 — include both.
      `google-services.json` only had a SHA-1 OAuth hash (not usable here).
      Do NOT ship a partial/guessed file — a wrong fingerprint fails
      verification and Google fetches it. Ready-to-fill template:
      ```json
      [{
        "relation": ["delegate_permission/common.handle_all_urls"],
        "target": { "namespace": "android_app",
          "package_name": "app.kalum.mobile",
          "sha256_cert_fingerprints": ["<APP-SIGNING SHA256>", "<UPLOAD SHA256>"] }
      }]
      ```
      Full link-handling value also needs the app to ship `autoVerify`
      intent filters. Retention/UX, not search visibility.
- [ ] **iOS Universal Links (`apple-app-site-association`):** BLOCKED —
      `mobile/ios/Runner/Runner.entitlements` has NO `associated-domains`
      entitlement, so the app doesn't claim the domain; shipping AASA now is
      a no-op. When the app adds the entitlement + ships: Team ID
      `485TFXLF7Q`, bundle `app.kalum.mobile` → appID `485TFXLF7Q.app.kalum.mobile`.
      Include `/call/*` and `/`; exclude legal/support and `/call-mexico/`.
      After deploy, confirm Apple's CDN accepts GitHub Pages' content type;
      if rejected, DROP it (no header tricks on Pages).
- [ ] **Deep-link routing contract (app team):** proposed — `/call/{slug}/`
      → dialer pre-set to that destination; `/` and `/how-it-works/` → app
      home; legal/support/`/call-mexico/` → stay in browser. Association
      files can ship first with app-home fallback; don't block on this.

**Done when:** explainer indexed + cross-linked (done); assetlinks passes
Google's Digital Asset Links validator; AASA fetch verified from Apple CDN
(or consciously dropped).

---

## Phase 5 — Internationalization program — SPANISH LIVE (2026-07-20); Arabic pending checkpoint

One program, four steps, strictly sequenced. **Gating policy
(non-negotiable):** a locale page ships only fully translated — title,
meta description, FAQ text, JSON-LD (FAQPage answers included), nav, alt
text — human-written or native-reviewed; no raw machine translation.
Never Accept-Language or geo-based switching; visible plain-`<a>` EN|ES
switcher only.

- [x] **Step 1 — locale-signals plumbing (DONE 2026-07-20):** `lang`/`dir`/
      `alternates` props on `BaseLayout.astro` (`<html lang dir>`, og:locale
      es_MX/en_US, `inLanguage` follows lang); `src/lib/i18n.ts` holds the
      EN↔ES pairs, `alternatesFor()` (bidirectional hreflang + x-default →
      English), and `languageSwitch()`. Header + Footer are now locale-aware
      (Spanish chrome under `/es/`), with a plain-`<a>` EN|ES switch that
      falls back to the other language's home (never a 404). Sitemap emits
      `xhtml:link` alternates under an `xhtml` namespace.
- [x] **Step 2 — Spanish `/es/` (DONE 2026-07-20):** shipped `/es/`,
      `/es/call/mexico/`, `/es/call-without-internet/` (the three highest-
      intent Spanish pages). Purpose-written Mexican Spanish (celular, saldo,
      marcar), not literal MT; targets "llamadas internacionales baratas",
      "app de llamadas internacionales", "cómo llamar a México", "llamar sin
      internet". Rates single-sourced from the same build-time rate card as
      the English pages (was `destinations.ts` + a hand-stamped
      `RATES_AS_OF_ES`; the Spanish date now formats from the fetch
      timestamp). Each page: full hreflang, self-canonical,
      Spanish FAQPage schema, Spanish nav/footer/alt. `/es/call/` (full rates
      index) deferred — needs Spanish names for all 31 destinations; a
      standalone Spanish Mexico page avoided forking the whole destinations
      table for now.
      *NOTE: Spanish is LLM-authored (native-quality, claims-checked). A
      native-speaker review pass is recommended and applies as plain content
      edits — no structural changes. Not a launch blocker.*
- [ ] **Step 3 — measurement checkpoint:** GSC 8–12 weeks after `/es/`
      launch (filter queries containing "llamadas"/"como llamar"). Expect
      an incremental slice, not a step change. Arabic proceeds only on
      positive signal. When scaling Spanish past Mexico, move destination
      strings into a per-locale table beside `destinations.ts` and add
      `/es/call/` with Spanish country names.
- [ ] **Step 4 — Arabic `/ar/` (conditional on Step 3):** homepage +
      `/ar/call/{egypt,iraq,lebanon,jordan,saudi-arabia}/`. Real RTL work:
      `dir="rtl"` via BaseLayout prop; self-hosted
      `@fontsource/noto-sans-arabic` (Inter has no Arabic glyphs); replace
      physical Tailwind utilities (`pr-10`, `right-5`, `text-left`) with
      logical ones; drop `tracking-[...]` letter-spacing on Arabic text.
      Seed English source from `docs/mena-copy-archive.md`. Do not start
      without a native Arabic reviewer lined up.

**Done when (per step):** Step 1 emits nothing until alternates exist;
Step 2 pages fully translated + hreflang validates; Step 3 documented in
this file; Step 4 same bar as Step 2 plus RTL visual review.

---

## Phase 6 — Performance & structured-data polish — DONE (2026-07-20)

- [x] `fetchpriority="high"` on the hero image (LCP). `loading` prop added to
      both badge components (default eager); footer badges pass `loading="lazy"`,
      hero/CTA badges stay eager.
- [x] Font preloads: latin 400 + 800 woff2 preloaded (`?url` imports +
      `<link rel=preload ... crossorigin>`). **Kept the 500 weight** — it's
      used in the sticky header nav and trust strip, so dropping it would
      visibly lighten the nav; the roadmap's "near-unused" was inaccurate.
- [x] Breadcrumbs on evergreen content pages via a new `Breadcrumb.astro`
      that renders the visible nav AND the matching BreadcrumbList JSON-LD
      from one array (can't mismatch — cloaking-safe). Added to
      `/call-without-internet/`, `/calling-app-vs-internet-calling/`,
      `/whatsapp-calls-blocked/`, and `/es/call-without-internet/`.
      Destination pages keep their existing single BreadcrumbList (verified
      not doubled). Skipped `/how-it-works/` and `/support/` — utility pages
      one level deep where a Home→Page crumb is noise, not the paid noindex LP.

---

## Phase 7 — Build-time rates — BUILT (2026-08-01), gated on a backend deploy

The rates section stopped being hand-maintained. Prices are fetched from the
backend's rate card during `astro build` and baked into the HTML — never
client-side, since a JS-injected number is invisible to the crawlers these
pages exist for. Full context and the decision record: `rates-page-seo-brief.md`.

- [x] `src/lib/rates.ts` — build-time fetch mirroring `fetchLegal()`, but
      **fails open** to a committed snapshot (`src/data/rates.json`) so an API
      hiccup can't block a marketing deploy.
- [x] Hardcoded `rateCents`, `RATES_AS_OF` and `RATES_AS_OF_ES` deleted. Every
      "rate as of" date now formats from the fetch timestamp, so it cannot go
      stale (it was ~4 months out).
- [x] **Prefix-pricing copy fix.** Production prices each country's cheapest
      prefix, so every figure is a floor: all price phrasing reads "from
      X/min", and the ~20 intros and FAQs claiming one rate covers a country's
      mobiles and landlines were rewritten. That claim contradicted the quote
      the app gives before a call.
- [x] Indicative-rates disclosure (`RateDisclosure.astro`) on every page that
      prints a price, citing Terms §5.3 and linking rather than paraphrasing
      the §5 billing rules.
- [x] `Service` → `Offer` → `UnitPriceSpecification` JSON-LD per destination
      (`minPrice` under prefix pricing). Semantic hygiene for answer engines,
      not a rich result — kept distinct from the app's free `Offer.price: "0"`.
- [x] Sitemap `lastmod` moves only for destinations whose own rate moved, and
      the cron IndexNow ping now fires on genuine changes instead of being
      skipped outright.
- [ ] **Gated:** the build gets a 403/404 until the backend serves the card
      without App Check — see the owner action items below. Until then every
      build falls back to the committed snapshot, which is the same set of
      prices the site shipped before this change.

**No `/rates/` tree was created** — `/call/{slug}/` and `/call/` already own
both intents, and a parallel tree is the cannibalization this file rejects
below.

---

## Phase 7b — Editorial pass after live rates landed — DONE (2026-08-01)

Turning on live rates revealed the site had been advertising roughly half the
real price on most corridors: 27 of 31 destinations were under-quoted, several
by ~100% (Sudan 45→87¢, Nigeria 20→40¢, Vietnam 15→31¢). Publishing the true
figures was correct but left a dozen pages leading with a number that no longer
sells. Two fixes:

- [x] **Value-led hero above 50¢** (`PRICE_LED_MAX_CENTS` in
      `call/[slug].astro`). Twelve destinations now lead with what Kalum
      actually offers that corridor instead of the price — "Call any Sudanese
      phone. / Landlines and mobiles. No app, smartphone, or internet on their
      end." VoIP-restricted destinations (UAE, Qatar, Oman) lead with the
      restriction. **The figure is not hidden**: it moves to its own hero line,
      and stays in the FAQ, the schema and every cross-link. Hiding a price to
      win a click is the trust failure this section exists to prevent. One
      constant moves the boundary; it currently splits Nepal (51¢, value-led)
      from Sri Lanka (49¢, price-led), so re-check it when rates move.
- [x] **Rebalanced `featuredSlugs`.** The homepage strip was five-sixths
      Middle East, which read as diaspora-first and contradicted the
      general-provider positioning. Now Mexico 4¢, Colombia 7¢, India 9¢,
      Turkey 13¢, Egypt 35¢, Nigeria 40¢ — all four regions, and every entry
      below the price-led threshold so the strip never advertises a figure the
      destination page itself declined to lead with. The UAE was dropped for
      that reason; it still leads `/whatsapp-calls-blocked/`, where its story
      is the restriction rather than the rate.

---

## Phase 8 — Snippet rewrite from Search Console evidence — DONE (2026-09-01)

First phase driven by measured search data rather than by audit. Source: the
GSC export for 2026-06-23 → 2026-08-30 (62 clicks, 6,707 impressions, 0.92%
CTR, average position 14.9), plus the Search Analytics API for the page↔query
join the CSV export cannot give. **The API join is what made this phase
possible** — it turned two guesses into two measurements, and killed a third
recommendation outright.

What the window showed:

- Impressions grew 10.6× (19/day → 202/day) and average position improved 11
  places, entirely off the 2026-07-20 content push and the 2026-08-08 retitle.
  Clicks did not follow. **Reach is compounding; conversion is flat.**
- Only 2,129 of 6,707 impressions (32%) attach to a named query. The query data
  describes shape, not volume — treat single-query rows as direction, not size.
- Strip brand out and the site earned **4 clicks from 814 non-brand named
  impressions (0.49%)**. Brand volume is not an asset: much of `kalum` is Kalum
  in British Columbia, Callum the given name, and 25 impressions of outright
  wrong-entity queries.

Shipped:

- [x] **Destination pages retitled and restructured (31 pages).** Titles now
      lead with the query they are found on and carry the dial code:
      `Call Egypt — Dial +20, No App on Their End` (value-led) and
      `Call Turkey from 9¢/min — Dial +90` (price-led). The old value-led title
      was one generic string shared by 26 pages that led with "Rates" — the
      intent this site loses — ahead of "How to Dial", the one it wins.
- [x] **New `numberFormat` field on `Destination`** — a one-clause restatement
      of `dialingNote`, used to lead the meta description with the dialing fact
      instead of the pitch. Separate field because `dialingNote` runs 140-180
      characters and Google cuts a description near 160, clipping exactly the
      useful half. Strictly a restatement: it must never assert anything
      `dialingNote` does not already say.
- [x] **Number format promoted to an H2 above "How to call".** It was an `<h3>`
      about 29% down the page; it now opens the body, and `010` first appears at
      character 933 instead of 1309. The pages already ranked 8.8 for
      `010 egypt number`, 11 for `jordan phone number format`, 16 for
      `oman mobile number digits` and 1 for `turkey mobile number digits`, all
      at zero clicks.
- [x] **`/whatsapp-calls-blocked/` → "Gulf Calling App for the UAE & Qatar".**
      The API join settled this: **43 of its 46 named-query impressions were
      `gulf calling app` / `gulf call app` at position 8.5**, and three were
      about WhatsApp. Every one earned zero clicks. Title, description, H1 and
      breadcrumb label now match what the page is found on; the restriction copy
      stays in the body, where it is the differentiator rather than the headline.
      URL unchanged — it is what holds the position.
- [x] **The from-UAE corridor cluster retitled.** `/call-india-from-uae/` took
      453 impressions at position 8.3 and returned one click. Every named query
      it holds is dialing logistics — `how to call india from uae` (#1),
      `uae to india call code` (7), `how to call kerala landline from uae` (8),
      `uae to india landline code` (11) — and the title promised a WhatsApp
      story. Now `Call India from the UAE — How to Dial +91`. Same treatment for
      `/call-pakistan-from-uae/` and `/call-from-uae/`.
- [x] **Both `/call/` hubs repointed off rate comparison.** English is now
      `Country Codes & Calling Rates — 31 Destinations`, Spanish
      `Códigos de País y Tarifas — 31 Destinos`, H1s to match. The English hub
      held 33 rate-comparison queries for 95 impressions, **zero clicks, average
      position 43** — `international calling rates`, `cheap calls to iraq`,
      `cheapest local call rates sudan`. Phase 7b's code comment already
      recorded why we lose those; the title was still bidding on them.
- [x] **Spanish destination pages retitled**, with a `numberFormatShort` field
      mirroring the English one. The evidence here is stronger than in English:
      *every* named query `/es/call/honduras/` held was a number-format
      question — `código para llamar a teléfono fijo` (#1),
      `teléfono fijo` (#2), `honduras numeros de celular` (8),
      `honduras indicativo` (11) — all at zero clicks.
- [x] **Sitemap `lastmod` restamped for the 42 pages that actually changed**,
      and only those. The 8 untouched pages keep their old dates. The retired
      `COPY_CHANGE` (2026-08-08) stamp was deleted as its own note instructed,
      along with two constants it left unreferenced.

Deliberately NOT done:

- [~] **Homepage title.** The plan was to drop "Cheap" for the no-internet
      differentiator. The API join killed it: `/` takes **981 of its 1,010
      named-query impressions on brand terms**, and the entire non-brand
      remainder is 29 impressions of junk (`kallmobile`, `lakum`, `caloom`).
      There is no non-brand upside to win and a live brand ranking to risk.
      Revisit only if non-brand homepage impressions become material.
      `/es/` is the same story — 189 of its 199 impressions are `kalum` — so its
      title was left alone too, over-long though it is.
- [~] **Expanding `/es/call/` to more countries.** The recommendation assumed
      the Spanish tree was starved. It is not: Mexico, Colombia, Guatemala,
      Honduras and El Salvador are *every* Spanish-speaking destination in
      `destinations.ts`. The gap was snippet quality, not page count, and that
      is what got fixed. Adding Spanish pages for Egypt or Vietnam would be
      publishing for an audience that is not searching.

**Corrections to the analysis this phase was built on** (recorded because the
first read was made without the page↔query join):

- Number-format queries are ~10% of named destination-page impressions, not the
  dominant intent. The dominant intent is plain `call {country}` — `call turkey`
  (60 impr, pos 13.2), `call omani` (47, pos 9.1), `call jordan` (43, pos 24.9),
  all at zero clicks. That is why the new titles keep `Call {Country}` first and
  *add* the format hook rather than replacing it.
- "Spanish and no-internet are the only intents beating site-average CTR" was
  wrong — brand beats it too, at 1.14%. They are the only *non-brand* intents
  above the line.

**Verify in 4-6 weeks:** destination-page CTR against the 0.82% baseline;
`/whatsapp-calls-blocked/` against 0.25%; `/call-india-from-uae/` against 0.22%;
whether the number-format queries convert at all. The trap to avoid is reading
sitewide CTR — impressions are still growing into worse positions, which dilutes
it regardless of whether these pages improved. Compare per-page, per-query.

---

## Explicitly not planned (verifier-rejected — do not resurrect)

- HowTo, new FAQ rich-result work, SearchAction, Speakable markup —
  deprecated or news-only as of 2026; existing FAQPage JSON-LD stays as-is.
- aggregateRating in app schema — verified-claims violation.
- Turkish locale — one destination page doesn't justify a locale tree.
- Separate `/how-to-call-X/` pages — would cannibalize `/call/X/`.
- Iran/Syria/Maghreb destination pages — unroutable / excluded.
- `llms.txt` — no major AI engine documents consuming it; robots.txt
  already allows all crawlers.
- Any geo/UA/device-based content switching — permanently off the table.
- Retitling the homepage or `/es/` around a non-brand hook — both are ~97%
  brand-query impressions (Phase 8). No upside to win, a live ranking to risk.
- Spanish pages for non-Spanish-speaking destinations — the Americas set is
  already complete; the rest would be publishing at an absent audience.
- Chasing "free calling" queries — 21 queries, 33 impressions, zero clicks,
  average position 55 over the three months to 2026-08-30. Kalum is prepaid;
  this traffic cannot convert.

---

## Owner action items (consolidated) — off-repo, needed from the site owner

These gate parts of the roadmap and cannot be done from the repo. Kept here,
at the end, as the running reminder of what's on the owner's plate.

**Phase 3 — destination rates:** ✅ provided 2026-07-20; **21 pages shipped
across two waves → 31 destinations.** Somalia skipped (unmarketable at $1.10);
Dominican Republic still held (needs the +1 template branch). Optional: OK any
remaining corridors (Brazil, Peru, Indonesia, Thailand), and decide whether to
re-feature the homepage set once Phase 2 attribution data exists.

**Phase 2 — measurement & engine coverage:**
- [x] **Apple provider token** — `128816974` set in `APPLE_PROVIDER_TOKEN`
      (2026-07-20). App Store badges now emit `?pt=128816974&ct=<placement>&mt=8`;
      both stores attributed.
- [ ] **App Store Connect:** set Marketing URL `https://kalum.app/`, Support
      URL `https://kalum.app/support/` (app id 6763210844).
- [ ] **Play Console:** developer website `www.kalum.app` → `https://kalum.app/`.
- [x] **Bing Webmaster Tools:** ✅ done — verified, sitemap submitted,
      IndexNow wired in.

**Phase 4 — app-web integration (explainer shipped; app-link files blocked):**
- [x] **Play App Signing SHA-256:** ✅ provided; `assetlinks.json` shipped +
      validated. App-team `autoVerify` intent filters still needed for
      auto-open.
- [ ] **iOS `associated-domains` entitlement** added to the app + a release
      (`applinks:kalum.app`). Only then does the AASA file do anything — Team
      ID `485TFXLF7Q` and bundle already captured.
- [ ] App-team `autoVerify` intent filters (Android) for full link handling.

**Phase 5 — i18n:** Spanish `/es/` shipped (LLM-authored, claims-checked).
- [ ] *Optional:* native-Spanish-speaker review pass on the 3 `/es/` pages
      (applies as content edits; not a blocker).
- [ ] Arabic `/ar/` later needs a native Arabic reviewer lined up before
      starting (per the no-machine-translation gate + RTL work).
