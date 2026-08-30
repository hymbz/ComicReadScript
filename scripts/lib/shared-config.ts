import browserslistToEsbuild from 'browserslist-to-esbuild';
import { type RolldownOptions, type RolldownPluginOption } from 'rolldown';
import Solid from 'unplugin-solid/rolldown';

import latestChanges from '../../docs/.other/CHANGELOG.json' with { type: 'json' };
import { cssModules, outputPlugins, solidSvg } from '../plugin';
import { type TransformFn, codeEdit } from '../plugin/codeEdit';
import { isDevMode, meta } from './ctx';
import { devPacklist, packlist } from './packlist.json' with { type: 'json' };
import { buildLoggerPlugin, pathResolve } from './utils';

const externalPacklist = [...packlist, ...devPacklist];

/** 单个构建项配置 */
type BundleItemOpts = {
  path: string;
  transforms?: TransformFn[];
  file?: string;
  plugins?: RolldownPluginOption[];
  output?: RolldownOptions['output'];
};

export const createBundleConfigs = (
  ...layers: (string | BundleItemOpts)[][]
): RolldownOptions[][] => {
  const base = {
    external: [
      ...Object.keys(meta.resource ?? {}),
      ...externalPacklist,
      'core',
      /^solid/u,
      ...externalPacklist.map(
        (p) =>
          new RegExp(
            `^${p.replaceAll(
              /[.*+?^${}()|[\]\\]/gu,
              String.raw`\$&`,
            )}(?:[\\\\/]|$)`,
            'u',
          ),
      ),
    ],
    output: {
      format: 'cjs',
      strict: false,
      generatedCode: { preset: 'es2015', symbols: false },
      extend: true,
      esModule: false,
      externalLiveBindings: false,
    },
    resolve: {
      alias: {
        helper: pathResolve('src/helper'),
        worker: pathResolve('src/worker'),
        'components/Manga': pathResolve('src/components/Manga'),
      },
    },
    transform: {
      target: browserslistToEsbuild(),
      define: {
        isDevMode: isDevMode ? 'true' : 'false',
        'process.env.NODE_ENV': isDevMode ? "'development'" : "'production'",
        __LATEST_CHANGES__: JSON.stringify(latestChanges),
        scriptVersion: JSON.stringify(meta.version),
      },
    },
  } satisfies RolldownOptions;

  const build = ({
    path,
    file,
    transforms,
    plugins: itemPlugins,
    output,
  }: BundleItemOpts): RolldownOptions =>
    ({
      ...base,
      input: pathResolve('src', path),
      plugins: [
        cssModules(),
        solidSvg(),
        Solid(),
        {
          name: 'self-import',
          transform(code, id) {
            if (!/.+\.tsx?$/u.test(id)) return null;
            // rollldown 对 import * as 的处理会导致脚本加载机制失效，
            // 为了兼容 vite，不能直接删掉 `* as`，只能在这里修改代码。
            return code.replaceAll(/import \* as \b/gu, 'import ');
          },
        },
        ...(transforms ?? []).map((fn) => codeEdit('selfPlugin', fn)),
        ...(itemPlugins ?? []),
        ...outputPlugins,
      ],
      output: {
        ...(base.output as Record<string, unknown>),
        ...(output as Record<string, unknown> | undefined),
        file: pathResolve(
          file ?? `dist/${path.replace(/(?<_>\/index)?\.tsx?/u, '')}.js`,
        ),
        plugins: [
          buildLoggerPlugin(),
          {
            name: 'clean-indirect',
            renderChunk(code: string) {
              return code.replaceAll(
                /\(0,\s*(?<name>\w+(?:\.\w+)+)\)/gu,
                '$<name>',
              );
            },
          },
        ],
      },
      onLog: (level, log, defaultHandler) => {
        if (level !== 'warn') return defaultHandler(level, log);
        switch (log.code) {
          case 'UNUSED_EXTERNAL_IMPORT':
          case 'EVAL':
            return;
          default:
            defaultHandler(level, log);
        }
      },
    }) as RolldownOptions;

  return layers.map((items) =>
    items.map((item) =>
      build(typeof item === 'string' ? { path: item } : item),
    ),
  );
};
