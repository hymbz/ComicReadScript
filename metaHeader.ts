import fs from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import pkg from './package.json' assert { type: 'json' };
import zh from './locales/zh.json' assert { type: 'json' };
import en from './locales/en.json' assert { type: 'json' };
import ru from './locales/ru.json' assert { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * 脚本依赖库与对应的 cdn url
 * 数组里的第一个 url 是生产模式下使用的，第二个是开发模式下使用的
 * 只有一个 url 表示不区分生产开发模式
 */
const resourceList: Record<string, [string, string] | [string]> = {
  'solid-js': [
    'https://registry.npmmirror.com/solid-js/1.8.17/files/dist/solid.cjs',
    'https://registry.npmmirror.com/solid-js/1.8.17/files/dist/dev.cjs',
  ],
  'solid-js/store': [
    'https://registry.npmmirror.com/solid-js/1.8.17/files/store/dist/store.cjs',
    'https://registry.npmmirror.com/solid-js/1.8.17/files/store/dist/dev.cjs',
  ],
  'solid-js/web': [
    'https://registry.npmmirror.com/solid-js/1.8.17/files/web/dist/web.cjs',
    'https://registry.npmmirror.com/solid-js/1.8.17/files/web/dist/dev.cjs',
  ],
  fflate: ['https://registry.npmmirror.com/fflate/0.8.2/files/umd/index.js'],
  'qr-scanner': [
    'https://registry.npmmirror.com/qr-scanner/1.4.2/files/qr-scanner.legacy.min.js',
  ],
  dmzjDecrypt: [
    'https://greasyfork.org/scripts/467177/code/dmzjDecrypt.js?version=1207199',
  ],
};

const resource = {
  dev: {} as Record<string, string | undefined>,
  prod: {} as Record<string, string | undefined>,
};
for (const [k, v] of Object.entries(resourceList)) {
  resource.prod[k] = v.at(0);
  resource.dev[k] = v.at(-1);
}

/** 根据 index.ts 的注释获取支持站点列表 */
const getSupportSiteList = () => {
  const indexCode = fs.readFileSync(resolve(__dirname, 'src/index.ts'), 'utf8');
  /** 支持站点列表 */
  return [...indexCode.matchAll(/(?<=\n\s+\/\/\s#).+(?=\n)/g)].map((e) => e[0]);
};

/** 更新 README 上的支持站点列表 */
export const updateReadme = () => {
  const readmePath = resolve(__dirname, 'README.md');
  const readmeMd = fs.readFileSync(readmePath, 'utf8');
  const newMd = readmeMd.replace(
    /(?<=<!-- supportSiteList -->\n\n).*(?=\n\n<!-- supportSiteList -->)/s,
    getSupportSiteList()
      .slice(7)
      .map((siteText) => `- ${siteText}`)
      .join('\n'),
  );
  if (newMd !== readmeMd) fs.writeFileSync(readmePath, newMd);

  // 生成一个用于 greasyfork 介绍的 md 文件，把相对链接改成文档外链，以便正常显示图片
  const outMdPath = resolve(__dirname, 'docs/index.md');
  const outMd = fs.readFileSync(outMdPath, 'utf8');
  const newOutMd = newMd.replaceAll(
    '/docs/public/',
    'https://comic-read-docs.pages.dev/',
  );
  if (newOutMd !== outMd) fs.writeFileSync(outMdPath, newOutMd);
};

const enSupportSite = [
  'E-Hentai (Associate nhentai, Quick favorite, Colorize tags, Detect advertise page, etc.)',
  'nhentai (Totally block comics, Auto page turning)',
  'hitomi',
  'Anchira',
  'kemono',
  'nekohouse',
  'welovemanga',
];

/** 脚本头部注释 */
export const getMetaData = (isDevMode: boolean) => {
  const meta = {
    name: pkg.name,
    namespace: pkg.name,
    version: pkg.version,
    description: `${zh.description}${getSupportSiteList()
      .map((site) => site.replace(/\[(.+)]\(.+\)/, '$1'))
      .join('、')}`,
    'description:en': `${en.description} ${enSupportSite.join(' | ')}.`,
    'description:ru': ru.description,
    author: pkg.author,
    license: pkg.license,
    noframes: true,
    match: '*://*/*',
    connect: [
      'yamibo.com',
      'dmzj.com',
      'idmzj.com',
      'exhentai.org',
      'e-hentai.org',
      'hath.network',
      'nhentai.net',
      'hypergryph.com',
      'mangabz.com',
      'copymanga.site',
      'copymanga.info',
      'copymanga.net',
      'copymanga.org',
      'copymanga.tv',
      'mangacopy.com',
      'xsskc.com',
      'self',
      '127.0.0.1',
      '*',
    ],
    grant: [
      'GM_addElement',
      'GM_getResourceText',
      'GM_addStyle',
      'GM_xmlhttpRequest',
      'GM.addValueChangeListener',
      'GM.removeValueChangeListener',
      'GM.getResourceText',
      'GM.getValue',
      'GM.setValue',
      'GM.listValues',
      'GM.deleteValue',
      'GM.registerMenuCommand',
      'GM.unregisterMenuCommand',
      'unsafeWindow',
    ],
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACBUExURUxpcWB9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i////198il17idng49DY3PT297/K0MTP1M3X27rHzaCxupmstbTByK69xOfr7bfFy3WOmqi4wPz9/X+XomSBjqW1vZOmsN/l6GmFkomeqe7x8vn6+kv+1vUAAAAOdFJOUwDsAoYli9zV+lIqAZEDwV05SQAAAUZJREFUOMuFk+eWgjAUhGPBiLohjZACUqTp+z/gJkqJy4rzg3Nn+MjhwB0AANjv4BEtdITBHjhtQ4g+CIZbC4Qb9FGb0J4P0YrgCezQqgIA14EDGN8fYz+f3BGMASFkTJ+GDAYMUSONzrFL7SVvjNQIz4B9VERRmV0rbJWbrIwidnsd6ACMlEoip3uad3X2HJmqb3gCkkJELwk5DExRDxA6HnKaDEPSsBnAsZoANgJaoAkg12IJqBiPACImXQKF9IDULIHUkOk7kDpeAMykHqCEWACy8ACdSM7LGSg5F3HtAU1rrkaK9uGAshXS2lZ5QH/nVhmlD8rKlmbO3ZsZwLe8qnpdxJRnLaci1X1V5R32fjd5CndVkfYdGpy3D+htU952C/ypzPtdt3JflzZYBy7fi/O1euvl/XH1Pp+Cw3/1P1xOZwB+AWMcP/iw0AlKAAAAV3pUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHic4/IMCHFWKCjKT8vMSeVSAAMjCy5jCxMjE0uTFAMTIESANMNkAyOzVCDL2NTIxMzEHMQHy4BIoEouAOoXEXTyQjWVAAAAAElFTkSuQmCC',
    resource: resource[isDevMode ? 'dev' : 'prod'],
    supportURL: 'https://github.com/hymbz/ComicReadScript/issues',
    updateURL:
      'https://github.com/hymbz/ComicReadScript/raw/master/ComicRead.user.js',
    downloadURL:
      'https://github.com/hymbz/ComicReadScript/raw/master/ComicRead.user.js',
  };

  const keyLength = Math.max(...Object.keys(meta).map((key) => key.length)) + 1;

  const createMetaHeader = (metaData: Record<string, any>) => {
    const _metaData: typeof metaData = JSON.parse(JSON.stringify(metaData));

    // 将 @resource 中的 / 替换为 |，以兼容 ios 的油猴扩展
    for (const key of Object.keys(_metaData.resource)) {
      if (!key.includes('/')) continue;
      _metaData.resource[key.replaceAll('/', '|')] = _metaData.resource[key];
      Reflect.deleteProperty(_metaData.resource, key);
    }

    const metaText = Object.entries(_metaData)
      .filter(([, val]) => val)
      .map(([key, val]) => {
        switch (typeof val) {
          case 'boolean':
            return `// @${key}`;
          case 'object':
            return Array.isArray(val)
              ? val
                  .map((v) => `// @${key.padEnd(keyLength, ' ')} ${v}`)
                  .join('\n')
              : Object.entries(val)
                  .map(
                    ([k, v]) =>
                      `// @${key.padEnd(keyLength, ' ')} ${k} ${String(v)}`,
                  )
                  .join('\n');
          default:
            return `// @${key.padEnd(keyLength, ' ')} ${val}`;
        }
      })
      .join('\n');

    return `// ==UserScript==\n${metaText}\n// ==/UserScript==\n\n`;
  };

  return {
    meta,
    createMetaHeader,
  };
};
