// Single source of truth for app-store identity and install attribution.
// Badges and structured data both import from here so the store URLs can
// never drift apart again.

export const APPLE_APP_ID = "6763210844";
/** Apple slug — verified against the App Store lookup API. Cosmetic (Apple
 * redirects any slug to canonical), but kept correct for clean sameAs. */
export const APPLE_APP_SLUG = "kalum-call-abroad-over-wifi";
export const ANDROID_PACKAGE = "app.kalum.mobile";

// Apple App Analytics provider token — App Store Connect > Analytics >
// Campaigns > (the numeric provider id in the generated campaign link).
// EMPTY until the owner fills it in. While empty, App Store links ship
// clean: Apple ignores utm_source, so there is no attribution to add and a
// bare listing URL is the honest form. Set this and every badge instantly
// carries per-placement campaign attribution — no other change needed.
export const APPLE_PROVIDER_TOKEN = "";

const APPLE_BASE = `https://apps.apple.com/us/app/${APPLE_APP_SLUG}/id${APPLE_APP_ID}`;
const PLAY_BASE = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

/** Clean canonical listing URLs — for sameAs / installUrl in structured data.
 * Never carry tracking params. */
export const storeUrls = [APPLE_BASE, PLAY_BASE];

/**
 * App Store link. With a provider token, emits an App Analytics campaign
 * link (?pt=&ct=&mt=8) so installs attribute to the placement; without one,
 * the bare listing URL. `ct` (campaign text) is capped at Apple's 40 chars.
 */
export function appleHref(utm: string): string {
  if (!APPLE_PROVIDER_TOKEN) return APPLE_BASE;
  const ct = encodeURIComponent(utm.slice(0, 40));
  return `${APPLE_BASE}?pt=${APPLE_PROVIDER_TOKEN}&ct=${ct}&mt=8`;
}

/**
 * Google Play link with an install referrer. Play Console attributes the
 * install to these utm values (Acquisition reports), and the app's native
 * firebase-analytics SDK auto-collects the same referrer as campaign
 * attribution on first open — no app-side code required.
 */
export function playHref(utm: string): string {
  const referrer = `utm_source=kalum-web&utm_medium=web&utm_campaign=${utm}`;
  return `${PLAY_BASE}&referrer=${encodeURIComponent(referrer)}`;
}
