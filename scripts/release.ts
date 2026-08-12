import { writeFileSync } from 'node:fs';
import shell from 'shelljs';

import packageJson from '../package.json';
import { generateChangelog } from './lib/changelog';
import { pathResolve, readFile } from './lib/utils';

const exec = (...commands: string[]) => {
  const res = shell.exec(commands.join(' && '), {
    silent: false,
    fatal: true,
  });
  if (res.code !== 0) shell.exit(1);
  return res;
};

if (process.argv.slice(2).includes('push')) {
  const { version } = packageJson;

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
      /registry\.npmmirror\.com\/(.+)\/(\d+\.\d+\.\d)\/files\/(.+)/g,
      'cdn.jsdelivr.net/npm/$1@$2/$3',
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
} else {
  // 测试
  exec('pnpm check');
  exec('pnpm test run');

  // 生成新版本的 CHANGELOG，更新 package.json 的版本号
  const changelog = generateChangelog();

  // 将最新的更改日志写入 LatestChange.md
  shell.echo(changelog).to(pathResolve('./docs/.other/LatestChange.md'));
}
