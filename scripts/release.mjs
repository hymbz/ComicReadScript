import { fileURLToPath } from 'url';
import path from 'path';
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
  // 测试
  exec('pnpm test run');

  // 使用 release-it 更新版本，并获得更新日志
  const { changelog, version } = await release({
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
        infile: 'docs/CHANGELOG.md',
      },
    },
  });

  // 将最新的更改日志写入 LatestChange.md
  shell.echo(changelog).to('docs/LatestChange.md');

  // 打包代码
  exec(
    'pnpm --filter @crs/ui-component build',
    'pnpm --filter @crs/userscript build',
  );

  // 将打包出来的脚本文件复制到根目录上
  shell.cp(
    '-f',
    path.join(__dirname, '../packages/userscript/dist/index.user.js'),
    path.join(__dirname, '../ComicRead.user.js'),
  );

  // 提交上传更改
  exec(
    'git add .',
    `git commit -m "chore: :bookmark: Release ${version}"`,
    `git tag --annotate v${version} --message="Release ${version}"`,
    'git push --follow-tags',
  );
})();
