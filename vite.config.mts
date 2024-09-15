import { defineConfig } from 'vite';

import { vitePlugins } from './src/rollup-plugin/vite';

export default defineConfig({
  root: 'src',
  publicDir: 'src/stories/public',
  css: { modules: { generateScopedName: '[local]___[hash:base64:5]' } },
  define: { isDevMode: true },
  plugins: vitePlugins,
});
