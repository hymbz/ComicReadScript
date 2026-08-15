import { writeFileSync } from 'node:fs';
import { type RolldownPlugin } from 'rolldown';

import { categoryMap, updateCategoryMap } from './ctx';
import { readFile } from './utils';

/** 根据 src/index.ts 中的注释维护 README 和 docs/index.md 中的站点列表 */
export const docGeneratorPlugin = (): RolldownPlugin => ({
  name: 'doc-generator',
  buildStart() {
    updateCategoryMap();

    const readmePath = 'README.md';
    const readmeMd = readFile(readmePath);

    const newMd = readmeMd.replace(
      /(?<=<!-- supportSiteList -->\n\n).*(?=\n\n<!-- supportSiteList -->)/su,
      [...categoryMap.entries()]
        .map(([category, links]) => {
          const linkWithFavicon = (link: string) => {
            const match = /\[(?<text>.+?)\]\((?<url>.+?)\)(?<note>.*)/u.exec(
              link,
            )?.groups;
            if (!match) return link;
            const { text, url, note } = match;
            const { origin } = new URL(url);
            const faviconUrl = `https://t0.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${origin}&size=16`;
            return `<a href="${url}"><img src="${faviconUrl}" style="width:1em;height:1em;" loading="lazy"> ${text}</a>${note}`;
          };
          return `### ${category}\n\n${Array.from(links, linkWithFavicon).join(' · ')}`;
        })
        .join('\n\n'),
    );
    if (newMd !== readmeMd) writeFileSync(readmePath, newMd);

    // 生成一个用于 greasyfork 介绍的 md 文件，把相对链接改成文档外链，以便正常显示图片
    const outMdPath = 'docs/index.md';
    const newOutMd = newMd.replaceAll(
      '/docs/public/',
      'https://comic-read-docs.pages.dev/',
    );
    if (newOutMd !== readFile(outMdPath)) writeFileSync(outMdPath, newOutMd);
  },
});
