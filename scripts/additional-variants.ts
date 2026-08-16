import chalk from 'chalk';
import { generateDtsBundle } from 'dts-bundle-generator';
import fs from 'node:fs';

import { meta } from './lib/ctx';
import { umdPacklist } from './lib/packlist.json' with { type: 'json' };
import { createBundleConfigs } from './lib/shared-config';
import { transforms } from './lib/transforms';
import { minifyCode, pathResolve, runWatcher } from './lib/utils';
import { virtualPacklistPlugin } from './lib/virtual-packlist-plugin';

export const buildAdGuard = async () => {
  const [stage] = createBundleConfigs([
    {
      path: 'index',
      file: 'dist/adguard.js',
      transforms: [transforms.importEmbed, transforms.adGuard],
    },
  ]);
  await runWatcher(stage);
};

export const buildUMD = async () => {
  const siteList = fs
    .readdirSync(pathResolve('src/site'), { withFileTypes: true })
    .map((item) =>
      item.isFile() ? `site/${item.name}` : `site/${item.name}/index.tsx`,
    );

  const siteOutPaths = siteList.map((path) =>
    path.replace(/(?<_>\/index)?\.tsx?/u, ''),
  );

  // 提前 fetch CDN 资源，内联到 libCodeMap 中使 UMD 包完全自包含
  const extraEntries: Record<string, string> = {};
  for (const [name, url] of Object.entries(meta.resource)) {
    const res = await fetch(url);
    let code = await res.text();

    if (name === '@tensorflow/tfjs-backend-webgpu')
      code = code.replace('@tensorflow/tfjs-core', '@tensorflow/tfjs');

    extraEntries[name] = await minifyCode(code);
  }

  const [stage] = createBundleConfigs([
    {
      path: 'userscript/import',
      file: 'dist/umd/import.js',
      plugins: [
        virtualPacklistPlugin([...umdPacklist, ...siteOutPaths], extraEntries),
      ],
    },
    {
      path: 'umd',
      file: 'dist/umd.js',
      transforms: [transforms.umdMain],
      // 显式指定 named 避免 MIXED_EXPORTS 警告
      output: { exports: 'named' },
    },
  ]);
  const [umdImport, umdMain] = stage;

  await runWatcher([umdImport]);
  await runWatcher([umdMain]);

  const start = performance.now();
  try {
    const [code] = generateDtsBundle(
      [
        {
          filePath: pathResolve('src/umd.tsx'),
          output: { noBanner: true },
        },
      ],
      { preferredConfigPath: pathResolve('tsconfig.json') },
    );

    const { writeFile } = await import('node:fs/promises');
    await writeFile(pathResolve('dist/umd.d.ts'), code);

    console.log(
      chalk.green(`  ✓ umd.d.ts (${Math.round(performance.now() - start)}ms)`),
    );
  } catch (error) {
    console.error(chalk.red('  ✗ umd.d.ts 构建失败:'), error);
    process.exit(1);
  }
};
