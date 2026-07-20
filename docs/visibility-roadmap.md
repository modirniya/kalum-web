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

## Phase 1 — Hygiene & metadata correctness

Repo-only, no external inputs. One batch commit.

- [ ] **Favicon/touch icon are mislabeled JPEGs.** Re-export
      `public/favicon.png` (96×96 or 192×192) and
      `public/apple-touch-icon.png` (180×180) as genuine PNGs from
      `src/assets/kalum-icon.svg`. Confirm the Organization `logo` URL in
      `BaseLayout.astro` points at a real PNG.
- [ ] **Schema price is wrong.** In `BaseLayout.astro` MobileApplication
      offer: price `"0"` (app is free; $2.99 is the minimum credit
      purchase). Do NOT add aggregateRating.
- [ ] **Store listing renamed.** Update MobileApplication `name` to the
      current store name ("Kalum: Call Abroad over WiFi") and the Apple
      store URL in `storeUrls` to the current slug
      (`kalum-call-abroad-over-wifi`). Verify both live listings first.
- [ ] **404 page:** pass `noindex={true}` in `src/pages/404.astro`; fix its
      canonical to trailing-slash form.
- [ ] **`/call/` title hook:** compute min rate from `destinations.ts` at
      build time → "International Calling Rates by Country — from 6¢/min |
      Kalum" (self-updates when rates change).
- [ ] **Visible breadcrumb on destination pages:** add Home › Destinations ›
      Call {Country} nav to `src/pages/call/[slug].astro` matching the
      existing BreadcrumbList JSON-LD exactly (markup and visible content
      must agree — cloaking-adjacent concern).
- [ ] **Smart App Banner:** append `app-argument=${canonical}` to the
      `apple-itunes-app` meta in `BaseLayout.astro`.
- [ ] **"From the US" phrasing:** destination-page H2 → "How to call {name}
      from the US"; add FAQ "Can I call {name} from my cell phone?". Any
      worked dialing example must use clearly fictitious numbers.

**Done when:** build passes; icons validate as PNG; schema validates in
Rich Results test; breadcrumb visible and identical to JSON-LD.

---

## Phase 2 — Measurement & engine coverage

Small code changes + owner account work. Attribution comes first because it
tells us which later investments convert.

External inputs needed from owner:
1. App Store Connect provider token (`pt=`) from Analytics → Campaigns.
2. Confirmation whether the Android app integrates Firebase Analytics or
   the Play Install Referrer API (if not, the Play referrer param is inert
   but harmless).
3. Bing Webmaster Tools access (verify via GSC import — check first whether
   already verified).

- [ ] **AppStoreBadge attribution:** current `utm_source` params reach
      nothing on Apple. Change `src/components/AppStoreBadge.astro` link to
      `?pt=<token>&ct=${utm}&mt=8`, keeping existing per-placement values
      as `ct`.
- [ ] **GooglePlayBadge attribution:** change to
      `&referrer=utm_source%3Dkalum-web%26utm_medium%3Dweb%26utm_campaign%3D${utm}`
      (URL-encoded), existing placement values as `utm_campaign`.
- [ ] **(Owner, off-repo) App Store Connect:** set Marketing URL →
      `https://kalum.app/`, Support URL → `https://kalum.app/support/`
      (app id 6763210844; `sellerUrl` is currently null). Ships with next
      metadata update.
- [ ] **(Owner, off-repo) Play Console:** change developer website from
      `www.kalum.app` to `https://kalum.app/`.
- [ ] **(Owner, off-repo) Bing Webmaster Tools:** verify kalum.app (GSC
      import is one click), submit `https://kalum.app/sitemap.xml`, flag
      the stale parked-domain snapshot for `www.kalum.app` if still shown.
- [ ] **IndexNow (after Bing verification):** commit the static key file in
      `public/` (public by design, not a secret) and add a post-deploy
      submit step to the deploy workflow. Modest accelerant only.

**Done when:** store clicks appear in ASC campaign analytics / Play
acquisition reports; Bing shows sitemap Success; IndexNow submissions
return 200 in the Actions log.

---

## Phase 3 — Destination expansion + internal linking

Every new country is **rate-gated**: before adding a row, confirm in the
admin rate table that the destination is routable with a marketable rate,
and record the check date. Update `RATES_AS_OF` when rates are re-copied.

External input needed from owner: current per-minute rates for the
candidate countries below.

- [ ] **Gulf:** Kuwait (+965), Qatar (+974), Oman (+968), Bahrain (+973) —
      data rows in `src/lib/destinations.ts` (intro + dialingNote each).
      Reuse the UAE hedged VoIP-restriction phrasing for Qatar and Oman
      ONLY; Kuwait/Bahrain intros must not claim a VoIP block. Fits the
      "Middle East Calling" store identity.
- [ ] **Horn of Africa:** Sudan (+249), Somalia (+252). Model intros on the
      Lebanon/Yemen outage framing, kept dateless. Skip either if
      unroutable/unmarketable.
- [ ] **Central America:** Guatemala (+502), El Salvador (+503), Honduras
      (+504). (Full payoff after Phase 5 Spanish locale — this audience
      searches in Spanish — but the English pages are worth having now.)
- [ ] **Held for a later pass:** Dominican Republic (shares country code 1 —
      breaks the `+{dialCode}` template rendering in six places; needs an
      explicit dialing note and copy review) and Colombia.
- [ ] **Homepage "Popular destinations" strip:** top 5–6 corridors on
      `src/pages/index.astro`, rates imported from `destinations.ts` so
      they never drift.
- [ ] **Footer destination links:** 4–5 top corridors in `Footer.astro`.
      Ship the linking together with the new pages so they launch with
      internal links (today only `/call/` is linked sitewide).

**Done when:** every new page shows a rate verified on a recorded date;
sitemap includes new URLs; homepage/footer link them; build passes.

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
