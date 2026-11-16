# Kalum web — design system (MASTER)

The single source of truth for the kalum.app redesign. Page files in
`pages/` may override a rule here for one page family; otherwise this file
wins. Built with the UI/UX Pro Max skill (`.claude/skills/ui-ux-pro-max`),
with one deliberate departure: **colour and type come from the app**
(`kalum-mobile/lib/core/theme/`), not from the skill's palette database. The
skill's generic picks (trust-navy + gold, Lexend / Source Sans, blue/purple
"vibrant") would make the site look like a different product from the one
people install.

Prototype: `preview.html` in this folder (open it locally after
`npm install`; add `?dark` or `?rtl` to the URL).

---

## 1. What the audit found (whole site, 35 pages)

The site has 8 page families:

| Family | Pages | Today's file |
|---|---|---|
| Home | `/`, `/es/` | `components/home/*` |
| How it works | `/how-it-works/`, `/es/how-it-works/` | `HowItWorksPage.astro` |
| No-internet landing | `/call-without-internet/` + 10 locales (incl. RTL `ar`, `ur`) | `NoInternetPage.astro` + a separate EN page |
| Destination | `/call/[slug]/` (~40), `/es/call/*` (5), `/call-mexico/` | `call/[slug].astro`, `es/_DestinationEs.astro`, `call-mexico.astro` |
| Corridor (UAE / Gulf) | `/call-from-uae/`, `/call-india-from-uae/`, `/call-pakistan-from-uae/`, `/whatsapp-calls-blocked/` | one hand-built file each |
| Rates hub | `/call/`, `/es/call/` | `RatesHubPage.astro` |
| Editorial | `/calling-app-vs-internet-calling/` | own file |
| Utility | `/support/`, `/join/`, `/404`, `/privacy/`, `/terms/` | own files |

Problems shared by all of them, not just home:

1. **No shared sections.** The hero, FAQ, CTA band, rate cards and "3 steps"
   are re-implemented in 19 files (`brand-gradient` appears in 19). Every
   family drifts a little: three FAQ styles, four rate-card styles, two
   step-list styles.
2. **The colours belong to neither app mode.** The maroon→navy gradient mixes
   light-mode maroon with the dark-mode navy background, and the navy footer
   is a colour the light app never shows.
3. **Busy bands.** Full-width white / cream / navy / maroon bands take turns
   down the page, so nothing groups content. The app groups by putting white
   cards on cream.
4. **Most heroes are text only.** Only home has a visual. A destination
   page's best asset, the rate, is buried halfway down.
5. **No dark mode.** The app follows the system setting (`ThemeMode.system`);
   the site is always light.
6. **Two contrast failures inherited from the app:** teal links (3.68:1 on
   cream) and white text on the call-green (2.43:1).

---

## 2. Template decision — "app shell"

**The website uses the same frame as the app.** In the app, a maroon wave
header sits on top, the cream page scrolls below with white cards on it, and
a maroon bar sits at the bottom. Every page on the site gets the same three
parts:

```
┌──────────── maroon ─────────────┐  Header (same maroon, no seam)
│  Hero: eyebrow, H1, lead, CTAs  │  + one "hero card" (rate / visual)
╰~~~~~~~~ wave (app curve) ~~~~~~~╯
           cream page
   ┌ white card ┐ ┌ white card ┐     section kit, cards on cream,
   └────────────┘ └────────────┘     no alternating full-width bands
╭~~~~~~~~ wave (flipped) ~~~~~~~~~╮
│  CTA band (maroon)              │  CTA and footer form one maroon
│  Footer (maroon-dark)           │  "base", like the app's bottom bar
└─────────────────────────────────┘
```

### Three layouts

| Layout | Used by | Hero | Body |
|---|---|---|---|
| **Showcase** | Home (en, es) | Tall wave hero, phone mockup at the end side; rate finder sits in a white card overlapping the wave, the way the app's number field sits under its wave | Section kit |
| **Landing** | How it works, no-internet ×11, destination ×46, corridor ×4, rates hub ×2, editorial | Wave hero + a **hero card** slot at the end side: destination shows its "from" rate card (§6a); corridor shows "UAE → India, from 4¢/min"; no-internet shows a mini "they just pick up" call card; hub shows the search | Section kit |
| **Utility** | Support, join, 404, privacy, terms | Short wave header (breadcrumb + title only) | One white content card on cream, like an app settings screen |

### Section kit (shared components that replace the 19 copies)

| Component | Replaces | Notes |
|---|---|---|
| `PageHero` (`showcase` / `landing` / `compact`) | 7 hero copies + `brand-gradient` | Solid maroon + SVG wave; no gradient |
| `Section` | ad-hoc `<section>` bands | Eyebrow, H2, lead, slot; cream only |
| `Card`, `CardGrid` | "Made for…", "Landline-only" etc. | White, r=12, `shadow-sm` |
| `StepList` | 2 step styles | Numbered 1-2-3, horizontal ≥md |
| `RateCard`, `RateList` | 4 rate-card styles | Tabular figures; price chip in call-green; always "from" (§6a) |
| `FAQ` | 3 FAQ styles | `<details>`; keeps FAQPage JSON-LD |
| `CompareTable` | editorial + corridor tables | Kalum column tinted |
| `LinkChips` | popular / more destinations | Pill chips |
| `CtaBand` | 7 CTA copies | Maroon, flipped wave on top, store badges |
| `Prose` | privacy / terms / long copy | Typography plugin, brand-tinted |

Already-shared pieces stay as they are, restyled: Header, Footer, Breadcrumb,
LanguageBar, RateDisclosure, RateFinder, store badges.

---

## 3. Colour tokens (from `app_theme.dart`)

Semantic names are what components use. Hex values are the app's, except
for the two marked **web** (the AA fixes).

| Token | Light | Dark | App source |
|---|---|---|---|
| `--bg` | `#FAF6EE` cream | `#1A1A2E` navy | `creamBackground` / `darkBackground` |
| `--surface` (cards) | `#FFFFFF` | `#25253B` | `lightSurface` / `darkCallSurface`¹ |
| `--surface-2` (inputs, raised) | `#F0EBE1` | `#2F2F48` | `lightSurfaceVariant` / `darkCallRaised` |
| `--outline` | `#E0D9CD` | `#3A3A55` | `lightOutline` / `darkCallOutline` |
| `--text` | `#241E1B` | `#E2E8F0` | `lightTextPrimary` / `darkTextPrimary` |
| `--text-2` | `#6B6259` | `#A0AEC0` | `lightTextSecondary` / `darkTextSecondary` |
| `--brand` (hero, CTA band) | `#420905` | `#420905` | `primaryColor` (shared across modes) |
| `--brand-deep` (footer) | `#2A0603` | `#2A0603` | `primaryDark` |
| `--primary` (buttons) | `#420905` | `#6B1208` | `colorScheme.primary` |
| `--on-primary` | `#FFFFFF` | `#FFFFFF` | |
| `--accent` (icons, large) | `#0E8F86` | `#4FD1C5` | `context.tealAccent` |
| `--link` (text) | `#097369` **web** | `#4FD1C5` | teal deepened to 5.31:1 on cream |
| `--call` (rate chips) | `#48BB78` | `#48BB78` | `successColor` |
| `--on-call` | `#10262B` **web** | `#10262B` | app's `onSecondary` ink; white is 2.43:1 |
| `--danger` (text) | `#C53030` | `#F56565` | `lightCallEnd` / `errorColor` |
| `--warning` | `#ED8936` | `#ED8936` | `warningColor` |

¹ The app's neutral dark surface `#1E1E1E` is invisible on navy (1.02:1). The
app already uses its navy-tinted call-screen surfaces to fix this, so the site
does the same.

Contrast (measured): text/cream 15.3, text-2/cream 5.54, text-2/white 5.97,
white/maroon 16.5, link/cream 5.31, on-call/call 6.8, dark text/navy 13.8,
dark text-2/surface 6.6, dark link/navy 9.15.

**Dark mode** follows `prefers-color-scheme`, matching the app's
`ThemeMode.system`. There's no toggle in v1. The hero and CTA stay maroon in
both modes, as the app's wave header does.

**Rules**
- Components never use raw hex values, only tokens.
- Maroon appears in three places only: hero, CTA band and footer (plus the
  primary button). The page body stays cream.
- Green is reserved for prices, as in the app's "$0.06/min" call button.
- Teal is used for links, icons and eyebrows, never for body text.

---

## 4. Typography (from `app_typography.dart`)

- **Family:** Plus Jakarta Sans Variable (the app's "Kalum" face). Noto
  fallbacks per script stay as they are (`ar`, `ur`, `hi`, `bn`).
- **Numbers:** `font-variant-numeric: tabular-nums` on every price, as the app
  does on its balance and timers.

| Role | Size | Weight | Line height | App role |
|---|---|---|---|---|
| Display / H1 | clamp(2.25rem, 4.5vw + 1rem, 3.5rem) | 700 | 1.08 | (web-only scale-up of `headlineLarge`) |
| H2 | clamp(1.75rem, 2vw + 1rem, 2.25rem) | 700 | 1.15 | `headlineLarge` |
| H3 | 1.25rem | 600 | 1.25 | `headlineMedium` |
| Lead | 1.125rem | 400 | 1.6 | `bodyLarge` |
| Body | 1rem | 400 | 1.6 | `bodyMedium` |
| Small | 0.875rem | 400 | 1.5 | `bodySmall` |
| Eyebrow / label | 0.75rem upper, 0.22em / 0.12em | 600 | — | existing `eyebrow` / `micro-label` |
| Price, large | 1.75rem tabular | 600 | 1.15 | `displaySmall` |

H1 and H2 keep the existing `tracking-display` utility, which is reset for
connected scripts as today.

---

## 5. Shape, depth, spacing, motion

- **Radius** (app): 8 for buttons and inputs, 12 for cards, 16 for hero cards
  and large panels, 9999 for chips and the nav "Get the app" pill.
- **Shadow** (app presets): `sm` = 0 2 4 / 5%, `md` = 0 4 8 / 10%,
  `lg` = 0 8 16 / 15%. Cards use `sm`, hover `md`, the hero card `lg`. In
  dark mode, use the outline instead of a shadow.
- **Spacing** (app 8-pt scale): 4, 8, 12, 16, 24, 32, 48, 64. Sections get
  64 px vertical padding on desktop and 48 px on mobile. Content width is
  `max-w-6xl` (1152 px), and prose is 65ch.
- **Wave:** the app's `WaveClipper` curve as an inline SVG, 48 px tall on
  mobile and 72 px on desktop. It isn't mirrored for RTL (it's decorative,
  not directional).
- **Motion:** state changes only (hover, focus, `<details>` open), 150–250 ms
  `ease-out`. No scroll-reveal library and no GSAP: the site stays near
  zero-JS, and content stays visible without JS for SEO. Everything respects
  `prefers-reduced-motion`.
- **Icons:** `lucide-static` (already a dependency), 20/24 px, `--accent`.
  No emoji used as icons.

---

## 6. Components, states

- **Primary button:** `--primary` fill, white, r=8, 44 px minimum height,
  hover 8% lighter, 2 px focus ring in `--accent` offset 2.
- **On-maroon button:** cream pill with maroon text (the app's selected-tab
  pill). Used for "Get the app" in the header.
- **Store badges:** official artwork, unchanged, 44 px tall. They are the
  main CTA on every page.
- **Inputs:** `--surface-2` fill, `--outline` border, r=8, focus border
  `--primary` 2 px (app `inputDecorationTheme`). Labels always visible.
- **FAQ:** a white card per group, rows divided by `--outline`, chevron
  rotates 180°, 44 px minimum tap height.
- **Mobile sticky CTA** (proposed): after the hero badges scroll out of view,
  a floating maroon pill at the bottom reading "Get Kalum, from $4.99" plus a
  store link, echoing the app's bottom nav. Hidden when the CTA band is in
  view.

---

## 6a. Rate data contract (applies to every rate on every page)

What the site has: **one number per country**, `rate_per_minute` (218
countries), from the public API, with `src/data/rates.json` as the fallback
snapshot. Under the production basis `"from"` (`src/lib/rates.ts`), that
number is the country's **cheapest prefix**. The site has no landline/mobile
split, no per-prefix rates and no per-city rates.

So every design that shows a rate must:

- Say **"from"** next to every figure: hero card, rate rows, chips, meta
  copy.
- **Never** show separate mobile/landline prices, imply one price covers both,
  or work out minutes-per-dollar ("$4.99 ≈ 124 min") from the figure.
- Put `RateDisclosure` near every rate block and keep its wording as it is.
  Billing mechanics are **linked to Terms §5, not summarised**; don't add
  bullets like "billed per minute" or "no connection fees" to cards.
- Get the rate date from `card.fetchedAt` (`formatRatesAsOf`), never hard-code
  it.
- Treat flags as emoji, which the no-emoji-icons rule forbids (Windows shows
  them as letters). Identify destinations by name and a `+code` tag instead.

---

## 7. RTL and locales

- Use logical utilities only (`ms-/me-`, `ps-/pe-`, `start/end`,
  `text-start`). Directional icons (arrows, chevrons used as "next") flip
  under `[dir=rtl]`.
- Prices and phone codes are wrapped in `<bdi>`/`dir="ltr"` so "+91" and
  "4¢/min" don't reorder.
- Hero cards move to the start side in RTL automatically (grid with logical
  order).
- Every layout gets checked in `ar` and `ur` (Nastaliq needs the taller line
  heights already in `global.css`).

---

## 8. Pre-delivery checklist (per page family)

- [ ] 375 / 768 / 1024 / 1440 px, no horizontal scroll
- [ ] Light and dark modes
- [ ] `ar` + `ur` RTL for families that have them
- [ ] Text contrast ≥ 4.5:1, UI ≥ 3:1 (tokens above are pre-checked)
- [ ] Visible keyboard focus everywhere; tap targets ≥ 44 px
- [ ] `prefers-reduced-motion` respected
- [ ] No layout shift from fonts or images (explicit sizes)
- [ ] `npm run build` passes, including `check:parity`

---

## 9. As built (2026-11-16)

All six rollout steps are done; every page renders through the kit.

| Piece | Where |
|---|---|
| Tokens, dark mode, type scale, `card` / `price-chip` / `dial-tag` / `btn-*` / `field` / `link` utilities | `src/styles/global.css` |
| Dark-mode switch (`html.theme-auto`, follows the OS) | `src/layouts/BaseLayout.astro` |
| `PageHero` (+ `Wave`, `HeroCopy`), `Section`, `CtaBand`, `StoreBadges` | `src/components/kit/` |
| `Faq`, `Steps`, `LinkChips`, `RateTile`, `RateCard` (hero rate), `PhoneMockup`, `Arrow` | `src/components/kit/` |
| Mobile sticky pill | `src/components/kit/StickyCta.astro`, mounted in BaseLayout |

Layouts in use:

- **Showcase:** `/`, `/es/`; the ad page `/call-mexico/` (bare chrome).
- **Landing:** how it works (en, es), no-internet (11 locales), destinations
  (`/call/*`, `/es/call/*`), rates hub (en, es), UAE corridors, the Gulf
  explainer, the comparison article.
- **Utility:** support, join, 404, privacy, terms.

Checks the redesign was verified against: `npm run build` (including
`check:parity`, 27 pages in 9 groups), `astro check` (0 errors), every
`data-section` marker unchanged, no horizontal overflow at 375 / 768 / 1024 /
1440 px, and an automated WCAG text-contrast scan of every page family in
light and dark (0 failures).

**Rules for new pages**

1. Compose from the kit; don't hand-write heroes, FAQs, CTA bands or rate
   cards.
2. Use semantic tokens only (`--color-ink`, `--color-surface`…). Raw hex and
   `bg-white` / `text-black` break dark mode.
3. Any rate goes through `RateTile` / `RateCard` / `LinkChips` with its
   "from", plus a `RateDisclosure` nearby (§6a).
4. Keep `data-section` on every role a translated twin must also have.
