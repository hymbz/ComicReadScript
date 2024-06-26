import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readFileSync } from 'node:fs';

import shell from 'shelljs';
import release from 'release-it';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const exec = (...commands) => {
  const res = shell.exec(commands.join(' && '), {
    silent: false,
    fatal: true,
  });
  if (res.code !== 0) shell.exit(1);
  return res;
};

(async () => {
  if (process.argv.slice(2).includes('push')) {
    const { version } = JSON.parse(readFileSync('./package.json'));

    // 打包代码
    exec('pnpm build');

    // 将打包出来的脚本文件复制到根目录上
    shell.cp(
      '-f',
      path.join(__dirname, './dist/index.js'),
      path.join(__dirname, './ComicRead.user.js'),
    );
    shell.cp(
      '-f',
      path.join(__dirname, './dist/adguard.js'),
      path.join(__dirname, './ComicRead-AdGuard.user.js'),
    );

    // 提交上传更改
    exec(
      'git add .',
      `git commit -m "chore: :bookmark: Release ${version}"`,
      `git tag --annotate v${version} --message="Release ${version}"`,
      'git push --follow-tags',
    );
    return;
  }

  // 测试
  exec('pnpm test run');
  exec('pnpm check');

  // 使用 release-it 更新版本，并获得更新日志
  const { changelog } = await release({
    ci: true,
    git: {
      requireCommits: true,
      commit: false,
      tag: false,
      push: false,
    },
    plugins: {
      '@release-it/conventional-changelog': {
        preset: 'conventionalcommits',
        infile: 'docs/.other/CHANGELOG.md',
      },
    },
  });

  // 将最新的更改日志写入 LatestChange.md
  shell.echo(changelog).to('docs/.other/LatestChange.md');
})();
