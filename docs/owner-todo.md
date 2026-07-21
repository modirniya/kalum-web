# Owner to-do — kalum.app visibility

All six roadmap phases are shipped and live (see `visibility-roadmap.md`).
Nothing in the repo is blocked on engineering — the items below are the
account/console tasks only you can do. Each notes **what it unlocks** and
**what I do next** once you hand back the result.

Ordered by impact-for-effort. Check them off as you go.

---

## Quick wins (consoles you already control)

### 1. Bing Webmaster Tools — verify + submit sitemap  ⭐ highest leverage
- Go to **bing.com/webmasters** → sign in.
- Use **"Import from Google Search Console"** (one click — GSC is already
  verified, so no new file needed). If you'd rather verify manually, tell me
  and I'll drop a `BingSiteAuth.xml` in `public/`.
- Submit the sitemap: `https://kalum.app/sitemap.xml`
- While there, check for a stale **`www.kalum.app`** parked-domain snapshot
  and remove/disavow it if present.
- **Unlocks:** Bing + DuckDuckGo + ChatGPT Search indexing (they share Bing's
  index), and the **IndexNow** auto-submit step I'm holding.
- **Then I:** add IndexNow (key file + post-deploy ping in `deploy.yml`).

### 2. Apple provider token — activate App Store install attribution
- App Store Connect → **App Analytics** (analytics.appstoreconnect.apple.com)
  → **Acquisition → Campaigns** → create/view a campaign link. The generated
  URL contains `pt=NNNNNNN` — that number is the provider token.
- **Paste it to me** (or into `APPLE_PROVIDER_TOKEN` in `src/lib/stores.ts`).
- **Unlocks:** per-placement App Store install attribution (which page drives
  installs). Google Play attribution is already live.
- **Then I:** commit — every App Store badge instantly carries `?pt=&ct=&mt=8`.

### 3. App Store Connect — set Marketing + Support URLs
- App Store Connect → **Apps → Kalum → App Information**.
- Marketing URL: `https://kalum.app/`
- Support URL: `https://kalum.app/support/`
- (Fixes the null `sellerUrl` we confirmed via the lookup API. Ships with the
  next metadata update.)
- **Then I:** nothing — this is fully on the ASC side.

### 4. Google Play Console — fix developer website
- Play Console → Kalum → **Store presence → Store listing → Contact details**.
- Change website from `www.kalum.app` to `https://kalum.app/`.
- **Then I:** nothing — Play-side only.

---

## Needs the mobile app team

### 5. Play App Signing SHA-256 — unlocks Android App Links
- Play Console → Kalum → **Test and release → App integrity → App signing**.
- Copy **both** SHA-256 fingerprints shown there: the **App signing key
  certificate** and the **Upload key certificate**.
- **Paste both to me.**
- **Unlocks:** `assetlinks.json` (Digital Asset Links).
- **Then I:** create `public/.well-known/assetlinks.json` for package
  `app.kalum.mobile` with both fingerprints. Full link-handling also needs the
  app to ship `autoVerify` intent filters (app-team change).

### 6. iOS Associated Domains entitlement — unlocks Universal Links
- App team adds the **`associated-domains`** entitlement in Xcode with
  `applinks:kalum.app`, then ships an app release.
- **Tell me when it's in a release** (Team ID `485TFXLF7Q` and bundle
  `app.kalum.mobile` are already captured).
- **Then I:** create `public/.well-known/apple-app-site-association` and
  verify Apple's CDN accepts it from GitHub Pages (drop it if rejected — no
  header workarounds possible on Pages).

---

## Optional

### 7. Native-Spanish review of the `/es/` pages
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
