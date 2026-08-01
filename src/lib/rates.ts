import snapshot from "../data/rates.json";
import { destinations, featuredSlugs, type Destination } from "./destinations";

/**
 * Build-time rate card.
 *
 * Every per-minute figure on this site is fetched from the backend's live rate
 * card while `astro build` runs and baked into the emitted HTML — the same
 * pattern as `fetchLegal()`, and for the same reason: a number injected by
 * client-side JS is invisible to the crawlers these pages exist to serve. If a
 * rate is not in view-source, it does not count. Nothing here may ever move to
 * the browser.
 *
 * It differs from `fetchLegal()` in one deliberate way: this FAILS OPEN. A
 * legal page with no body is worth aborting a deploy over; a marketing deploy
 * blocked because the API had a bad minute is not. On any failure the build
 * falls back to the committed snapshot in `src/data/rates.json` and says so in
 * the log, so the site keeps shipping prices — the last known-good ones.
 */

/** Public rate card, no App Check token required. See kalum-backend router. */
const DEFAULT_RATES_URL = "https://kalum-api.fly.dev/api/public/rates";

/** Enough for a cold Fly machine; short enough not to stall a deploy. */
const TIMEOUT_MS = 10_000;

/**
 * How a rate figure may be phrased.
 *
 *  - `"from"` — prefix pricing: the row is the country's CHEAPEST prefix, so
 *    mobile and landline there can differ. Copy must read "from 6¢/min" and
 *    must not claim one rate covers both. This is what production returns.
 *  - `"flat"` — the row is *the* price for that country.
 *
 * Anything unrecognised is treated as `"from"`: under-claiming is safe, and
 * rendering a "from" figure as flat is the one failure that would let this
 * site contradict the price the app quotes before a call.
 */
export type RateBasis = "from" | "flat";

/** One destination's rate, normalised for the site. */
export interface RateRow {
  /** E.164 country calling code, no plus — matches `Destination.dialCode`. */
  dialCode: string;
  /** Country name as the rate table spells it. Display comes from the
   *  curated `Destination`, not from here. */
  name: string;
  /** Per-minute price in whole US cents. */
  rateCents: number;
}

export interface RateCard {
  rates: RateRow[];
  basis: RateBasis;
  /** ISO timestamp this card was obtained — drives every "rate as of" line. */
  fetchedAt: string;
  /** False when the build fell back to the committed snapshot. */
  live: boolean;
}

/** A curated destination with its rate resolved for this build. */
export type PricedDestination = Destination & { rateCents: number };

/** Raw row shape as the API serialises it. */
interface ApiRateRow {
  country_code: string;
  country_name: string;
  /** Decimal USD per minute serialised as a STRING, e.g. "0.06". */
  rate_per_minute: string;
}

/** Env var, treating "" as unset — CI passes empty strings for unset vars. */
function envVar(name: string): string | undefined {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env;
  const value = env?.[name];
  return value && value.trim() !== "" ? value.trim() : undefined;
}

function normalizeBasis(value: unknown): RateBasis {
  return value === "flat" ? "flat" : "from";
}

/**
 * Rows → cents. Drops anything unusable rather than letting a bad row reach a
 * page: a missing dial code, an unparseable decimal, or a non-positive price
 * would otherwise render as `undefined`/`$0.00` next to a call-to-action.
 */
function normalizeRows(rows: unknown): RateRow[] {
  if (!Array.isArray(rows)) return [];

  const out: RateRow[] = [];
  for (const row of rows as ApiRateRow[]) {
    const dialCode = String(row?.country_code ?? "").trim();
    const cents = Math.round(parseFloat(String(row?.rate_per_minute)) * 100);
    if (!dialCode || !Number.isFinite(cents) || cents <= 0) continue;
    out.push({ dialCode, name: String(row?.country_name ?? ""), rateCents: cents });
  }
  return out;
}

/** The committed last-good card, used whenever the live fetch can't be trusted. */
export function snapshotCard(): RateCard {
  return {
    rates: normalizeRows(snapshot.rates),
    basis: normalizeBasis(snapshot.basis),
    fetchedAt: snapshot.fetchedAt,
    live: false,
  };
}

async function fetchRatesUncached(url: string): Promise<RateCard> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "kalum-web build" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      // 403 = App Check still gating this URL, 503 = maintenance window,
      // 429 = per-IP flood limit. All of them mean "use the snapshot".
      throw new Error(`${res.status} ${res.statusText}`);
    }

    const body = (await res.json()) as { rates?: unknown; basis?: unknown };
    const rates = normalizeRows(body.rates);
    if (rates.length === 0) {
      throw new Error("response carried no usable rate rows");
    }

    return {
      rates,
      basis: normalizeBasis(body.basis),
      fetchedAt: new Date().toISOString(),
      live: true,
    };
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    const fallback = snapshotCard();
    if (fallback.rates.length === 0) {
      // Neither a live card nor a usable snapshot: there is no honest page to
      // render, so fail the build rather than ship a site with no prices.
      throw new Error(
        `fetchRates: ${url} failed (${reason}) and src/data/rates.json is empty or malformed`
      );
    }
    console.warn(
      `[rates] ${url} failed (${reason}) — falling back to the committed ` +
        `snapshot from ${fallback.fetchedAt}. Pages will build with last-good rates.`
    );
    return fallback;
  }
}

let cached: Promise<RateCard> | undefined;

/**
 * The rate card for this build. Fetched once per build and shared by every
 * page — `astro build` renders all pages in one process, so without this the
 * card would be re-fetched ~40 times.
 *
 * Override the URL with `KALUM_RATES_URL`, or set `KALUM_RATES_OFFLINE=1` to
 * skip the network entirely (local dev, and the workflow step that rebuilds to
 * verify a snapshot).
 */
export function fetchRates(url?: string): Promise<RateCard> {
  if (!cached) {
    if (envVar("KALUM_RATES_OFFLINE")) {
      const offline = snapshotCard();
      console.warn(
        `[rates] KALUM_RATES_OFFLINE set — building from the committed ` +
          `snapshot (${offline.fetchedAt}), no live fetch.`
      );
      cached = Promise.resolve(offline);
    } else {
      cached = fetchRatesUncached(url ?? envVar("KALUM_RATES_URL") ?? DEFAULT_RATES_URL);
    }
  }
  return cached;
}

/**
 * A destination's rate, or null if the feed has no row for its dial code.
 *
 * Exact match on the dial code — no longest-prefix logic, because the curated
 * list has no `+1` (NANP) destinations, where `1` alone would be ambiguous
 * between the US, Canada and the Caribbean. Adding one means adding that
 * matching first.
 */
export function rateCentsForDialCode(card: RateCard, dialCode: string): number | null {
  const row = card.rates.find((r) => r.dialCode === dialCode);
  return row ? row.rateCents : null;
}

/**
 * The curated destinations with this build's rates attached.
 *
 * A destination whose dial code is in neither the live card nor the snapshot is
 * DROPPED — it loses its page and its links rather than rendering a blank price
 * beside a "download the app" button. That is a loud, visible failure by
 * design; the warning names the slug to fix.
 */
export async function pricedDestinations(): Promise<{
  card: RateCard;
  priced: PricedDestination[];
}> {
  const card = await fetchRates();
  const priced: PricedDestination[] = [];

  for (const d of destinations) {
    const rateCents = rateCentsForDialCode(card, d.dialCode);
    if (rateCents === null) {
      console.warn(
        `[rates] no rate for /call/${d.slug}/ (+${d.dialCode}) in the ${
          card.live ? "live card" : "committed snapshot"
        } — the page will not be built. Add the row to src/data/rates.json or ` +
          `drop the destination.`
      );
      continue;
    }
    priced.push({ ...d, rateCents });
  }

  return { card, priced };
}

/** Featured corridors, priced, in `featuredSlugs` display order. */
export async function featuredPricedDestinations(): Promise<{
  card: RateCard;
  priced: PricedDestination[];
}> {
  const { card, priced } = await pricedDestinations();
  return {
    card,
    priced: featuredSlugs
      .map((slug) => priced.find((d) => d.slug === slug))
      .filter((d): d is PricedDestination => Boolean(d)),
  };
}

/** Priced destinations where internet-app voice calls are commonly restricted. */
export async function voipRestrictedPricedDestinations(): Promise<{
  card: RateCard;
  priced: PricedDestination[];
}> {
  const { card, priced } = await pricedDestinations();
  return { card, priced: priced.filter((d) => d.voipRestricted) };
}

/** One priced destination, or undefined if it has no rate this build. */
export async function pricedDestination(
  slug: string
): Promise<{ card: RateCard; destination: PricedDestination | undefined }> {
  const { card, priced } = await pricedDestinations();
  return { card, destination: priced.find((d) => d.slug === slug) };
}

/** Display form: "6¢" under a dollar, "$1.10" at or above it. */
export function formatRate(rateCents: number): string {
  return rateCents >= 100 ? `$${(rateCents / 100).toFixed(2)}` : `${rateCents}¢`;
}

/**
 * The word that has to precede a price under prefix pricing.
 *
 * Under `basis: "from"` a country has no single price, so every figure on the
 * site is a floor. `"from 6¢/min"` is honest; `"6¢/min"` is not.
 */
export function fromPrefix(basis: RateBasis, locale: "en" | "es" = "en"): string {
  if (basis !== "from") return "";
  return locale === "es" ? "desde " : "from ";
}

/** Sentence-case "From "/"Desde " for line starts. */
export function fromPrefixCapitalized(
  basis: RateBasis,
  locale: "en" | "es" = "en"
): string {
  const prefix = fromPrefix(basis, locale);
  return prefix ? prefix.charAt(0).toUpperCase() + prefix.slice(1) : "";
}

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTHS_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/**
 * "July 31, 2026" / "31 de julio de 2026" from an ISO timestamp.
 *
 * Formatted from the UTC parts with a hand-written month table rather than
 * `Intl` — the date is printed beside a price, so it must not shift by a day
 * with the build machine's timezone or depend on the runner's ICU build.
 */
export function formatRatesAsOf(iso: string, locale: "en" | "es" = "en"): string {
  const d = new Date(iso);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const day = d.getUTCDate();
  return locale === "es"
    ? `${day} de ${MONTHS_ES[month]} de ${year}`
    : `${MONTHS_EN[month]} ${day}, ${year}`;
}

/** "2026-07-31" from an ISO timestamp — sitemap `lastmod` form. */
export function isoDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}
