import fs from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import pkg from './package.json' assert { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * 脚本依赖库与对应的 cdn url
 * 数组里的第一个 url 是生产模式下使用的，第二个是开发模式下使用的
 * 只有一个 url 表示不区分生产开发模式
 */
const resourceList: Record<string, [string, string] | [string]> = {
  'solid-js': [
    'https://unpkg.com/solid-js@1.7.3/dist/solid.cjs',
    'https://unpkg.com/solid-js@1.7.3/dist/dev.cjs',
  ],
  'solid-js/store': [
    'https://unpkg.com/solid-js@1.7.3/store/dist/store.cjs',
    'https://unpkg.com/solid-js@1.7.3/store/dist/dev.cjs',
  ],
  'solid-js/web': [
    'https://unpkg.com/solid-js@1.7.3/web/dist/web.cjs',
    'https://unpkg.com/solid-js@1.7.3/web/dist/dev.cjs',
  ],
  panzoom: ['https://unpkg.com/panzoom@9.4.3/dist/panzoom.min.js'],
  fflate: ['https://unpkg.com/fflate@0.7.4/umd/index.js'],
  dmzjDecrypt: [
    'https://greasyfork.org/scripts/467177-dmzjdecrypt/code/dmzjDecrypt.js?version=1207199',
  ],
  dmzj_style: ['https://userstyles.org/styles/chrome/119945.json'],
};
const resource = {
  prod: Object.fromEntries(
    Object.entries(resourceList).map(([k, v]) => [k, v.at(0)]),
  ),
  dev: Object.fromEntries(
    Object.entries(resourceList).map(([k, v]) => [k, v.at(-1)]),
  ),
};

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
    /(?<=<!-- supportSiteList -->\n).+(?=\n<!-- supportSiteList -->)/s,
    getSupportSiteList()
      .slice(5)
      .map((siteText) => `- ${siteText}`)
      .join('\n'),
  );
  if (newMd !== readmeMd) fs.writeFileSync(readmePath, newMd);

  // 生成 README-out.md 文件，把相对链接改成 jsdelivr cdn 的链接，方便在其他站点显示图片
  const outMdPath = resolve(__dirname, 'docs/README-out.md');
  const outMd = fs.readFileSync(outMdPath, 'utf8');
  const newOutMd = newMd.replaceAll(
    /(?<=]\()\/.+\.(md)?.+\)/g,
    'https://cdn.jsdelivr.net/gh/hymbz/ComicReadScript$&',
  );
  if (newOutMd !== outMd) fs.writeFileSync(outMdPath, newOutMd);
};

/** 脚本头部注释 */
export const getMetaData = (isDevMode: boolean) => {
  const scriptName = `${pkg.name}${isDevMode ? 'Test' : ''}`;

  const meta = {
    name: scriptName,
    namespace: scriptName,
    version: pkg.version,
    description: `${pkg.description}${getSupportSiteList().join('、')}`,
    author: pkg.author,
    license: pkg.license,
    noframes: true,
    match: '*://*/*',
    connect: [
      'cdn.jsdelivr.net',
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
      'self',
      '*',
    ],
    grant: [
      'GM_addElement',
      'GM_getResourceText',
      'GM_xmlhttpRequest',
      'GM.addValueChangeListener',
      'GM.removeValueChangeListener',
      'GM.getResourceText',
      'GM.addStyle',
      'GM.getValue',
      'GM.setValue',
      'GM.deleteValue',
      'GM.registerMenuCommand',
      'GM.unregisterMenuCommand',
      'unsafeWindow',
    ],
    resource: resource[isDevMode ? 'dev' : 'prod'],
    supportURL: 'https://github.com/hymbz/ComicReadScript/issues',
    updateURL:
      'https://github.com/hymbz/ComicReadScript/raw/master/ComicRead.user.js',
    downloadURL:
      'https://github.com/hymbz/ComicReadScript/raw/master/ComicRead.user.js',
  };

  const keyLength = Math.max(...Object.keys(meta).map((key) => key.length)) + 1;
  const metaStr = Object.entries(meta)
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
                .map(([k, v]) => `// @${key.padEnd(keyLength, ' ')} ${k} ${v}`)
                .join('\n');
        default:
          return `// @${key.padEnd(keyLength, ' ')} ${val}`;
      }
    })
    .join('\n');

  return {
    meta,
    metaHeader: `// ==UserScript==\n${metaStr}\n// ==/UserScript==\n\n`,
  };
};
