const ARTICLE_RE =
  /<article\s+class="legal-document current-document"[\s\S]*?<\/article>/i;

export interface FetchedLegal {
  body: string;
  fetchedAt: string;
}

/**
 * Fetches a legal page from legal.neuera.app at build time, extracts the
 * <article class="legal-document current-document"> wrapper, and rewrites
 * cross-references onto kalum.app's /privacy and /terms paths.
 *
 * Throws on any non-2xx response or missing article so the build aborts
 * loudly rather than shipping an empty or stale page.
 */
export async function fetchLegal(url: string): Promise<FetchedLegal> {
  const res = await fetch(url, {
    headers: { "User-Agent": "kalum-web build" },
  });
  if (!res.ok) {
    throw new Error(
      `fetchLegal: ${url} returned ${res.status} ${res.statusText}`
    );
  }

  const html = await res.text();
  const match = html.match(ARTICLE_RE);
  if (!match) {
    throw new Error(
      `fetchLegal: could not find <article class="legal-document current-document"> in ${url}`
    );
  }

  let body = match[0];

  // Defense in depth: drop any inline <script> blocks or onclick handlers
  // that may appear inside the article in future revisions.
  body = body
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "");

  // Rewrite legal.neuera.app cross-references onto kalum.app paths.
  body = body
    .replace(/https:\/\/legal\.neuera\.app\/kalum\/privacy\/?/gi, "/privacy/")
    .replace(/https:\/\/legal\.neuera\.app\/kalum\/terms\/?/gi, "/terms/")
    .replace(/href="\/kalum\/privacy\/?"/gi, 'href="/privacy/"')
    .replace(/href="\/kalum\/terms\/?"/gi, 'href="/terms/"');

  // Send "version history" links back to the canonical archive on
  // legal.neuera.app — the relative ./archive.html href would otherwise
  // resolve to a 404 under kalum.app/privacy or kalum.app/terms. Done
  // after the kalum.app rewrites so the inserted absolute URL isn't
  // caught by the /kalum/privacy/ → /privacy rule above.
  const archiveUrl = url.replace(/\/$/, "") + "/archive.html";
  body = body.replace(/href="\.\/archive\.html"/gi, `href="${archiveUrl}"`);

  // The same link also appears ROOT-relative on some documents (the privacy
  // article carries `/kalum/privacy/archive.html`, terms carries only the
  // relative form). Root-relative resolves against kalum.app, so it 404s —
  // this was the site's only internal 404 until 2026-09-19. The `/kalum/...`
  // rules above cannot catch it: they require the closing quote right after
  // the trailing slash. Must stay AFTER those rules for the same reason the
  // block above does.
  body = body.replace(
    /href="\/kalum\/(privacy|terms)\/archive\.html"/gi,
    (_match, doc: string) =>
      `href="https://legal.neuera.app/kalum/${doc.toLowerCase()}/archive.html"`,
  );

  /**
   * Promote every heading one level.
   *
   * legal.neuera.app renders the document title as <h2> because the site's own
   * page furniture owns the <h1>. Lifted verbatim into a kalum.app page there
   * is no <h1> at all — the 2026-09-19 audit found both legal pages with none,
   * the only two on the site. The source hierarchy is a clean h2 -> h3 -> h4
   * (title, section, subsection), so shifting it up one gives the normal
   * h1 -> h2 -> h3 with no collisions: there is no h1 to clash with and no h5
   * or h6 to fall off the end.
   *
   * Order matters. Each pass runs once, top level first, so a heading promoted
   * by one pass is never re-promoted by the next.
   */
  for (const [from, to] of [
    ["h2", "h1"],
    ["h3", "h2"],
    ["h4", "h3"],
  ] as const) {
    body = body
      .replace(new RegExp(`<${from}(\\s|>)`, "gi"), `<${to}$1`)
      .replace(new RegExp(`</${from}>`, "gi"), `</${to}>`);
  }

  return { body, fetchedAt: new Date().toISOString() };
}
