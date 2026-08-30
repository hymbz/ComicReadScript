import chalk from 'chalk';
import fs from 'node:fs';

import { buildAdGuard, buildUMD } from './additional-variants';
import { isDevMode } from './lib/ctx';
import { docGeneratorPlugin } from './lib/doc-generator';
import {
  devPacklist,
  packlist,
} from './lib/packlist.json' with { type: 'json' };
import { createBundleConfigs } from './lib/shared-config';
import { transforms } from './lib/transforms';
import {
  cleanDist,
  pathResolve,
  runWatcher,
  startDevServer,
} from './lib/utils';
import { virtualPacklistPlugin } from './lib/virtual-packlist-plugin';

console.log(chalk.blue.bold('\n开始构建'));

cleanDist();
if (isDevMode) startDevServer();

const siteList = fs
  .readdirSync(pathResolve('src/site'), { withFileTypes: true })
  .map((item) =>
    item.isFile() ? `site/${item.name}` : `site/${item.name}/index.tsx`,
  );

const mainPacklist = isDevMode ? [...packlist, ...devPacklist] : packlist;

const closes = await runWatcher(
  ...createBundleConfigs(
    [
      ...mainPacklist,
      ...siteList,
      { path: 'dev', transforms: [transforms.dev] },
    ],
    [
      {
        path: 'userscript/import',
        plugins: [
          virtualPacklistPlugin([
            ...mainPacklist,
            ...siteList.map((path) =>
              path.replace(/(?<_>\/index)?\.tsx?/u, ''),
            ),
          ]),
        ],
      },
    ],
    [
      {
        path: 'index',
        transforms: [transforms.importEmbed],
        plugins: [docGeneratorPlugin()],
      },
    ],
  ),
);

process.on('SIGINT', () => {
  for (const close of closes) close();
  process.exit();
});

if (!isDevMode) {
  await buildAdGuard();
  await buildUMD();
  console.log(chalk.blue.bold('\n构建完成'));
}
