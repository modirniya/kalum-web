/**
 * The outbound-from-the-Gulf corridor pages, and what they connect.
 *
 * These pages serve a different intent from `/call/{slug}/`: not "what does it
 * cost to call there" but "I am *here* and my calls to *there* will not go
 * through". They were shipped 2026-08-08 and then left almost unlinked, and
 * URL Inspection on 2026-09-02 showed what that costs:
 *
 *   /call-pakistan-from-uae/   1 inbound link    NEVER CRAWLED (25 days live)
 *   /call-india-from-uae/      1 inbound link    last crawled 23 days ago
 *   /call-from-uae/            2 inbound links   last crawled 23 days ago
 *
 * A full sweep of all 50 sitemap URLs the same day found what link count does
 * and does not explain. It explains the orphans, and only the orphans: every
 * page carrying four inbound links or fewer was 23 days stale or had never
 * been crawled at all. Above roughly seven links it stops predicting anything
 * — /call/india/ and /call/nigeria/ both carry 43 inbound links and sit at 40
 * and 35 days, while /call/turkey/ carries the same 43 and is crawled daily.
 * Whatever sets cadence up there, it is not internal links.
 *
 * So the rule this file encodes is narrow and worth stating narrowly: a page
 * that almost nothing links to does not get crawled. /call-pakistan-from-uae/
 * hung off exactly one link, from a page itself crawled monthly, and Googlebot
 * never arrived — it is a 200, it self-canonicals, it is in the sitemap, and
 * it does not exist as far as Search is concerned.
 *
 * This table exists so the cross-links are generated from one place instead of
 * hand-written per page, which is how they got missed the first time. Adding a
 * corridor here links it from its origin destination page, its target
 * destination page, and the Gulf explainer — the last of which matters most,
 * because it is footer-linked sitewide and therefore crawled daily. Crawl
 * discovery follows links from frequently-crawled pages; one link from a daily
 * page is worth more than several from monthly ones.
 *
 * Deliberately NOT wired into the footer. A sitewide "Calling from the UAE"
 * link would give these pages ~43 inbound each, but the roadmap's positioning
 * note is explicit that the site reads as a general international provider
 * rather than a diaspora-first one, and three UAE-specific links on every
 * Spanish page about Honduras is exactly the drift it warns about. The hub
 * that IS footer-linked carries them instead.
 */
export interface Corridor {
  /** Path of the corridor page. Must match a route and the sitemap entry. */
  path: string;
  /** `destinations.ts` slug for where the caller is. */
  fromSlug: string;
  /**
   * `destinations.ts` slug for who they are calling, or null for the
   * country-agnostic hub page that covers the origin as a whole.
   */
  toSlug: string | null;
  /** Link text wherever this corridor is cross-linked. Sentence case. */
  label: string;
  /** One line of context under the label in card layouts. */
  blurb: string;
}

export const corridors: Corridor[] = [
  {
    path: "/call-from-uae/",
    fromSlug: "uae",
    toSlug: null,
    label: "Calling abroad from the UAE",
    blurb:
      "Dial any landline or mobile worldwide from the UAE, without placing an internet call.",
  },
  {
    path: "/call-india-from-uae/",
    fromSlug: "uae",
    toSlug: "india",
    label: "Call India from the UAE",
    blurb:
      "Indian landlines and mobiles, dialled directly — nothing to install on their end.",
  },
  {
    path: "/call-pakistan-from-uae/",
    fromSlug: "uae",
    toSlug: "pakistan",
    label: "Call Pakistan from the UAE",
    blurb:
      "Pakistani landlines and mobiles, dialled directly — nothing to install on their end.",
  },
];

/** Corridors that start in this destination (i.e. the caller is there). */
export const corridorsFrom = (slug: string): Corridor[] =>
  corridors.filter((c) => c.fromSlug === slug);

/** Corridors that end in this destination (i.e. they are calling there). */
export const corridorsTo = (slug: string): Corridor[] =>
  corridors.filter((c) => c.toSlug === slug);
