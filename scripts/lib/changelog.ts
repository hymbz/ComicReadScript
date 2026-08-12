import { writeFileSync } from 'node:fs';
import shell from 'shelljs';

import pkg from '../../package.json' with { type: 'json' };
import { pathResolve, readFile } from './utils';

const repoUrl = 'https://github.com/hymbz/ComicReadScript';
/** sleazyfork 上该脚本的 id */
const scriptId = '374903';

type CommitInfo = {
  /** 完整 hash */
  hash: string;
  /** 短 hash */
  short: string;
  /** 提交标题 */
  subject: string;
  /** 提交正文 */
  body: string;
};

type Ref = {
  /** 链接文字 */
  text: string;
  /** 完整链接 */
  url: string;
};

type ParsedCommit = {
  type: 'feat' | 'fix' | 'perf';
  subject: string;
  breaking: boolean;
  refs: Ref[];
};

const sectionTitle: Record<ParsedCommit['type'], string> = {
  feat: 'Features',
  fix: 'Bug Fixes',
  perf: 'Performance Improvements',
};

/** 获取最新的版本 tag */
const getLatestTag = () => {
  const res = shell.exec('git tag --list "v*" --sort=-version:refname', {
    silent: true,
  });
  if (res.code !== 0) shell.exit(1);
  const [tag] = res.stdout.trim().split('\n');
  if (!tag) throw new Error('未找到版本 tag，无法生成 CHANGELOG');
  return tag;
};

/** 获取某 tag 之后的提交（跳过合并提交） */
const getCommits = (tag: string): CommitInfo[] => {
  const res = shell.exec(
    `git log ${tag}..HEAD --no-merges --abbrev=7 --format=%x1E%H%x1F%h%x1F%s%x1F%b`,
    { silent: true },
  );
  if (res.code !== 0) shell.exit(1);
  return res.stdout
    .split('\u001E')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((line) => {
      const [hash, short, subject, body] = line.split('\u001F');
      return { hash, short, subject, body: body ?? '' };
    });
};

const sleazyforkUrl = (discussionId: string, commentId: string) =>
  `https://sleazyfork.org/scripts/${scriptId}/discussions/${discussionId}#comment-${commentId}`;

/**
 * 解析提交正文中的 closes 引用
 * 支持：sleazyfork 完整 URL、`数字#comment-数字` 短格式、`#数字` github issue
 */
const parseRefs = (body: string): Ref[] => {
  const refs: Ref[] = [];
  const addRef = (text: string, url: string) => {
    if (!refs.some((ref) => ref.text === text)) refs.push({ text, url });
  };

  // 完整 URL，匹配后移除避免与短格式重复
  const urlPattern =
    /https:\/\/sleazyfork\.org\/scripts\/\d+\/discussions\/(\d+)#comment-(\d+)/g;
  const rest = body.replace(urlPattern, (url, id, comment) => {
    addRef(`${id}#comment-${comment}`, url);
    return '';
  });

  // sleazyfork 短格式
  for (const m of rest.matchAll(/(?:^|\s)(\d+)#comment-(\d+)/g)) {
    addRef(`${m[1]}#comment-${m[2]}`, sleazyforkUrl(m[1], m[2]));
  }
  // github issue
  for (const m of rest.matchAll(/#(\d+)/g)) {
    addRef(`#${m[1]}`, `${repoUrl}/issues/${m[1]}`);
  }
  return refs;
};

/** 解析 conventional commit，非 feat/fix/perf 类型返回 null（不进入 CHANGELOG） */
const parseCommit = (commit: CommitInfo): ParsedCommit | null => {
  const match = /^(feat|fix|perf)(?:\(.+?\))?(!)?:\s*(.+)$/.exec(
    commit.subject,
  );
  if (!match) return null;
  const type = match[1] as ParsedCommit['type'];
  const breaking =
    Boolean(match[2]) || /^BREAKING[\s-]CHANGE:/m.test(commit.body);
  return { type, subject: match[3], breaking, refs: parseRefs(commit.body) };
};

const formatItem = (commit: CommitInfo, parsed: ParsedCommit) => {
  const commitLink = `([${commit.short}](${repoUrl}/commit/${commit.hash}))`;
  const closes =
    parsed.refs.length > 0
      ? `, closes ${parsed.refs.map((ref) => `[${ref.text}](${ref.url})`).join(' ')}`
      : '';
  return `- ${parsed.subject} ${commitLink}${closes}`;
};

/** 根据提交类型推断新版本号：breaking→major、feat→minor、其余→patch */
const bumpVersion = (version: string, parsedList: ParsedCommit[]) => {
  const [major, minor, patch] = version.split('.').map(Number);
  if (parsedList.some((c) => c.breaking)) {
    return `${major + 1}.0.0`;
  }
  if (parsedList.some((c) => c.type === 'feat')) {
    return `${major}.${minor + 1}.0`;
  }
  return `${major}.${minor}.${patch + 1}`;
};

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * 根据最后一次发布以来的提交生成新版本的 CHANGELOG 段落，
 * 并更新 package.json 的版本号、将段落插入 docs/.other/CHANGELOG.md。
 * 返回新段落文本，供写入 LatestChange.md。
 */
export const generateChangelog = () => {
  const latestTag = getLatestTag();
  const commits = getCommits(latestTag);
  if (commits.length === 0) throw new Error('自上次发布后没有新的提交');

  const parsedList = commits
    .map((commit) => ({ commit, parsed: parseCommit(commit) }))
    .filter(
      (item): item is { commit: CommitInfo; parsed: ParsedCommit } =>
        item.parsed !== null,
    );

  const oldVersion = latestTag.replace(/^v/, '');
  const newVersion = bumpVersion(
    oldVersion,
    parsedList.map((item) => item.parsed),
  );

  // 更新 package.json 的版本号
  pkg.version = newVersion;
  writeFileSync(
    pathResolve('package.json'),
    `${JSON.stringify(pkg, null, 2)}\n`,
  );

  // 生成新版本段落
  const sections = (['feat', 'fix', 'perf'] as const)
    .map((type) => {
      const items = parsedList
        .filter((item) => item.parsed.type === type)
        .map((item) => formatItem(item.commit, item.parsed));
      return items.length > 0
        ? `### ${sectionTitle[type]}\n\n${items.join('\n')}`
        : '';
    })
    .filter(Boolean)
    .join('\n\n');

  const section = `## [${newVersion}](${repoUrl}/compare/v${oldVersion}...v${newVersion}) (${formatDate(new Date())})\n\n${sections}`;

  // 将新段落插入 CHANGELOG.md 的标题之下
  const changelogPath = pathResolve('docs/.other/CHANGELOG.md');
  const oldChangelog = readFile(changelogPath);
  const newChangelog = oldChangelog.startsWith('# Changelog\n\n')
    ? oldChangelog.replace(/^# Changelog\n\n/, `# Changelog\n\n${section}\n\n`)
    : `# Changelog\n\n${section}\n\n${oldChangelog}`;
  writeFileSync(changelogPath, newChangelog);

  return section;
};
