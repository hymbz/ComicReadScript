import chalk from 'chalk';
import { readFileSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { type RolldownOptions, type RolldownPlugin, watch } from 'rolldown';
import shell from 'shelljs';
import { minify } from 'terser';

import { isDevMode, rootDir } from './ctx';

export const readFile = (path: string) => readFileSync(path, 'utf8');

export const pathResolve = (...paths: string[]) =>
  resolvePath(rootDir, ...paths);

export const minifyCode = async (code: string) => {
  const res = await minify(code, { ecma: 2020, mangle: false });
  return res.code || code;
};

export const cleanDist = () => shell.rm('-rf', pathResolve('dist'));

export const startDevServer = () => {
  shell.exec('pnpm serve dist --cors -l 2405', {
    async: true,
    silent: true,
  });
};

const formatInputName = (input: string) =>
  input.replace(/^.*?[/\\]src[/\\]/u, '').replace(/(?<_>\/index)?\.tsx?$/u, '');

const getDistRelative = (outputPath: string) =>
  outputPath.replaceAll('\\', '/').replace(/^.*\/dist\/?/u, '');

const getOutputName = (configs: RolldownOptions[]) => {
  const files = configs.map(
    (c) =>
      getDistRelative((c.output as { file?: string })?.file ?? '') ||
      formatInputName(c.input as string),
  );
  return files.length === 1 ? files[0] : files.join(', ');
};

export const buildLoggerPlugin = (): RolldownPlugin => {
  let startTime = 0;

  return {
    name: 'build-logger',
    renderStart() {
      startTime = performance.now();
    },
    writeBundle(outputOptions) {
      const duration = Math.round(performance.now() - startTime);
      console.log(
        chalk.green(
          `  ✓ ${getDistRelative(outputOptions.file!)} (${duration}ms)`,
        ),
      );
    },
  };
};

export const runWatcher = async (
  ...stages: RolldownOptions[][]
): Promise<(() => void)[]> => {
  const closes: (() => void)[] = [];

  for (const configs of stages) {
    closes.push(
      await new Promise<() => void>((resolve, reject) => {
        const watcher = watch(configs);

        watcher.on('event', (event) => {
          switch (event.code) {
            case 'BUNDLE_END':
              void event.result.close();
              break;
            case 'END':
              if (!isDevMode) void watcher.close();
              resolve(() => watcher.close());
              break;
            case 'ERROR':
              console.error(
                chalk.red(`  ✗ ${getOutputName(configs)} 构建失败:`),
                event.error,
              );
              if (!isDevMode)
                reject(
                  event.error instanceof Error
                    ? event.error
                    : new Error('构建失败'),
                );
              break;
          }
        });
      }),
    );
  }

  return closes;
};
