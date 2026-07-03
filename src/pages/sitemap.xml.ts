import type { APIRoute } from "astro";
import { destinations } from "../lib/destinations";

// Generated sitemap — canonical, indexable URLs only:
//  - /call-mexico/ is noindex (paid-traffic LP), deliberately excluded.
//  - /privacy/ and /terms/ canonicalize to legal.neuera.app, excluded so the
//    sitemap never lists a URL whose canonical points elsewhere.
// lastmod is set per page below (NOT the build date — the weekly cron
// redeploy must not bump it); update a page's date when its content
// meaningfully changes.

const SITE = "https://kalum.app";

const DESTINATIONS_LAUNCHED = "2026-07-02";

const pages: { path: string; lastmod: string }[] = [
  { path: "/", lastmod: "2026-07-02" },
  { path: "/how-it-works/", lastmod: "2026-07-02" },
  { path: "/support/", lastmod: "2026-07-02" },
  { path: "/call/", lastmod: DESTINATIONS_LAUNCHED },
  ...destinations.map((d) => ({
    path: `/call/${d.slug}/`,
    lastmod: DESTINATIONS_LAUNCHED,
  })),
];

export const GET: APIRoute = () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${SITE}${p.path}</loc>
    <lastmod>${p.lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
