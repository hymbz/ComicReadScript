/* eslint-disable import/no-extraneous-dependencies */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig(() => ({
  plugins: [
    svgr({
      exportAsDefault: true,
      svgrOptions: {
        icon: true,
        svgProps: {
          stroke: 'currentColor',
          fill: 'currentColor',
          strokeWidth: '0',
        },
        namedExport: 'default',
      },
    }),
    react(),
  ],

  css: {
    modules: {
      generateScopedName: '[local]_[hash:base64:5]',
    },
  },
}));
