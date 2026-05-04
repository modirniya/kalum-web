# kalum-web

Static marketing site for Kalum (https://www.kalum.app), built with Astro 5 + Tailwind v4, deployed to GitHub Pages.

## Local development

```sh
npm install
npm run dev          # dev server on :4321
npm run build        # outputs to dist/
npm run preview      # serves dist/ locally
```

## Phase 1 scope (this commit)

- Home page (`/`) — hero, no-internet section, how-it-works teaser, trust strip, final CTA, waitlist form.
- How-it-works page (`/how-it-works`) — expanded 3-step explanation + 5-item FAQ.
- 404 page.
- BaseLayout, Header, Footer, sitewide chrome.
- GitHub Actions deploy workflow.

Out of scope until later phases per the project's phased plan: support form (Phase 2), `/rates` (Phase 3), testimonials/comparison/OG images/legal pages (Phase 4), structured data + sitemap (Phase 5).

## TODOs before going live

1. **Buttondown handle** — `src/components/WaitlistForm.astro` contains `BUTTONDOWN_HANDLE_TODO` in the form `action` and the `onsubmit` popup URL. Create the Buttondown account, then replace both occurrences with the real handle.
2. **Wordmark** — Header and Footer currently render "KALUM" as Inter caps. Drop a real logotype into `src/assets/` and swap the `<span>` for an `<Image>` when ready.
3. **OG image** — `BaseLayout.astro` references `/og-default.png` but the file does not exist yet. Add a 1200×630 image to `public/` before sharing on social.
4. **Favicons** — `public/favicon.png` and `public/apple-touch-icon.png` are placeholders (the rotary-phone JPG renamed). Generate a proper favicon set when designing assets.
5. **Privacy / Terms** — Footer renders these as disabled spans. Add `/privacy` and `/terms` pages and convert to links in Phase 4.

## Publishing to GitHub Pages

The repo is currently local-only. To go live:

1. Create a public GitHub repo named `kalum-web` (private repos require GitHub Pro for Pages on the free tier):
   ```sh
   gh repo create kalum-web --public --source=. --remote=origin --push
   ```
2. In repo Settings → Pages:
   - Source: **GitHub Actions**
   - Custom domain: **www.kalum.app** (writes `CNAME` automatically; `public/CNAME` is preserved on each build).
   - Enforce HTTPS: **on** (after the cert provisions, ~10–60 minutes after DNS propagates).
3. Configure DNS at your registrar:
   - Apex `kalum.app` — A records:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
     and AAAA records:
     ```
     2606:50c0:8000::153
     2606:50c0:8001::153
     2606:50c0:8002::153
     2606:50c0:8003::153
     ```
   - `www.kalum.app` — CNAME → `<your-github-username>.github.io.`
   - GitHub Pages will 301 the apex to www automatically once the custom domain is set.
4. Push to `main`. Actions runs `withastro/action@v3` then `actions/deploy-pages@v4`. The site updates in ~60–90 seconds.

`.app` is on Google's HSTS preload list, so HTTPS is mandatory at the TLD level — no HTTP fallback needed.

## File map

```
.github/workflows/deploy.yml   GitHub Pages deploy
public/CNAME                   www.kalum.app
public/robots.txt              Allow all
public/favicon.png             Placeholder (rotary icon)
public/apple-touch-icon.png    Placeholder (rotary icon)
src/styles/global.css          @import "tailwindcss" + @theme brand tokens
src/layouts/BaseLayout.astro   Sitewide chrome, head metadata, OG/Twitter
src/components/Header.astro
src/components/Footer.astro
src/components/WaitlistForm.astro    Buttondown embed (TODO: handle)
src/components/home/*.astro          5 home sections
src/components/howitworks/*.astro    Steps + FAQ
src/pages/index.astro
src/pages/how-it-works.astro
src/pages/404.astro
src/assets/kalum-icon.{svg,jpg}      Brand mark (rotary phone)
src/assets/screenshots/dialer.png    Hero device screenshot
```

## Brand tokens

Mirrored from `mobile/lib/core/theme/app_theme.dart` — that file is the source of truth. If colors change there, update `src/styles/global.css`.

| Token | Value | Use |
|---|---|---|
| `--color-maroon` | `#420905` | Primary, hero, header |
| `--color-maroon-light` | `#6B1208` | Hover |
| `--color-maroon-dark` | `#2A0603` | Gradient stop |
| `--color-teal` | `#38B2AC` | Step numbers, secondary CTA |
| `--color-teal-light` | `#4FD1C5` | Hover |
| `--color-navy` | `#1A1A2E` | Trust strip, footer, dark sections |
| `--color-cream` | `#F7FAFC` | Light backgrounds |
| `--color-text` | `#2D3748` | Body text |
| `--color-muted` | `#718096` | Secondary text |
