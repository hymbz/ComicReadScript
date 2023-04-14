/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import SolidSvg from 'vite-plugin-solid-svg';

export default defineConfig({
  plugins: [
    SolidSvg({
      svgo: {
        enabled: true,
        svgoConfig: {
          plugins: [
            'preset-default',
            {
              name: 'addAttributesToSVGElement',
              params: {
                attribute: {
                  stroke: 'currentColor',
                  fill: 'currentColor',
                  'stroke-width': '0',
                },
              },
            },
          ],
        },
      },
    }),
    solid(),
  ],
  css: {
    modules: {
      generateScopedName: '[local]_[hash:base64:5]',
    },
  },
});
