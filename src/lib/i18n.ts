// Locale plumbing for every non-English page. Static only — no
// Accept-Language or geo redirects (transparency: bots and users get the
// same content). Adding a page here is what wires its hreflang alternates
// and the header/footer language switch; keep the group's paths in lockstep.
//
// Two shapes of locale live here and the distinction matters:
//
//   /es/   is a TREE — a home, a how-it-works, a hub, destination pages.
//   /ar/ /tr/ /hi/ /ur/ /bn/ /tl/ /vi/ /id/ /pt/ are SINGLE PAGES — one URL each, a
//          translation of /call-without-internet/ and nothing else.
//
// The single-page locales exist because that page is the only non-brand intent
// on the site that beats the average click-through (3.7% against 0.88% over
// the three months to 2026-08-30), in both languages it had been tried in.
// The person you call needs no app, no smartphone and no internet — a claim no
// rival rate page can copy, and one that reads the same to a Cairo landline as
// to a Manila keypad phone. Translating the destination tree instead would have
// meant 31 rate-led pages per language in the intent the site loses; one page
// per language in the intent it wins is the whole bet. See Phase 9 in
// docs/visibility-roadmap.md.

const SITE = "https://kalum.app";

export type Locale = "en" | "es" | "ar" | "tr" | "hi" | "ur" | "bn" | "tl" | "vi" | "id" | "pt";

export interface LocaleMeta {
  /** Endonym — how the language names itself, for switchers and language bars. */
  name: string;
  dir: "ltr" | "rtl";
  /** For og:locale. */
  ogLocale: string;
  /**
   * CSS font stack override, or null to inherit the site face. Plus Jakarta
   * Sans has no Arabic, Devanagari or Bengali glyphs, so those scripts get a
   * Noto face; it does carry a Vietnamese subset, so vi stays on the house
   * font. Urdu gets Nastaliq rather than Naskh because that is what Urdu
   * readers expect a page to look like — Naskh Urdu reads as "typed in
   * Arabic". The stacks are declared in src/styles/global.css.
   */
  font: "arabic" | "nastaliq" | "devanagari" | "bengali" | null;
}

export const LOCALES: Record<Locale, LocaleMeta> = {
  en: { name: "English", dir: "ltr", ogLocale: "en_US", font: null },
  es: { name: "Español", dir: "ltr", ogLocale: "es_MX", font: null },
  ar: { name: "العربية", dir: "rtl", ogLocale: "ar_AE", font: "arabic" },
  tr: { name: "Türkçe", dir: "ltr", ogLocale: "tr_TR", font: null },
  hi: { name: "हिन्दी", dir: "ltr", ogLocale: "hi_IN", font: "devanagari" },
  ur: { name: "اردو", dir: "rtl", ogLocale: "ur_PK", font: "nastaliq" },
  bn: { name: "বাংলা", dir: "ltr", ogLocale: "bn_BD", font: "bengali" },
  tl: { name: "Tagalog", dir: "ltr", ogLocale: "tl_PH", font: null },
  vi: { name: "Tiếng Việt", dir: "ltr", ogLocale: "vi_VN", font: null },
  // Brazilian Portuguese: Brazil is ~4x Portugal in Search Console, and the
  // hreflang stays the bare "pt" so a reader in Portugal is still matched.
  id: { name: "Bahasa Indonesia", dir: "ltr", ogLocale: "id_ID", font: null },
  pt: { name: "Português", dir: "ltr", ogLocale: "pt_BR", font: null },
};

/** Display order for language bars: house languages first, then by script. */
export const LOCALE_ORDER: Locale[] = ["en", "es", "ar", "tr", "hi", "ur", "bn", "tl", "vi", "id", "pt"];

export interface Alternate {
  hreflang: string;
  href: string;
}

/**
 * Pages that exist in more than one language, one row per page. A row lists
 * only the locales whose version actually exists and is fully translated —
 * title, meta description, body, FAQ (and its schema), nav, alt text. A locale
 * listed here emits a hreflang alternate and turns the language switch into a
 * direct link, so a half-translated entry would send readers and crawlers to
 * a missing or English page.
 *
 * The English path is the group's identity and its x-default.
 */
export const localizedGroups: Partial<Record<Locale, string>>[] = [
  { en: "/", es: "/es/" },
  { en: "/how-it-works/", es: "/es/how-it-works/" },
  {
    en: "/call-without-internet/",
    es: "/es/call-without-internet/",
    ar: "/ar/call-without-internet/",
    tr: "/tr/call-without-internet/",
    hi: "/hi/call-without-internet/",
    ur: "/ur/call-without-internet/",
    bn: "/bn/call-without-internet/",
    tl: "/tl/call-without-internet/",
    vi: "/vi/call-without-internet/",
    id: "/id/call-without-internet/",
    pt: "/pt/call-without-internet/",
  },
  { en: "/call/", es: "/es/call/" },
  { en: "/call/mexico/", es: "/es/call/mexico/" },
  { en: "/call/colombia/", es: "/es/call/colombia/" },
  { en: "/call/guatemala/", es: "/es/call/guatemala/" },
  { en: "/call/honduras/", es: "/es/call/honduras/" },
  { en: "/call/el-salvador/", es: "/es/call/el-salvador/" },
];

/** The group a path belongs to, in any of its languages, or undefined. */
export function groupFor(path: string) {
  return localizedGroups.find((g) => Object.values(g).includes(path));
}

/** Which locale a path is in, from its first segment. Unknown prefixes are English. */
export function localeOf(path: string): Locale {
  const seg = path.split("/")[1];
  return seg && seg in LOCALES && seg !== "en" ? (seg as Locale) : "en";
}

/**
 * hreflang alternates for a page — every language it exists in, plus
 * x-default → English — or undefined if the page has no localized
 * counterpart. Accepts the path in any of its languages.
 */
export function alternatesFor(path: string): Alternate[] | undefined {
  const group = groupFor(path);
  if (!group || !group.en) return undefined;
  const alts: Alternate[] = LOCALE_ORDER.filter((l) => group[l]).map((l) => ({
    hreflang: l,
    href: `${SITE}${group[l]}`,
  }));
  alts.push({ hreflang: "x-default", href: `${SITE}${group.en}` });
  return alts;
}

/**
 * The header's single language link. On a non-English page it always offers
 * English (every localized page has an English original). On an English page
 * it offers Spanish, the one locale with a whole tree to land in; the other
 * languages exist for exactly one page, and that page carries its own full
 * language bar (LanguageBar.astro) rather than crowding the header with seven
 * links on every page of the site.
 *
 * Falls back to the other language's home when the page has no counterpart,
 * so the switch always goes somewhere sensible — never a 404.
 */
export function languageSwitch(path: string): { label: string; href: string; hreflang: Locale } {
  const here = localeOf(path);
  const group = groupFor(path);
  if (here !== "en") {
    return { label: "EN", href: group?.en ?? "/", hreflang: "en" };
  }
  return { label: "ES", href: group?.es ?? "/es/", hreflang: "es" };
}
