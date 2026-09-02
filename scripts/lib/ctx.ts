import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import en from '../../locales/en.json' with { type: 'json' };
import ru from '../../locales/ru.json' with { type: 'json' };
import zh from '../../locales/zh.json' with { type: 'json' };
import pkg from '../../package.json' with { type: 'json' };

export const rootDir = resolve(import.meta.dirname, '../..');
export const isDevMode = process.argv.includes('--dev');

/**
 * 脚本依赖库与对应的 cdn url
 * 数组里的第一个 url 是生产模式下使用的，第二个是开发模式下使用的
 * 只有一个 url 表示不区分生产开发模式
 */
const resourceList: Record<string, [string, string] | [string]> = {
  'solid-js': [
    'https://registry.npmmirror.com/solid-js/1.9.8/files/dist/solid.cjs',
    'https://registry.npmmirror.com/solid-js/1.9.8/files/dist/dev.cjs',
  ],
  'solid-js/store': [
    'https://registry.npmmirror.com/solid-js/1.9.8/files/store/dist/store.cjs',
    'https://registry.npmmirror.com/solid-js/1.9.8/files/store/dist/dev.cjs',
  ],
  'solid-js/web': [
    'https://registry.npmmirror.com/solid-js/1.9.8/files/web/dist/web.cjs',
    'https://registry.npmmirror.com/solid-js/1.9.8/files/web/dist/dev.cjs',
  ],
  fflate: ['https://registry.npmmirror.com/fflate/0.8.2/files/umd/index.js'],
  jsqr: ['https://registry.npmmirror.com/jsqr/1.4.0/files/dist/jsQR.js'],
  comlink: [
    'https://registry.npmmirror.com/comlink/4.4.2/files/dist/umd/comlink.min.js',
    'https://registry.npmmirror.com/comlink/4.4.2/files/dist/umd/comlink.js',
  ],
  '@tensorflow/tfjs': [
    'https://registry.npmmirror.com/@tensorflow/tfjs/4.22.0/files/dist/tf.min.js',
  ],
  '@tensorflow/tfjs-backend-webgpu': [
    'https://registry.npmmirror.com/@tensorflow/tfjs-backend-webgpu/4.22.0/files/dist/tf-backend-webgpu.js',
  ],
};

const resource = {
  dev: {} as Record<string, string>,
  prod: {} as Record<string, string>,
};
for (const [k, v] of Object.entries(resourceList)) {
  resource.prod[k] = v.at(0)!;
  resource.dev[k] = v.at(-1)!;
}

/** 根据 index.ts 的注释获取支持站点列表 */
const getSupportSiteList = () => {
  const indexCode = readFileSync('src/index.ts', 'utf8');
  return [...indexCode.matchAll(/^\s*\/\/\s#(?<site>.+)$/gmu)].map(
    ({ groups: { site } }) => site,
  );
};

export const categoryMap = new Map<string, string[]>();

export const updateCategoryMap = () => {
  categoryMap.clear();
  // .slice(7) 跳过 README 中手动维护的前 7 个站点（有专属文档章节的网站）
  for (const site of getSupportSiteList().slice(7)) {
    const match = /^(?<category>[^[]+)(?<link>\[.+)$/u.exec(site)?.groups;
    if (!match) continue;
    const { category, link } = match;
    if (!categoryMap.has(category)) categoryMap.set(category, []);
    categoryMap.get(category)!.push(link);
  }
};

updateCategoryMap();

const getCategory = (name: string) =>
  (categoryMap.get(name) ?? []).map(
    (t) => /\[(?<text>.+?)\]/u.exec(t)?.groups?.text,
  );

const enSupportSite = [
  'E-Hentai (Associate nhentai, Quick favorite, Colorize tags, Floating tag list, etc.)',
  'nhentai (Totally block comics, Auto page turning)',
  ...getCategory('R18'),
  ...getCategory('Fanbox'),
  ...getCategory('漫画站'),
];
export const meta = {
  name: 'ComicRead',
  'name:en': 'ComicRead',
  'name:ru': 'ComicRead',
  namespace: 'ComicRead',
  version: pkg.version,
  description: `${zh.description}${getSupportSiteList()
    .map((site) =>
      site.replace(/^[^[]*\[(?<text>[^\]]+)\]\([^)]+\).*$/u, '$<text>'),
    )
    .join('、')}`,
  'description:en': `${en.description} ${enSupportSite.join(' | ')}`,
  'description:ru': ru.description,
  author: pkg.author,
  license: pkg.license,
  noframes: true,
  match: '*://*/*',
  connect: [
    'yamibo.com',
    'exhentai.org',
    'e-hentai.org',
    'hath.network',
    'nhentai.net',
    'gold-usergeneratedcontent.net',
    'hypergryph.com',
    'mangabz.com',
    'schale.network',
    'touhou.ai',
    'jsdelivr.net',
    'npmmirror.com',
    'self',
    '127.0.0.1',
    '*',
  ],
  grant: [
    'GM_addElement',
    'GM_getResourceText',
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
  icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACBUExURUxpcWB9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i////198il17idng49DY3PT297/K0MTP1M3X27rHzaCxupmstbTByK69xOfr7bfFy3WOmqi4wPz9/X+XomSBjqW1vZOmsN/l6GmFkomeqe7x8vn6+kv+1vUAAAAOdFJOUwDsAoYli9zV+lIqAZEDwV05SQAAAUZJREFUOMuFk+eWgjAUhGPBiLohjZACUqTp+z/gJkqJy4rzg3Nn+MjhwB0AANjv4BEtdITBHjhtQ4g+CIZbC4Qb9FGb0J4P0YrgCezQqgIA14EDGN8fYz+f3BGMASFkTJ+GDAYMUSONzrFL7SVvjNQIz4B9VERRmV0rbJWbrIwidnsd6ACMlEoip3uad3X2HJmqb3gCkkJELwk5DExRDxA6HnKaDEPSsBnAsZoANgJaoAkg12IJqBiPACImXQKF9IDULIHUkOk7kDpeAMykHqCEWACy8ACdSM7LGSg5F3HtAU1rrkaK9uGAshXS2lZ5QH/nVhmlD8rKlmbO3ZsZwLe8qnpdxJRnLaci1X1V5R32fjd5CndVkfYdGpy3D+htU952C/ypzPtdt3JflzZYBy7fi/O1euvl/XH1Pp+Cw3/1P1xOZwB+AWMcP/iw0AlKAAAAV3pUWHRSYXcgcHJvZmlsZSB0eXBlIGl0cGMAAHic4/IMCHFWKCjKT8vMSeVSAAMjCy5jCxMjE0uTFAMTIESANMNkAyOzVCDL2NTIxMzEHMQHy4BIoEouAOoXEXTyQjWVAAAAAElFTkSuQmCC',
  resource: resource[isDevMode ? 'dev' : 'prod'],
  supportURL: 'https://github.com/hymbz/ComicReadScript/issues',
  updateURL:
    'https://github.com/hymbz/ComicReadScript/raw/master/ComicRead.user.js',
  downloadURL:
    'https://github.com/hymbz/ComicReadScript/raw/master/ComicRead.user.js',
};

const keyLength = Math.max(...Object.keys(meta).map((key) => key.length)) + 1;

export const createMetaHeader = (metaData: Record<string, any>) => {
  const _metaData: typeof metaData = structuredClone(metaData);

  // 将 @resource 中的 / 替换为 |，以兼容 ios 的油猴扩展
  for (const key of Object.keys(_metaData.resource)) {
    if (!key.includes('/')) continue;
    _metaData.resource[key.replaceAll('/', '|').replaceAll('@', '_')] =
      _metaData.resource[key];
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
