import chalk from 'chalk';
import { writeFileSync } from 'node:fs';
import { type RolldownPlugin } from 'rolldown';

import { categoryMap, updateCategoryMap } from './ctx';
import { readFile } from './utils';

/** 中文分类到英文分类的映射，用于生成英文版的站点列表 */
const categoryEn: Record<string, string> = {
  '漫画站（中文）': 'Manga Sites (Chinese)',
  'R18（中文）': 'R18 (Chinese)',
  R18: 'R18',
  漫画站: 'Manga Sites',
  Fanbox: 'Fanbox',
  其他: 'Others',
  自部署: 'Self-hosted',
};

/** 中文注释（<sup>合订</sup>、<sup>选页</sup>）到英文注释的映射，用于生成英文版的站点列表（E-Hentai 不在自动生成列表中，属手动维护） */
const noteEn: Record<string, string> = {
  合订: 'merged',
  选页: 'select pages',
};

const README_PATH = 'README.md';
const INDEX_MD_PATH = 'docs/index.md';
const EN_MD_PATH = 'docs/index.en.md';

/** 生成带 favicon 图标的 img 标签 */
const buildFavicon = (url: string): string => {
  const { origin } = new URL(url);
  const faviconUrl = `https://t0.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${origin}&size=16`;
  return `<img src="${faviconUrl}" style="width:1em;height:1em;" loading="lazy">`;
};

/** 根据 src/index.ts 的 categoryMap 渲染站点列表文本 */
const renderList = (lang: 'zh' | 'en'): string =>
  [...categoryMap.entries()]
    .map(([category, links]) => {
      const categoryName =
        lang === 'en' ? (categoryEn[category] ?? category) : category;
      if (
        lang === 'en' &&
        categoryName === category &&
        !/^[A-Za-z0-9\s]+$/u.test(category)
      ) {
        console.warn(
          chalk.yellow(
            `  ⚠ supportSiteList 缺英译分类「${category}」，已回退为中文`,
          ),
        );
      }
      const linkWithNote = (link: string) => {
        const match = /\[(?<text>.+?)\]\((?<url>.+?)\)(?<note>.*)/u.exec(
          link,
        )?.groups;
        if (!match) return link;
        const { text, url, note } = match;
        const noteText =
          lang === 'en'
            ? Object.entries(noteEn).reduce(
                (acc, [zh, en]) => acc.replaceAll(zh, en),
                note,
              )
            : note;
        return `<a href="${url}">${buildFavicon(url)} ${text}</a>${noteText}`;
      };
      return `### ${categoryName}\n\n${links.map(linkWithNote).join(' · ')}`;
    })
    .join('\n\n');

/** 把 md 中 supportSiteList 区块替换为指定语言列表 */
const replaceList = (md: string, list: string): string =>
  md.replace(
    /<!-- supportSiteList -->[\s\S]*?<!-- supportSiteList -->/u,
    `<!-- supportSiteList -->\n\n${list}\n\n<!-- supportSiteList -->`,
  );

/** 把相对链接改成文档外链，以便在 greasyfork 等外站正常显示图片 */
const toExternalLinks = (md: string): string =>
  md.replaceAll('/docs/public/', 'https://comic-read-docs.pages.dev/');

/** 仅当内容变化时才写入文件 */
const writeIfChanged = (path: string, content: string): void => {
  if (content !== readFile(path)) writeFileSync(path, content);
};

/** 根据 src/index.ts 中的注释维护 README 和 docs/ 下的站点列表 */
export const docGeneratorPlugin = (): RolldownPlugin => ({
  name: 'doc-generator',
  buildStart() {
    updateCategoryMap();

    const readmeMd = replaceList(readFile(README_PATH), renderList('zh'));
    // 更新 README.md 中的中文站点列表
    writeIfChanged(README_PATH, readmeMd);

    // 生成用于 greasyfork 介绍的 docs/index.md
    writeIfChanged(INDEX_MD_PATH, toExternalLinks(readmeMd));

    // 生成英文版 readme，正文手动维护，仅更新覆盖站点列表
    writeIfChanged(
      EN_MD_PATH,
      toExternalLinks(replaceList(readFile(EN_MD_PATH), renderList('en'))),
    );
  },
});
