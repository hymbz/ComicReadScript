/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import type { OutputPlugin, RollupOptions, Plugin } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import ts from 'rollup-plugin-ts';
import esbuild from 'rollup-plugin-esbuild';
import prettier from 'rollup-plugin-prettier';
import css from 'rollup-plugin-import-css';
import del from 'rollup-plugin-delete';
import serve from 'rollup-plugin-serve';
import watchAssets from 'rollup-plugin-watch-assets';
import svgr from '@svgr/rollup';

import type { MetaValues } from 'rollup-plugin-userscript-metablock';
import metablock from 'rollup-plugin-userscript-metablock';

import pkg from './package.json';
import resource from './resource.json';

const isDevMode = process.env.NODE_ENV === 'development';

export const meta = {
  name: pkg.name,
  namespace: pkg.name,
  version: pkg.version,
  description: pkg.description,
  author: pkg.author,
  license: pkg.license,

  include: '*',
  connect: '*',
  noframes: true,
  grant: [
    'GM_addElement',
    'GM_getResourceText',
    'GM.xmlHttpRequest',
    'GM.getResourceText',
    'GM.addStyle',
    'GM.getValue',
    'GM.setValue',
    'GM.registerMenuCommand',
    'unsafeWindow',
  ],
  resource: resource[isDevMode ? 'dev' : 'prod'],
} as MetaValues;

/** 开发服务器的端口 */
const DEV_PORT = '2405';
const siteFileList = fs.readdirSync('src/site');

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
  external: [...Object.keys(meta.resource ?? {}), '../components'],

  ...config,
});

export default [
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
    isDevMode &&
      serve({
        contentBase: ['dist'],
        port: DEV_PORT,
        host: '127.0.0.1',
      }),
  ),

  // 单独打包每个站点的代码
  ...siteFileList.map((fileName) =>
    buildConfig({
      input: { [fileName.split('.')[0]]: `src/site/${fileName}` },
      output: {
        dir: 'dist',
        format: 'cjs',
        generatedCode: 'es2015',
        exports: 'none',
        strict: false,
        inlineDynamicImports: true,
      },
      context: 'this',
      onwarn(warning, warn) {
        // 禁用使用 eval 的警告
        if (warning.code !== 'EVAL') warn(warning);
      },
    }),
  ),

  // 生成组件相关代码
  buildConfig({
    input: 'src/components/index.ts',
    output: {
      file: 'dist/components.js',
      format: 'cjs',
      generatedCode: 'es2015',
      strict: false,
    },
  }),
  // 生成自定义动态导入的代码
  buildConfig(
    {
      input: 'src/helper/import.ts',
      output: {
        file: 'dist/import.js',
        plugins: [
          {
            name: 'injectCode',
            renderChunk(code) {
              let newCode = code;
              // 将 ts 变量声明替换为 dist 下的文件代码，并转为字符串型变量做好处理
              newCode = newCode.replace(
                /const (\w+)Code = ['"]{2};(?=\n)/g,
                (_, name) =>
                  `const ${name}Code = \`\n${fs
                    .readFileSync(`./dist/${name}.js`)
                    .toString()
                    .replaceAll('\\', '\\\\')
                    .replaceAll('`', '\\`')
                    .replaceAll('${', '\\${')}\`;\n`,
              );
              return newCode;
            },
          },
        ],
      },
    },
    watchAssets({ assets: ['dist/components.js'] }),
  ),

  // 编译 index.user.js
  {
    input: 'src/index.tsx',
    output: {
      file: 'dist/index.user.js',
      format: 'cjs',
      generatedCode: 'es2015',
      exports: 'none',
      plugins: [
        {
          name: 'injectSiteCode',
          renderChunk(code) {
            let newCode = code;
            // 根据注释替换导入为 dist 下的文件代码
            newCode = newCode.replace(
              /(?<=\n)\s*\/\/ #(.+)(?=\n)/g,
              (_, name) => fs.readFileSync(`./dist/${name}.js`)?.toString(),
            );
            // 删除 export 语句
            newCode = newCode.replace(/\nexport.+};\n/g, '');
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
      watchAssets({
        assets: ['dist/*', '!dist/index.user.js', '!dist/components.js'],
      }),
    ],
    treeshake: false,
  },
];
