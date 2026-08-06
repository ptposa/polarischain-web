// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages project site: https://ptposa.github.io/polarischain-web
  site: 'https://ptposa.github.io',
  base: '/polarischain-web',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
