// Locale plumbing for the /es/ Spanish subtree. Static only — no
// Accept-Language or geo redirects (transparency: bots and users get the
// same content). Adding a page here is what wires its hreflang alternates
// and the header/footer language switch; keep EN and ES paths in lockstep.

const SITE = "https://kalum.app";

export interface Alternate {
  hreflang: string;
  href: string;
}

/**
 * EN <-> ES page pairs that have full, human-quality localized equivalents.
 * Only list a pair once BOTH pages exist and are fully translated — a pair
 * here emits bidirectional hreflang and turns the language switch into a
 * direct link, so a half-translated entry would point users at a missing or
 * English page.
 */
export const localizedPairs: { en: string; es: string }[] = [
  { en: "/", es: "/es/" },
  { en: "/call-without-internet/", es: "/es/call-without-internet/" },
  { en: "/call/mexico/", es: "/es/call/mexico/" },
];

/**
 * hreflang alternates (en, es, and x-default → English) for a page, or
 * undefined if the page has no localized counterpart. Accepts either the EN
 * or the ES path.
 */
export function alternatesFor(path: string): Alternate[] | undefined {
  const pair = localizedPairs.find((p) => p.en === path || p.es === path);
  if (!pair) return undefined;
  return [
    { hreflang: "en", href: `${SITE}${pair.en}` },
    { hreflang: "es", href: `${SITE}${pair.es}` },
    { hreflang: "x-default", href: `${SITE}${pair.en}` },
  ];
}

/**
 * The counterpart path in the other language for the header/footer switch.
 * If the current page is a known pair, returns its opposite; otherwise falls
 * back to the other language's home (so the switch always goes somewhere
 * sensible, never a 404).
 */
export function languageSwitch(path: string): { label: string; href: string } {
  const isES = path === "/es/" || path.startsWith("/es/");
  const pair = localizedPairs.find((p) => p.en === path || p.es === path);
  if (pair) {
    return isES
      ? { label: "EN", href: pair.en }
      : { label: "ES", href: pair.es };
  }
  return isES ? { label: "EN", href: "/" } : { label: "ES", href: "/es/" };
}
