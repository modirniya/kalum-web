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
- [ ] **App Store Connect:** set Marketing URL → `https://kalum.app/`,
      Support URL → `https://kalum.app/support/` (app id 6763210844;
      `sellerUrl` confirmed null via lookup API).
- [ ] **Play Console:** change developer website from `www.kalum.app` to
      `https://kalum.app/`.
- [ ] **Bing Webmaster Tools:** verify kalum.app (GSC import is one click),
      submit `https://kalum.app/sitemap.xml`, flag the stale parked-domain
      snapshot for `www.kalum.app` if still shown.
- [ ] **IndexNow (after Bing verification):** static key file in `public/`
      (public by design) + post-deploy submit step in `deploy.yml`. Repo
      work is ready to add the moment Bing verification exists. Modest
      accelerant only.

**Done when:** store clicks appear in ASC campaign analytics (needs token) /
Play acquisition reports (already flowing); Bing shows sitemap Success;
IndexNow submissions return 200 in the Actions log.

---

## Phase 3 — Destination expansion + internal linking — DONE (2026-07-20); 31 destinations live

Every new country is **rate-gated**: before adding a row, confirm in the
admin rate table that the destination is routable with a marketable rate,
and record the check date. Update `RATES_AS_OF` when rates are re-copied.

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

## Phase 4 — Evergreen content & app-web integration

Partly dependent on Phase 3 (Gulf pages) and on the mobile app team.

External inputs needed:
1. SHA-256 signing fingerprints from Play Console → App Signing (both app
   signing key and upload key).
2. App team: `autoVerify` intent filters (Android) and Associated Domains
   entitlement (iOS) — the web files can ship first with app-home fallback.

- [ ] **`/whatsapp-calls-blocked/` explainer page:** covers UAE, Qatar,
      Oman in hedged, dateless language; no enforcement specifics that rot.
      Pitch: dialing a regular number bypasses the issue entirely.
      Cross-link with `/call/uae/`, `/call/qatar/`, `/call/oman/`.
      Requires the Gulf pages from Phase 3 so links resolve at launch.
- [ ] **Android App Links:** `public/.well-known/assetlinks.json` declaring
      `app.kalum.mobile` with both SHA-256 fingerprints; complete Play
      Console domain verification. Full value needs the app's `autoVerify`
      release — retention/UX, not search visibility.
- [ ] **iOS Universal Links (conditional):** extensionless
      `public/.well-known/apple-app-site-association` only once the iOS app
      adds the Associated Domains entitlement. Include `/call/*` and `/`;
      exclude legal/support and `/call-mexico/`. After deploy, verify
      Apple's CDN accepts GitHub Pages' generic content type — if
      rejected, DROP the approach (no header tricks possible).
- [ ] **Deep-link routing contract with the app team:** `/call/{slug}/` →
      dialer pre-set to that destination; `/` and `/how-it-works/` → app
      home; legal/support/paid-LP → stay in browser. Don't block the
      association files on this.

**Done when:** explainer indexed and cross-linked; assetlinks passes
Google's Digital Asset Links validator; AASA fetch verified from Apple CDN
(or consciously dropped).

---

## Phase 5 — Internationalization program

One program, four steps, strictly sequenced. **Gating policy
(non-negotiable):** a locale page ships only fully translated — title,
meta description, FAQ text, JSON-LD (FAQPage answers included), nav, alt
text — human-written or native-reviewed; no raw machine translation.
Never Accept-Language or geo-based switching; visible plain-`<a>` EN|ES
switcher only.

- [ ] **Step 1 — locale-signals plumbing (small PR, inert on its own):**
      `lang`/`dir` props on `BaseLayout.astro` (currently hardcoded
      `lang="en"`, `og:locale` en_US, `inLanguage` 'en'); optional
      `alternates` prop emitting bidirectional `<link rel="alternate"
      hreflang>` with self-referencing entries and x-default → English URL
      (absolute apex URLs, trailing slashes, language-only codes). Extend
      `sitemap.xml.ts` with `xhtml:link` alternates.
- [ ] **Step 2 — Spanish `/es/` (the main bet):** complete small set:
      `/es/`, `/es/call/`, `/es/call/mexico/`, `/es/call-without-internet/`.
      Targets: "llamadas baratas a mexico", "como llamar a mexico desde
      estados unidos", "llamadas a mexico sin internet". Plain static files
      under `src/pages/es/`, English slugs under the prefix. Repo-specific
      trap: `[slug].astro` interpolates English strings from
      `destinations.ts` into visible copy AND FAQPage schema — build
      per-locale string tables beside `destinations.ts` rather than forking
      it; rates and `RATES_AS_OF` stay single-sourced. Support/legal stay
      English-only, get no hreflang, are never stubbed.
      *External input: human/native-reviewed Spanish translations.*
- [ ] **Step 3 — measurement checkpoint:** GSC 8–12 weeks after `/es/`
      launch (filter queries containing "llamadas"/"como llamar"). Expect
      an incremental slice, not a step change. Arabic proceeds only on
      positive signal.
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

## Phase 6 — Performance & structured-data polish

Lowest priority; a slow-afternoon batch after the above.

- [ ] `fetchpriority="high"` on the hero image; `loading` prop on the two
      badge components (lazy in the footer only).
- [ ] Font preloads via `?url` imports for the Inter 400/800 subsets; drop
      the near-unused 500 weight.
- [ ] BreadcrumbList prop in `BaseLayout.astro` for the evergreen pages
      that lack it (how-it-works, support, call-without-internet,
      calling-app-vs-internet-calling) — without double-emitting on
      destination pages and skipping the noindex LP.

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
- [ ] **Apple provider token** → paste into `APPLE_PROVIDER_TOKEN` in
      `src/lib/stores.ts` (App Store Connect > Analytics > Campaigns → the
      numeric `pt` in a generated campaign link). Activates App Store install
      attribution everywhere in one commit.
- [ ] **App Store Connect:** set Marketing URL `https://kalum.app/`, Support
      URL `https://kalum.app/support/` (app id 6763210844).
- [ ] **Play Console:** developer website `www.kalum.app` → `https://kalum.app/`.
- [ ] **Bing Webmaster Tools:** verify kalum.app (GSC import is one click),
      submit `https://kalum.app/sitemap.xml`, flag the stale `www.kalum.app`
      parked-domain snapshot. Unlocks the Phase 2 IndexNow repo work.

**Phase 4 — app-web integration (when those items come up):**
- [ ] SHA-256 signing fingerprints from Play Console → App Signing (for
      `assetlinks.json`); app-team `autoVerify` intent filters (Android) and
      Associated Domains entitlement (iOS).

**Phase 5 — i18n (when it starts):**
- [ ] Human-written / native-reviewed Spanish translations (then Arabic,
      with a native Arabic reviewer), per the no-machine-translation gate.
