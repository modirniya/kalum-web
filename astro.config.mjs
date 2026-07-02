import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Apex is the live host: GitHub Pages (actions/deploy-pages) is configured
  // for kalum.app and 301s www → apex. Keep every emitted URL on the apex,
  // with trailing slashes to match what Pages actually serves with a 200.
  site: 'https://kalum.app',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
});
