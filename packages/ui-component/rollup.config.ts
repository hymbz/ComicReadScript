/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import type { RollupOptions } from 'rollup';
import ts from 'rollup-plugin-ts';
import postcss from 'rollup-plugin-postcss';

const buildConfig = (config: RollupOptions): RollupOptions => ({
  plugins: [
    postcss({
      extract: true,
    }),
    ts(),
  ],
  output: {
    dir: 'dist',
    generatedCode: 'es2015',
  },

  ...config,
});

const compsList = fs.readdirSync('src/containers');

export default () =>
  compsList.map((name) =>
    buildConfig({ input: { [name]: `src/containers/${name}/index.tsx` } }),
  );
