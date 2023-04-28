/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import SolidSvg from 'vite-plugin-solid-svg';

/** 开发服务器的端口 */
export const DEV_PORT = 2405;

export default defineConfig({
  server: {
    host: true,
    port: DEV_PORT,
    cors: false,
  },
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
});
