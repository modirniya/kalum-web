#!/usr/bin/env node
/**
 * Refreshes the committed rate snapshot from the live rate card.
 *
 * Run by .github/workflows/refresh-rates.yml on a schedule. The build itself
 * fetches the card too (src/lib/rates.ts) — this script exists for the two
 * things a build cannot do: keep a last-good copy on disk for the build to
 * fall back to, and remember WHICH destinations changed, so the sitemap can
 * bump only those pages instead of crying "updated!" on every redeploy.
 *
 * Plain Node, no dependencies, so the workflow needs no npm install.
 *
 * Writes (only when something actually changed):
 *   src/data/rates.json         — the new card
 *   src/data/rate-changes.json  — dial code → date its rate last moved
 *
 * Exit codes: always 0 unless a write fails. An unreachable API is a normal
 * outcome here, not a failure — the site keeps building from the last good
 * snapshot, which is the whole point of committing one.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RATES_FILE = join(ROOT, "src/data/rates.json");
const CHANGES_FILE = join(ROOT, "src/data/rate-changes.json");

const URL_ = process.env.KALUM_RATES_URL?.trim() ||
  "https://kalum-api.fly.dev/api/public/rates";

/** GitHub Actions surfaces these in the run summary. */
function warn(message) {
  console.log(`::warning::${message}`);
}

function toCents(value) {
  return Math.round(parseFloat(String(value)) * 100);
}

/** dial code → cents, skipping rows that could not produce an honest price. */
function centsByDialCode(rows) {
  const map = new Map();
  for (const row of rows ?? []) {
    const dialCode = String(row?.country_code ?? "").trim();
    const cents = toCents(row?.rate_per_minute);
    if (!dialCode || !Number.isFinite(cents) || cents <= 0) continue;
    map.set(dialCode, cents);
  }
  return map;
}

const previous = JSON.parse(readFileSync(RATES_FILE, "utf8"));

let live;
try {
  const res = await fetch(URL_, {
    headers: { "User-Agent": "kalum-web refresh-rates" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  live = await res.json();
} catch (err) {
  // 403 means the endpoint is still App Check gated; 503 is a maintenance
  // window. Either way there is nothing to commit and nothing to fix here.
  warn(`rate card unreachable at ${URL_} (${err.message}) — snapshot left as is`);
  process.exit(0);
}

const nextRates = Array.isArray(live?.rates) ? live.rates : [];
const nextCents = centsByDialCode(nextRates);
if (nextCents.size === 0) {
  warn(`${URL_} returned no usable rate rows — snapshot left as is`);
  process.exit(0);
}

const prevCents = centsByDialCode(previous.rates);
const changed = [];
for (const [dialCode, cents] of nextCents) {
  if (prevCents.get(dialCode) !== cents) changed.push(dialCode);
}
const removed = [...prevCents.keys()].filter((code) => !nextCents.has(code));

const basisChanged = String(live?.basis ?? "from") !== previous.basis;

if (changed.length === 0 && removed.length === 0 && !basisChanged) {
  console.log(`No rate changes (${nextCents.size} destinations checked).`);
  process.exit(0);
}

// Timestamp the card, not the run: this date is printed on every rate page as
// "updated {date}", so it has to mean "when these numbers were read".
const fetchedAt = new Date().toISOString();
const today = fetchedAt.slice(0, 10);

writeFileSync(
  RATES_FILE,
  JSON.stringify(
    {
      note: previous.note,
      source: "live",
      fetchedAt,
      basis: String(live?.basis ?? "from"),
      rates: nextRates,
    },
    null,
    2
  ) + "\n"
);

const changes = JSON.parse(readFileSync(CHANGES_FILE, "utf8"));
for (const dialCode of changed) changes[dialCode] = today;
writeFileSync(CHANGES_FILE, JSON.stringify(changes, null, 2) + "\n");

console.log(
  `Rate card updated: ${changed.length} changed, ${removed.length} removed, ` +
    `${nextCents.size} total, basis=${live?.basis}.`
);
if (changed.length > 0) console.log(`Changed dial codes: ${changed.join(", ")}`);
if (removed.length > 0) {
  // A destination that vanishes from the card loses its page on the next
  // build (pricedDestinations drops it), which is a bigger deal than a price
  // move and worth a human look.
  warn(`dial codes no longer in the rate card: ${removed.join(", ")}`);
}
