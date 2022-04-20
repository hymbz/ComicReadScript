/* eslint-disable import/no-extraneous-dependencies */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// eslint-disable-next-line import/no-unresolved
import Unocss from 'unocss/vite';
import presetWind from '@unocss/preset-wind';
import * as path from 'path';

export default defineConfig({
  plugins: [
    react({
      // TODO:之后再尝试改为新版
      jsxRuntime: 'classic',
    }),

    Unocss({
      presets: [presetWind()],
      mode: 'dist-chunk',
    }),
  ],

  build: {
    target: 'esnext',
    cssCodeSplit: true,
    // watch: {},
    lib: {
      entry: path.resolve(__dirname, 'src/App.tsx'),
      formats: ['es'],
    },
    rollupOptions: {
      input: {
        Button: path.resolve(__dirname, 'src/component/Button/index.tsx'),
        Manga: path.resolve(__dirname, 'src/component/Manga/index.tsx'),
      },
      output: {
        globals: {
          react: 'react',
        },
        entryFileNames: '[name].js',
      },
      external: ['react'],
    },
  },
});
