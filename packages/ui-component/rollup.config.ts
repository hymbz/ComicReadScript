/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import type { RollupOptions } from 'rollup';
import ts from 'rollup-plugin-ts';
import postcss from 'rollup-plugin-postcss';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import meta from '@crs/userscript/meta.json';

const buildConfig = (config: RollupOptions): RollupOptions => ({
  plugins: [
    nodeResolve(),
    commonjs(),
    postcss({
      extract: true,
    }) as any,
    ts(),
  ],
  output: {
    dir: 'dist',
    generatedCode: 'es2015',
  },
  external: [...Object.keys(meta.resource ?? {})],

  ...config,
});

export default () =>
  fs
    .readdirSync('src/containers')
    .map((name) =>
      buildConfig({ input: { [name]: `src/containers/${name}/index.tsx` } }),
    );
