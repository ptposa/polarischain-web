// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages with a custom domain, served from the root
  site: 'https://polarischain.org',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
