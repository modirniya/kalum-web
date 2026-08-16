> **STATUS 2026-08-16.** The public rates route this file asks you to approve has
> been live since 2026-08-05 and the site has been building from it since. That item
> is done. Items about internal linking and featuredSlugs also shipped, and measured
> inert. See GROWTH_RESEARCH_2026-08-16.md in kalum-backend for what the data now says.

# Owner to-do — kalum.app visibility

All six roadmap phases are shipped and live (see `visibility-roadmap.md`).
Nothing in the repo is blocked on engineering — the items below are the
account/console tasks only you can do. Each notes **what it unlocks** and
**what I do next** once you hand back the result.

Ordered by impact-for-effort. Check them off as you go.

---

## Quick wins (consoles you already control)

### 1. Bing Webmaster Tools + IndexNow ✅ DONE (2026-07-20)
- Bing verified via GSC import; sitemap submitted, **41 URLs discovered**.
- **IndexNow** now wired in: public key file at
  `https://kalum.app/f9ae384da454e9d1a2aed641e586c16c.txt` + a post-deploy
  step in `deploy.yml` that pings IndexNow (Bing/Yandex/Seznam) with the
  current URL set on every content deploy (skips the weekly cron). Bing +
  DuckDuckGo + ChatGPT Search now covered.

### 2. Apple provider token — activate App Store install attribution ✅ DONE (2026-07-20)
- Provider token `128816974` is set in `APPLE_PROVIDER_TOKEN`
  (`src/lib/stores.ts`). Every App Store badge now links with
  `?pt=128816974&ct=<placement>&mt=8`; each placement (hero, footer, per
  destination, /es/…) reports as its own campaign in App Analytics.
- Google Play attribution was already live. Both stores now attributed.

### 3. App Store Connect — set Marketing + Support URLs ✅ SET (2026-07-20)
- Owner set Marketing URL `https://kalum.app/` and Support URL
  `https://kalum.app/support/` on the version page.
- Apple's public lookup API still showed `sellerUrl: null` right after — that
  API caches/lags by ~a day, or the field publishes with the next version.
  Re-check later: `curl -s "https://itunes.apple.com/lookup?id=6763210844"`.

### 4. Google Play Console — developer website ✅ DONE (2026-07-20)
- Main store listing → Contact details → Website already shows
  `https://kalum.app/` (apex, correct). The public listing website is the one
  that matters; the optional account-level field wasn't present/needed.

---

## Needs the mobile app team

### 5. Play App Signing SHA-256 — Android App Links ✅ WEB FILE SHIPPED (2026-07-20)
- Owner provided both SHA-256 fingerprints (from the new "Protected with Play"
  → Play app signing page). Shipped `public/.well-known/assetlinks.json` for
  `app.kalum.mobile` with both; added `public/.nojekyll` so the dot-directory
  serves on GitHub Pages. Validated via Google's Digital Asset Links API.
- **Still needs (app team):** `autoVerify` intent filters in the Android
  manifest for links to open the app automatically. The web half is done.

### 6. iOS Associated Domains entitlement — unlocks Universal Links
- App team adds the **`associated-domains`** entitlement in Xcode with
  `applinks:kalum.app`, then ships an app release.
- **Tell me when it's in a release** (Team ID `485TFXLF7Q` and bundle
  `app.kalum.mobile` are already captured).
- **Then I:** create `public/.well-known/apple-app-site-association` and
  verify Apple's CDN accepts it from GitHub Pages (drop it if rejected — no
  header workarounds possible on Pages).

---

### 7. Serve the rate card without App Check — unblocks live rates on the site

The site now prices every destination page from the backend's rate card at
build time instead of hand-copied cents (Phase 7 in `visibility-roadmap.md`).
The last piece is a backend route a CI runner can actually reach:
`GET /api/voice/rates` returns **403 `app_check_required`**, and a GitHub
Actions build is not a genuine app instance, so App Check is meant to reject
it. There is no bypass token in prod, by design.

**What's needed:** a ~10-line `router.ex` change adding a second, deliberately
public path to the same `VoiceController.rates/2` action — the exact diff is in
`rates-page-seo-brief.md` §5.4 — then a Fly deploy. It leaves the app's own
`/api/voice/rates` and its App Check gate untouched, and `/voice/quote` stays
gated. **This needs your explicit sign-off** because it puts an unauthenticated
route on the API; the same per-IP flood limit (120/min) still applies, and the
payload is fixed public marketing data, identical for every caller.

**Until then** nothing breaks: every build falls back to the committed snapshot
in `src/data/rates.json` and ships the same prices the site had before. Once
the route is live, the next build picks up real rates with no web change — or
set the `KALUM_RATES_URL` repo variable if you pick a different path.

---

## Optional

### 8. Native-Spanish review of the `/es/` pages
- The three Spanish pages are LLM-authored (native-quality, claims-checked):
  `/es/`, `/es/call/mexico/`, `/es/call-without-internet/`.
- Have a native Spanish speaker skim them and send me any wording tweaks.
- **Then I:** apply as content-only edits (no structural changes). If you'd
  rather they stay out of the index until reviewed, tell me and I'll add
  `noindex` to the three pages in the meantime.

---

## Also parked (my side — just say the word)

Not owner tasks, but open engineering I can pick up anytime:
- **Dominican Republic** destination page (needs the +1 NANP template branch).
- **Phase 3b** corridors — Brazil (8¢), Peru (9¢), Indonesia (12¢), Thailand
  (12¢): one data row each.
- **Arabic `/ar/`** — after the ~8–12 week Spanish GSC checkpoint and with a
  native Arabic reviewer lined up (RTL work; Inter has no Arabic glyphs).
