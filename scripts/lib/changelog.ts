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

/** 收集进 CHANGELOG 的提交类型，也决定 CHANGELOG.json 的分组与展示顺序 */
const changeTypes = ['feat', 'fix', 'perf'] as const;
type ChangeType = (typeof changeTypes)[number];

type ParsedCommit = {
  type: ChangeType;
  subject: string;
  breaking: boolean;
  refs: Ref[];
};

const sectionTitle: Record<ChangeType, string> = {
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
    /https:\/\/sleazyfork\.org\/scripts\/\d+\/discussions\/(?<id>\d+)#comment-(?<comment>\d+)/gu;
  const rest = body.replace(urlPattern, (url, id, comment) => {
    addRef(`${id}#comment-${comment}`, url);
    return '';
  });

  // sleazyfork 短格式
  for (const {
    groups: { id, comment },
  } of rest.matchAll(/(?:^|\s)(?<id>\d+)#comment-(?<comment>\d+)/gu)) {
    addRef(`${id}#comment-${comment}`, sleazyforkUrl(id, comment));
  }

  // github issue
  for (const {
    groups: { id },
  } of rest.matchAll(/#(?<id>\d+)/gu)) {
    addRef(`#${id}`, `${repoUrl}/issues/${id}`);
  }

  return refs;
};

/** 解析 conventional commit，非 feat/fix/perf 类型返回 null（不进入 CHANGELOG） */
const parseCommit = (commit: CommitInfo): ParsedCommit | null => {
  const match =
    /^(?<type>feat|fix|perf)(?:\(.+?\))?(?<breaking>!)?:\s*(?<subject>.+)$/u.exec(
      commit.subject,
    )?.groups;
  if (!match) return null;
  return {
    type: match.type as ParsedCommit['type'],
    subject: match.subject,
    breaking:
      Boolean(match.breaking) || /^BREAKING[\s-]CHANGE:/mu.test(commit.body),
    refs: parseRefs(commit.body),
  };
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

  const oldVersion = latestTag.replace(/^v/u, '');
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
  const sections = changeTypes
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
    ? oldChangelog.replace(/^# Changelog\n\n/u, `# Changelog\n\n${section}\n\n`)
    : `# Changelog\n\n${section}\n\n${oldChangelog}`;
  writeFileSync(changelogPath, newChangelog);

  // 生成记录到 CHANGELOG.json 的变更数据，只保留描述
  const changeJson: Record<string, string[]> = {};
  for (const type of changeTypes) {
    const items = parsedList
      .filter((item) => item.parsed.type === type)
      .map((item) => item.parsed.subject.replace(/^:\w+: /u, '').trim());
    if (items.length > 0) changeJson[type] = items;
  }

  // 将新版本记录到 CHANGELOG.json 顶部，并裁剪掉 3 个月前的记录
  const changesPath = pathResolve('docs/.other/CHANGELOG.json');
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 3);
  const changes: Record<string, { date: string }> = JSON.parse(
    readFile(changesPath),
  );
  const nextChanges = {
    [newVersion]: { date: formatDate(new Date()), ...changeJson },
    ...changes,
  };
  writeFileSync(
    changesPath,
    `${JSON.stringify(
      Object.fromEntries(
        Object.entries(nextChanges).filter(
          ([, entry]) => entry.date >= formatDate(cutoff),
        ),
      ),
      null,
      2,
    )}\n`,
  );

  return section;
};
