/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import type { OutputPlugin, RollupOptions, Plugin } from 'rollup';
import { rollup } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import ts from 'rollup-plugin-ts';
import esbuild from 'rollup-plugin-esbuild';
import prettier from 'rollup-plugin-prettier';
import css from 'rollup-plugin-import-css';
import del from 'rollup-plugin-delete';
import watchGlobs from 'rollup-plugin-watch';
import svgr from '@svgr/rollup';
import handler from 'serve-handler';
import http from 'http';

import type { MetaValues } from 'rollup-plugin-userscript-metablock';
import metablock from 'rollup-plugin-userscript-metablock';

import pkg from './package.json';
import metaJson from './meta.json';

export const meta = {
  ...metaJson,
  name: pkg.name,
  namespace: pkg.name,
  version: pkg.version,
  description: pkg.description,
  author: pkg.author,
  license: pkg.license,
} as MetaValues;

const isDevMode = process.env.NODE_ENV === 'development';
/** 开发服务器的端口 */
const DEV_PORT = '2405';
const siteFileList = fs.readdirSync('src/site');

// 启动开发服务器
if (isDevMode)
  http
    .createServer(
      (request, response) =>
        handler(request, response, { public: 'dist' }) as unknown,
    )
    .listen(DEV_PORT);

const buildConfig = (
  config: RollupOptions,
  ...plugins: Array<OutputPlugin | false>
): RollupOptions => ({
  plugins: [
    replace({
      values: {
        DEV_PORT,
        isDevMode: `${isDevMode}`,
        'process.env.NODE_ENV': isDevMode ? `'development'` : `'production'`,
      },

      preventAssignment: true,
    }),

    svgr({
      icon: true,
      svgProps: {
        stroke: 'currentColor',
        fill: 'currentColor',
        strokeWidth: '0',
      },
      namedExport: 'default',
    }),

    resolve({ browser: true }),
    commonjs(),
    css(),
    isDevMode ? esbuild({ target: 'esnext', charset: 'utf8' }) : ts(),

    ...plugins,
  ],
  external: Object.keys(meta.resource ?? {}),

  ...config,
});

export default async () => {
  // 生成用于动态加载外部模块的 require 函数代码
  const importBundle = await rollup(
    buildConfig({ input: 'src/helper/import.ts', treeshake: false }),
  );
  let {
    output: [{ code: importCode }],
  } = await importBundle.generate({});
  await importBundle.close();
  // 因为直接定义 require 函数 ts 会报错，所以只能在代码里 export 函数再在这里删掉
  importCode = importCode.replace(/^export.+;$/m, '');

  return [
    // 编译 dev.user.js
    buildConfig(
      {
        input: 'src/dev.ts',
        // 忽略使用 eval 的警告
        onwarn(warning, warn) {
          if (warning.code !== 'EVAL') warn(warning);
        },
        output: {
          file: 'dist/dev.user.js',
          plugins: [
            metablock({
              file: '',
              override: (({ grant = [], ...otherMeta }) => ({
                ...otherMeta,

                // 添加 xmlHttpRequest 权限
                grant: [...new Set([...grant, 'GM.xmlHttpRequest'])],
                // 允许请求所有域
                connect: '*',
              }))(meta),
            }),
          ],
        },
      },
      del({ targets: 'dist/*' }),
    ),

    // 单独打包每个站点的代码
    ...siteFileList.map((fileName) =>
      buildConfig({
        input: { [fileName]: `src/site/${fileName}` },
        output: {
          dir: 'dist',
          format: 'cjs',
          generatedCode: 'es2015',
          exports: 'none',
          strict: false,
          inlineDynamicImports: true,
          intro: importCode,
        },
        context: 'this',
      }),
    ),

    // 编译 bundle.user.js
    {
      input: 'src/index.tsx',
      output: {
        file: 'dist/bundle.user.js',
        format: 'cjs',
        generatedCode: 'es2015',
        exports: 'none',
        plugins: [
          // 根据注释将每个站点的代码放进来
          {
            name: 'injectSiteCode',
            renderChunk(code) {
              let newCode = code;
              siteFileList.forEach((fileName) => {
                newCode = newCode.replace(
                  `// ${fileName.split('.')[0]}`,
                  fs.readFileSync(`./dist/${fileName}.js`).toString(),
                );
              });
              // 在开发模式时计算下脚本的运行消耗时间
              if (isDevMode)
                newCode = `console.time('脚本运行消耗时间')\n${newCode}\nconsole.timeEnd('脚本运行消耗时间')`;
              return newCode;
            },
          } as Plugin,
          !isDevMode &&
            prettier({
              singleQuote: true,
              trailingComma: 'all',
              parser: 'babel',
            }),
          metablock({ file: '', override: meta }),
        ],
      },
      plugins: [
        watchGlobs({
          dir: 'dist',
          include: siteFileList.map((fileName) => `**/dist/${fileName}.js`),
        }),
      ],
      treeshake: false,
    },
  ];
};
