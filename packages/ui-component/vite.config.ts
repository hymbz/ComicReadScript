/* eslint-disable import/no-extraneous-dependencies */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// eslint-disable-next-line import/no-unresolved
import Unocss from 'unocss/vite';
import presetWind from '@unocss/preset-wind';
import * as path from 'path';

export default defineConfig({
  plugins: [
    react(),

    Unocss({
      presets: [presetWind()],
      mode: 'shadow-dom',
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
        Button: path.resolve(__dirname, 'src/containers/Button/index.tsx'),
        Manga: path.resolve(__dirname, 'src/containers/Manga/index.tsx'),
      },
      output: {
        entryFileNames: '[name].js',
      },
      external: ['react', 'react/jsx-runtime', 'zustand', 'immer'],
    },
  },
});
