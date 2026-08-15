import type { RateCard } from "./rates";
import { destinations } from "./destinations";

/**
 * The rate finder's wire format: `[dialCode, displayName, rateCents]`.
 *
 * A tuple rather than an object because this array is inlined into the page
 * for every visitor. All 218 destinations weigh ~5 KB raw and ~2.3 KB gzipped
 * in this shape; the same data as objects is roughly four times that, for no
 * benefit — nothing reads these by key.
 */
export type FinderRow = [dialCode: string, name: string, rateCents: number];

/**
 * Build the finder's payload from the rate card.
 *
 * The card is the same one the static prices on the page are rendered from,
 * so the finder can never disagree with the destination grid beside it.
 *
 * `localNames` maps a dial code to a translated country name. Only the
 * curated destinations have translations, so on the Spanish page the ~187
 * uncurated countries keep the card's English spelling rather than dropping
 * out of the list — a visitor searching for a country we price should always
 * find it, even if we have not translated its name yet.
 */
export function finderRows(
  card: RateCard,
  localNames: Record<string, string> = {}
): FinderRow[] {
  const seen = new Set<string>();
  const rows: FinderRow[] = [];

  for (const r of card.rates) {
    // The card is keyed by dial code; a duplicate would render twice and be
    // counted twice. Keep the first, which is the cheapest after the API's
    // own ordering.
    if (seen.has(r.dialCode)) continue;
    seen.add(r.dialCode);
    rows.push([r.dialCode, localNames[r.dialCode] ?? r.name, r.rateCents]);
  }

  return rows.sort((a, b) => a[1].localeCompare(b[1]));
}

/**
 * Dial code → translated name, for the curated destinations that have one.
 *
 * `esNames` is keyed by slug (that is how the Spanish page stores it), so this
 * re-keys it by dial code, which is what the finder matches on.
 */
export function localNamesByDialCode(
  namesBySlug: Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = {};

  for (const d of destinations) {
    const name = namesBySlug[d.slug];
    if (name) out[d.dialCode] = name;
  }

  return out;
}
