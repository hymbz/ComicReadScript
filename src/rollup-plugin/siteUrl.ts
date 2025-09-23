import axios from 'axios';

import { codeEdit } from './codeEdit';

const siteUrlFnMap = {
  async jm() {
    const res = await axios<string>('https://jmcomic6.org');
    return [...res.data.matchAll(/(?<=<span>)[\da-z-.]+(?=<\/span>)/g)].flat();
  },
  async wnacg() {
    const res = await axios<string>('https://wnacg.date');
    return [...res.data.matchAll(/(?<=<i>)[-A-Za-z\d.]+(?=<\/i>)/g)].flat();
  },
  async noy() {
    const res = await axios<string>('https://noy.icu/atom.xml');
    return [.../(?<=<link href="https:\/\/).+(?=\/")/.exec(res.data)!];
  },
};

let siteUrlMap: Record<string, string[]> | undefined;

const initSiteUrlMap = async () => {
  const map = {} as Record<string, string[]>;
  await Promise.all(
    Object.entries(siteUrlFnMap).map(async ([name, fn]) => {
      try {
        const list = await fn();
        if (list.length === 0) throw new Error(`未找到可用网址`);
        map[name] = list;
      } catch {
        console.error(`获取可用网址失败，${name}发布页已失效`);
      }
    }),
  );
  return map;
};

/** 根据发布页自动获取可用网址 */
export const siteUrl = codeEdit('self-siteUrl', async (code) => {
  siteUrlMap ??= await initSiteUrlMap();

  return code.replaceAll(
    /case 'siteUrl#(.+?)':(.+?)(?=\{)/gs,
    (_, name, other) => {
      if (!Reflect.has(siteUrlMap!, name)) {
        console.error(`未知站点: ${name}`);
        return other as string;
      }
      const list = siteUrlMap![name].filter((url) =>
        URL.canParse(`https://${url}`),
      );

      const otherUrlList = new Set<string>(
        [...other.matchAll(/(?<=case ').+?(?=':)/g)].flat(),
      );

      return `${list
        .filter((url) => !otherUrlList.has(url))
        .map((url) => `case '${url}':`)
        .join('\n    ')}${other}`;
    },
  );
});
