/* eslint-disable import/no-extraneous-dependencies */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// eslint-disable-next-line import/no-unresolved
import Unocss from 'unocss/vite';
import presetWind from '@unocss/preset-wind';
import * as path from 'path';

export default {
  vitePlugins: [
    react(),

    Unocss({
      presets: [presetWind()],
      mode: 'shadow-dom',
    }),
  ],
);
