#!/usr/bin/env node
/**
 * Locale parity guard.
 *
 * THE BUG THIS EXISTS TO STOP
 *
 * On 2026-09-19 an audit found eight separate defects on the Spanish pages:
 * no hero screenshot, no trust strip, no destinations grid, a buried
 * number-format heading, no sibling links, and so on. They were eight symptoms
 * of one cause. /es/ was hand-written markup that resembled /, rather than the
 * same components with Spanish copy, so every improvement made to an English
 * page skipped Spanish by construction and nothing said so.
 *
 * The refactor moved every home, destination and call-without-internet page
 * onto shared components with per-locale copy objects. This script is what
 * keeps it that way: it reads the BUILT html and asserts that every page in an
 * hreflang group renders the same set of sections. A page that loses one
 * fails the build.
 *
 * HOW A SECTION IS DECLARED
 *
 * Any element may carry `data-section="<role>"`. The role names a piece of
 * content, not a box: the English rates hub packs hero, finder and the
 * destination index into one <section> while the Spanish one splits the hero
 * out, and both are correct. Tag the element that owns the role.
 *
 * Tagging is opt-in, and that is deliberate: a block that genuinely belongs to
 * one locale (the UAE corridor box on the English hub links three pages that
 * exist only in English) simply carries no tag. The flip side is that deleting
 * a tag silences this check. Deleting a tag is the thing to catch in review.
 *
 * ORDER IS NOT CHECKED, only presence. The Spanish home page carries its trust
 * strip in the same place as the English one today, but a locale is allowed to
 * order its page for its own readers. Losing a section is the bug; moving one
 * is a decision.
 *
 * Run: node scripts/check-parity.mjs [distDir]   (default ./dist)
 * Exits non-zero on any mismatch, and prints exactly what is missing where.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const DIST = process.argv[2] ?? "dist";
const I18N = "src/lib/i18n.ts";

/**
 * Groups of pages that are translations of one another, read straight out of
 * `localizedGroups` in src/lib/i18n.ts — the same list that emits hreflang.
 *
 * This used to be a hand-maintained copy of that list, which is the very bug
 * this script exists to catch, one level up: adding a localized page in one
 * file and not the other would have left the new group silently unguarded.
 * Parsing the real list means a page cannot claim an hreflang alternate
 * without also coming under this check. If the parse fails the script fails —
 * never falls back to a stale copy.
 */
async function localizedGroups() {
  const src = await readFile(I18N, "utf8");
  const block = src.match(/export const localizedGroups[^=]*=\s*\[([\s\S]*?)\n\];/);
  if (!block) {
    console.error(
      `Locale parity check ABORTED — could not find localizedGroups in ${I18N}.\n` +
        "The array was renamed or reformatted. Fix this parser; do not delete the check."
    );
    process.exit(2);
  }
  const groups = [];
  for (const row of block[1].matchAll(/\{([\s\S]*?)\}/g)) {
    const paths = [...row[1].matchAll(/"(\/[^"]*)"/g)].map((m) => m[1]);
    if (paths.length) groups.push(paths);
  }
  if (!groups.length) {
    console.error(`Locale parity check ABORTED — parsed zero groups from ${I18N}.`);
    process.exit(2);
  }
  return groups;
}

const GROUPS = await localizedGroups();

/** Every role must be reachable from at least one group, or it is a typo. */
const KNOWN_ROLES = new Set([
  "hero",
  "trust",
  "finder",
  "no-internet",
  "steps",
  "destinations",
  "explainer",
  "reasons",
  "number-format",
  "faq",
  "cta",
  "origins",
]);

async function sectionsOf(path) {
  const file = join(DIST, path.replace(/^\//, ""), "index.html");
  let html;
  try {
    html = await readFile(file, "utf8");
  } catch {
    return null;
  }
  const roles = new Set();
  for (const m of html.matchAll(/\bdata-section="([^"]+)"/g)) roles.add(m[1]);
  return roles;
}

const problems = [];

for (const group of GROUPS) {
  const found = [];
  for (const path of group) {
    const roles = await sectionsOf(path);
    if (roles === null) {
      problems.push(`${path} — hreflang promises this page but ${DIST} has no html for it`);
      continue;
    }
    if (roles.size === 0) {
      problems.push(`${path} — no data-section markers at all; it is not covered by the guard`);
      continue;
    }
    for (const role of roles) {
      if (!KNOWN_ROLES.has(role)) {
        problems.push(`${path} — unknown section role "${role}" (typo, or add it to KNOWN_ROLES)`);
      }
    }
    found.push({ path, roles });
  }
  if (found.length < 2) continue;

  // The union is the contract: every page in the group owes every role any
  // member of the group renders. Naming the reference page instead would make
  // the check directional, and this bug ran in both directions — the English
  // rates hub was the one missing a Spanish page's section.
  const union = new Set(found.flatMap((f) => [...f.roles]));
  for (const { path, roles } of found) {
    const missing = [...union].filter((r) => !roles.has(r));
    if (missing.length) {
      const who = found
        .filter((f) => missing.some((r) => f.roles.has(r)))
        .map((f) => f.path)
        .join(", ");
      problems.push(`${path} — missing [${missing.join(", ")}] which ${who} renders`);
    }
  }
}

if (problems.length) {
  console.error(`\nLocale parity check FAILED — ${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  console.error(
    "\nA page in an hreflang group is missing a section its siblings have.\n" +
      "Add the section rather than removing the marker from the others.\n"
  );
  process.exit(1);
}

const pages = GROUPS.reduce((n, g) => n + g.length, 0);
console.log(`Locale parity OK — ${pages} pages in ${GROUPS.length} groups render matching sections.`);
