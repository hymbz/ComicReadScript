import { defineConfig } from 'vite';
import { type ManifestOptions, VitePWA } from 'vite-plugin-pwa';

import { vitePlugins } from '../../scripts/plugin/vite';

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
  define: { isDevMode: 'false' },
  build: { rolldownOptions: { external: ['/unarchiver.min.js'] } },
  css: {
    modules: {
      globalModulePaths: [/^#/u],
      generateScopedName: '[local]___[hash:base64:5]',
    },
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    ...vitePlugins,
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { suppressWarnings: true },
      manifest,
      includeAssets: ['/libarchive.js/wasm-gen/libarchive.wasm', '/libunrar/*'],
      workbox: {
        // 清理过期缓存
        cleanupOutdatedCaches: true,
        // Rolldown 打包后部分文件（如 pdfjs）超出默认限制，要增大一下
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
});
