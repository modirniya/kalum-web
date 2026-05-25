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
    .replace(/https:\/\/legal\.neuera\.app\/kalum\/privacy\/?/gi, "/privacy")
    .replace(/https:\/\/legal\.neuera\.app\/kalum\/terms\/?/gi, "/terms")
    .replace(/href="\/kalum\/privacy\/?"/gi, 'href="/privacy"')
    .replace(/href="\/kalum\/terms\/?"/gi, 'href="/terms"');

  // Send "version history" links back to the canonical archive on
  // legal.neuera.app — the relative ./archive.html href would otherwise
  // resolve to a 404 under kalum.app/privacy or kalum.app/terms. Done
  // after the kalum.app rewrites so the inserted absolute URL isn't
  // caught by the /kalum/privacy/ → /privacy rule above.
  const archiveUrl = url.replace(/\/$/, "") + "/archive.html";
  body = body.replace(/href="\.\/archive\.html"/gi, `href="${archiveUrl}"`);

  return { body, fetchedAt: new Date().toISOString() };
}
