import { writeFileSync } from 'node:fs';
import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import shell from 'shelljs';

import {
  computeChangelog,
  finalizeChangelog,
  writeLatestChange,
} from './lib/changelog';
import { pathResolve, readFile } from './lib/utils';

const exec = (...commands: string[]) => {
  const res = shell.exec(commands.join(' && '), {
    silent: false,
    fatal: true,
  });
  if (res.code !== 0) shell.exit(1);
  return res;
};

/** 在终端打印提示，等待用户回车后继续 */
const confirm = async (message: string) => {
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    return await rl.question(message);
  } finally {
    rl.close();
  }
};

// 前置检查
exec('pnpm check');
exec('pnpm test run');

// 计算新版本与变更日志段落，并写入 LatestChange.md
const { section, version, date } = computeChangelog();
writeLatestChange(section);
await confirm('已生成 LatestChange.md，回车继续…');

// 根据编辑后的 LatestChange.md 生成 CHANGELOG.md、CHANGELOG.json，并更新 package.json
finalizeChangelog(version, date);
exec('pnpm check');
await confirm(
  '已更新 CHANGELOG.md、CHANGELOG.json 与 package.json，确认无误后回车开始发布…',
);

// 打包代码
exec('pnpm build');

// 将打包出来的脚本文件复制到根目录上
shell.cp(
  '-f',
  pathResolve('./dist/index.js'),
  pathResolve('./ComicRead.user.js'),
);
shell.cp(
  '-f',
  pathResolve('./dist/adguard.js'),
  pathResolve('./ComicRead-AdGuard.user.js'),
);

shell.cp(
  '-f',
  pathResolve('./dist/umd.js'),
  pathResolve('./ComicReader.umd.js'),
);
shell.cp(
  '-f',
  pathResolve('./dist/umd.d.ts'),
  pathResolve('./ComicReader.umd.d.ts'),
);

const code = readFile(pathResolve('./ComicRead.user.js'));
writeFileSync(
  pathResolve('./ComicRead-jsDelivr.user.js'),
  code.replaceAll(
    /registry\.npmmirror\.com\/(?<pkg>.+)\/(?<version>\d+\.\d+\.\d)\/files\/(?<file>.+)/gu,
    'cdn.jsdelivr.net/npm/$<pkg>@$<version>/$<file>',
  ),
);

// 提交上传更改
exec(
  'git add .',
  `git commit -m "chore: :bookmark: Release ${version}"`,
  `git tag --annotate v${version} --message="Release ${version}"`,
  'git push --follow-tags',
  'npm publish',
);
