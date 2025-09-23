import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import release from 'release-it';
import shell from 'shelljs';

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

    shell.cp(
      '-f',
      path.join(__dirname, './dist/umd.js'),
      path.join(__dirname, './ComicReader.umd.js'),
    );
    shell.cp(
      '-f',
      path.join(__dirname, './dist/umd.d.ts'),
      path.join(__dirname, './ComicReader.umd.d.ts'),
    );

    const code = readFileSync(
      path.join(__dirname, './ComicRead.user.js'),
      'utf8',
    );
    writeFileSync(
      path.join(__dirname, './ComicRead-jsDelivr.user.js'),
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
    return;
  }

  // 测试
  exec('pnpm check');
  exec('pnpm test run');

  // 使用 release-it 更新版本，并获得更新日志
  const { changelog } = await release({
    ci: true,
    npm: { publish: false },
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
