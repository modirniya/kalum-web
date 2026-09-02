import type { APIRoute } from "astro";
import { pricedDestinations } from "../lib/rates";
import rateChanges from "../data/rate-changes.json";
import { alternatesFor } from "../lib/i18n";

// Generated sitemap — canonical, indexable URLs only:
//  - /call-mexico/ is noindex (paid-traffic LP), deliberately excluded.
//  - /privacy/ and /terms/ canonicalize to legal.neuera.app, excluded so the
//    sitemap never lists a URL whose canonical points elsewhere.
// lastmod is set per page below (NOT the build date — the weekly cron
// redeploy must not bump it); update a page's date when its content
// meaningfully changes.
// Localized pages carry xhtml:link hreflang alternates (from alternatesFor),
// listed on every URL in the language group per Google's guidance.

const SITE = "https://kalum.app";

// 2026-07-20: app-keyword homepage copy, rates explainer on /call/, dialing
// format blocks on destination pages, evergreen pages, and the /es/ locale.
const SEO_CONTENT_UPDATE = "2026-07-20";

/**
 * Rate pages get a later lastmod than SEO_CONTENT_UPDATE only when their own
 * rate actually moved — the dates come from src/data/rate-changes.json, which
 * the refresh workflow updates when it commits a new card.
 *
 * Only pages ABOUT a rate move: /call/{slug}/, the hub, and the Spanish Mexico
 * page. The homepage and the evergreen explainers carry a rate strip too, but
 * a repriced corridor is not a meaningful update to those pages, and bumping
 * every URL on every rate change is the same cry-wolf this file exists to
 * avoid.
 */
const changeDates = rateChanges as Record<string, string>;

/**
 * 2026-09-01: the snippet rewrite.
 *
 * Supersedes the 2026-08-08 copy-change stamp, whose own note said to delete
 * it once the affected pages had been recrawled. They were — the Search
 * Console window ending 2026-08-30 is measuring those titles.
 *
 * What changed, and why it is a real content change rather than the cry-wolf
 * this file exists to prevent: every destination page got a new title, a new
 * meta description built from a new `numberFormat` field, and a new H2 section
 * lifted above "How to call" so the dialing format leads the page. That window
 * showed these pages holding positions 6-13 on `call turkey`, `call omani`,
 * `call bahrain` and `call ethiopia` and taking zero clicks, while ranking
 * top-ten on `010 egypt number`, `jordan phone number format` and `turkey
 * mobile number digits` with nothing in the snippet that answered them.
 *
 * 2026-09-02 covers a second pass the same UTC day: the from-UAE corridor
 * cluster was effectively orphaned — one inbound link each, and URL Inspection
 * showed /call-pakistan-from-uae/ had never been crawled at all — so it is now
 * cross-linked from its origin and target destination pages and from the Gulf
 * explainer. See src/lib/corridors.ts.
 *
 * Dates here are UTC, not local. The first pass was stamped 2026-09-01 from a
 * local clock while the deploy actually landed at 2026-09-02T04:14Z, which
 * would also have hidden it from the scheduled IndexNow run — that path
 * compares lastmod against the UTC date and would never have matched.
 *
 * Delete this once these pages have been recrawled.
 */
const SNIPPET_REWRITE = "2026-09-02";

/**
 * 2026-08-16: the rate finder shipped onto both homepages and both /call/
 * hubs, and the destination-count claim was corrected sitewide — "180+"
 * against 218 actually sellable — which rewrote four meta descriptions and
 * several FAQ answers (body copy *and* their FAQPage schema).
 *
 * Applied only to the pages whose own content meaningfully changed, verified
 * by diffing the built output before and after rather than by assuming.
 *
 * The 31 `/call/<slug>/` pages are deliberately EXCLUDED. Their entire diff is
 * the shared footer blurb, `og:image:alt`, and one word in a closing CTA
 * sentence; title, H1, meta description and rate are all unchanged. Restamping
 * 31 URLs for that is exactly the cry-wolf this file exists to avoid, and it
 * would bury the nine pages that genuinely changed. `/whatsapp-calls-blocked/`
 * and the from-UAE cluster are excluded for the same reason.
 */
const FINDER_AND_COUNT = "2026-08-16";

/** The later of two ISO dates. */
const later = (a: string, b: string) => (a > b ? a : b);

function rateLastmod(dialCode: string): string {
  const changed = changeDates[dialCode];
  const rateDate = changed && changed > SEO_CONTENT_UPDATE ? changed : SEO_CONTENT_UPDATE;
  return rateDate > SNIPPET_REWRITE ? rateDate : SNIPPET_REWRITE;
}

export const GET: APIRoute = async () => {
  // Same source the pages build from, so the sitemap can never list a
  // destination page that was not emitted (a destination with no rate in the
  // card or the snapshot is dropped from both).
  const { priced } = await pricedDestinations();

  const mexico = priced.find((d) => d.slug === "mexico");
  const hubLastmod = priced
    .map((d) => rateLastmod(d.dialCode))
    .reduce((latest, date) => (date > latest ? date : latest), SEO_CONTENT_UPDATE);

  const pages: { path: string; lastmod: string }[] = [
    { path: "/", lastmod: FINDER_AND_COUNT },
    // Was 2026-08-08 for the hreflang pairing with /es/how-it-works/; now
    // later still, because its FAQ answer and that answer's FAQPage schema
    // both changed with the count correction.
    { path: "/how-it-works/", lastmod: FINDER_AND_COUNT },
    { path: "/support/", lastmod: "2026-07-02" },
    { path: "/call-without-internet/", lastmod: FINDER_AND_COUNT },
    { path: "/calling-app-vs-internet-calling/", lastmod: FINDER_AND_COUNT },
    // Retitled 2026-09-02: 43 of its 46 named-query impressions were "gulf
    // calling app" at position 8.5, and the title answered a WhatsApp question
    // instead. New title, description, H1 and breadcrumb label.
    { path: "/whatsapp-calls-blocked/", lastmod: SNIPPET_REWRITE },
    // Outbound-from-the-Gulf cluster (2026-08-08). /whatsapp-calls-blocked/
    // serves calling INTO a restricted market; these serve calling OUT of one,
    // which is the corridor shape competitors own and we had none of. Kept to
    // three deliberately — the 29 templated /call/ pages already show what
    // happens when this shape is mass-produced.
    { path: "/call-from-uae/", lastmod: SNIPPET_REWRITE },
    { path: "/call-india-from-uae/", lastmod: SNIPPET_REWRITE },
    { path: "/call-pakistan-from-uae/", lastmod: SNIPPET_REWRITE },
    { path: "/call/", lastmod: later(hubLastmod, SNIPPET_REWRITE) },
    ...priced.map((d) => ({
      path: `/call/${d.slug}/`,
      lastmod: rateLastmod(d.dialCode),
    })),
    // Spanish locale. Expanded 3 -> 9 pages on 2026-08-08: /es/ is the
    // highest-efficiency content on the site, ranking roughly twice as well
    // per page as English (position 11.4 overall, 8.1 on mobile, against an
    // English median of 20.7) — it was starved of pages, not underperforming.
    // The four added corridors are the Americas' remaining Spanish-speaking
    // destinations, i.e. the US-Hispanic diaspora routes.
    { path: "/es/", lastmod: FINDER_AND_COUNT },
    {
      path: "/es/call/mexico/",
      lastmod: mexico ? rateLastmod(mexico.dialCode) : SEO_CONTENT_UPDATE,
    },
    { path: "/es/call-without-internet/", lastmod: FINDER_AND_COUNT },
    { path: "/es/how-it-works/", lastmod: FINDER_AND_COUNT },
    { path: "/es/call/", lastmod: SNIPPET_REWRITE },
    ...(["colombia", "guatemala", "honduras", "el-salvador"] as const).map(
      (slug) => {
        const d = priced.find((p) => p.slug === slug);
        return {
          path: `/es/call/${slug}/`,
          lastmod: d ? rateLastmod(d.dialCode) : SNIPPET_REWRITE,
        };
      },
    ),
  ];

  const urls = pages
    .map((p) => {
      const alternates = alternatesFor(p.path);
      const links = alternates
        ? alternates
            .map(
              (a) =>
                `\n    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`,
            )
            .join("")
        : "";
      return `  <url>
    <loc>${SITE}${p.path}</loc>
    <lastmod>${p.lastmod}</lastmod>${links}
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
