import type { ManifestOptions } from 'vite-plugin-pwa';

import markdown from '@jackfranklin/rollup-plugin-markdown';
import replace from '@rollup/plugin-replace';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

import { vitePlugins } from '../rollup-plugin/vite';

const manifest: Partial<ManifestOptions> = {
  id: 'ComicRead',
  name: 'ComicRead',
  short_name: 'ComicRead',
  description: '双页阅读漫画',
  theme_color: '#607d8b',
  background_color: '#ffffff',
  display: 'standalone',
  icons: [
    {
      src: '/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
    {
      src: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],

  file_handlers: [
    {
      action: '/',
      accept: {
        'application/zip': ['.zip', '.cbz'],
        'application/x-rar-compressed': ['.rar', '.cbr'],
        'application/x-7z-compressed': ['.7z', '.cb7'],
      },
    },
  ],
};

export default defineConfig({
  server: { host: '0.0.0.0' },
  build: { rollupOptions: { external: ['/unarchiver.min.js'] } },
  css: {
    modules: {
      globalModulePaths: [/^#/],
      generateScopedName: '[local]___[hash:base64:5]',
    },
  },
  plugins: [
    replace({
      values: { isDevMode: 'false' },

      preventAssignment: true,
    }),
    ...vitePlugins,
    markdown({ parseFrontMatterAsMarkdown: true }),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { suppressWarnings: true },
      manifest,
      includeAssets: ['/libarchive.js/wasm-gen/libarchive.wasm', '/libunrar/*'],
      workbox: {
        // 清理过期缓存
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
