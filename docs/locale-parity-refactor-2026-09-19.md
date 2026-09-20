# Ending the locale-drift bug class — plan

> Written 2026-09-19 after the parity audit found eight gaps, all with one cause.

## The bug class

Three Spanish pages are hand-written copies of pages the English site builds from shared
components:

| page | English builds from | Spanish |
|---|---|---|
| `/es/` | 8 components in `components/home/` | hand-written (`es/index.astro`) |
| `/es/call/mexico/` | `_DestinationEs.astro` (the other 4 ES destinations use it) | hand-written |
| `/es/call-without-internet/` | `NoInternetPage.astro` (7 locales use it) | hand-written |

Anything added to the shared version skips the hand-written one silently. That produced all eight
audit findings, and it produced them again during the fix: two of them had to be applied twice
because `/es/call/mexico/` is its own file.

`NoInternetPage.astro` + `no-internet-copy.ts` is the pattern that already works — one component,
one copy object per locale, eight locales, no drift. Extend it to the other two page types.

## Non-negotiable: the Spanish copy is not to be rewritten

`es/index.astro` says it is "purpose-written Spanish, not a literal translation". Every string moves
**verbatim** into a copy object. No retranslation, no tightening, no "while I'm here". The guard
below is what proves it.

## Safety net (do this first)

Snapshot the rendered, tag-stripped text of the three pages before touching anything:

```
npm run build
for p in es es/call/mexico es/call-without-internet; do
  python3 -c "…strip tags…" dist/$p/index.html > /tmp/before-$(basename $p).txt
done
```

After each task, re-render and `diff` against the snapshot. **An empty diff is the pass
condition** — it proves the refactor moved copy rather than changing it. A non-empty diff must be
explainable line by line (only the intentional additions from today's parity fixes).

## Tasks

### 1. Home — make the remaining five components copy-driven
`RateFinderSection`, `TrustStrip` and `PopularDestinations` already take a `locale`. Do the same for
`Hero`, `NoInternet`, `HowItWorksTeaser`, `HomeFAQ`, `FinalCTA`:
- new `src/lib/home-copy.ts`: `HomeCopy` interface + `en` and `es` entries, strings lifted verbatim
  from the two existing pages;
- each component reads `HOME_COPY[locale]`;
- `es/index.astro` becomes the same 8-component composition as `index.astro`, differing only in
  `locale="es"`, the canonical, the alternates and the FAQ schema.

### 2. `/es/call/mexico/` — fold into the shared Spanish template
Move Mexico's inline copy into `DESTINATION_COPY_ES` (it is the only ES destination missing from
that table), then reduce `es/call/mexico.astro` to the one-line `<DestinationEs slug="mexico" />`
the other four use. Keep its FAQ set if it differs from the template's.

### 3. `/es/call-without-internet/` — fold into `NoInternetPage.astro`
Add an `es` entry to `no-internet-copy.ts`. One real difference to support: every other locale links
its destinations to **English** pages, Spanish links to **its own**. Give the copy object an
optional per-entry `hreflang` (absent = same locale) rather than hard-coding English into the
component.

### 4. The guard — make parity machine-checked
Each shared component emits `data-section="hero|trust|finder|no-internet|steps|destinations|faq|cta"`.
`scripts/check-parity.mjs` then asserts that every page in an hreflang group renders the **same set
of `data-section` values**, and fails the build if not. Heading text differs by language; the set of
sections must not. This is what actually ends the bug class: the next missing block fails a build
instead of waiting for someone to notice a photo is gone.

## Order and verification
1 → verify diff, 2 → verify diff, 3 → verify diff, 4 → the guard must pass on the current tree and
fail when a section is deliberately removed (prove both). Then the full regression check
(sitemap 57, hreflang 25 groups, canonicals, JSON-LD, one h1, snippet budgets, no broken links),
build, deploy, verify live.

## Out of scope
Retranslating anything. Touching the seven non-Spanish locales, which already share their component.
Changing what any page says.

## Outcome

All four tasks shipped. Verification method and results:

**Copy integrity.** The pass condition was an empty text diff. Rendered text was
extracted from the built HTML for each page, before and after, and compared as a
word multiset — a comparison immune to the source-line rewrapping the refactor
causes when a hard-wrapped JSX text node becomes one string in a copy object.

| Page | Result |
| --- | --- |
| `/` | every word preserved, none added |
| `/es/` | every word preserved, none added |
| `/es/call-without-internet/` | every word preserved, none added |
| `/es/call/colombia/` (control) | identical line for line |
| `/ar` `/tr` `/hi` `/ur` `/bn` `/tl` `/vi` no-internet | identical line for line |

A site-wide sweep of all 61 built pages against the pre-refactor build found
exactly one page with changed text: `/es/call/mexico/`, which is the page that
moved onto the shared template and therefore gained the template's blocks.

**What `/es/call/mexico/` gained**, all of it copy the other four Spanish
destination pages already carried: a `Destinos` breadcrumb level, the
"¿Llamas a alguien sin internet?" link under the steps, and the coverage
sentence above the sibling chips. One phrase changed rather than moved: the
first FAQ answer now says "a cualquier número de México" where the hand-written
page said "a cualquier número mexicano", because the shared template builds that
sentence from the country name. Everything else is verbatim.

**The guard.** `scripts/check-parity.mjs` runs on the built HTML and is chained
into `npm run build`, which is what `withastro/action@v6` invokes, so a
regression fails the deploy rather than shipping. It covers 25 pages in 9
hreflang groups across five page families. Proven to fail, not just to pass:

- Removing `<TrustStrip locale="es" />` from the Spanish home →
  `/es/ — missing [trust] which / renders`, exit 1.
- Removing the `number-format` marker from the Spanish destination template →
  five failures, one per Spanish destination page, exit 1.

The check is union-based rather than measured against English, because this bug
ran in both directions: the English rates hub was the page missing a section its
Spanish counterpart had.

**Caught by the regression sweep, not by hand.** Adding Mexico to
`DESTINATION_COPY_ES` silently duplicated its card in the Spanish home page's
destinations grid, because three call sites wrote `["mexico", ...Object.keys(…)]`
to work around Mexico's absence from that table. All three are now plain
`Object.keys(DESTINATION_COPY_ES)`. The exemption cost more than it saved, twice.

**Still hand-written per locale:** `/how-it-works/` and `/call/`. Both were
audited during this sprint and both render matching sections today, so they are
under the guard even though they are not under a shared component. Folding them
onto shared components is the obvious follow-up and is not urgent while the
guard holds.
