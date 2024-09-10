import axios from 'axios';
import type { OutputPluginOption } from 'rollup';

const siteUrlFnMap = {
  async jm() {
    const res = await axios<string>('https://jmcomicgo.xyz');
    return [
      ...res.data
        .replaceAll('&nbsp;', '')
        .matchAll(/(?<=\n\s*)[-A-Za-z\d.]+?(?=<br)/g),
    ].flat();
  },
  async wnacg() {
    const res = await axios<string>('https://wnacg01.org');
    return [...res.data.matchAll(/(?<=<i>)[-A-Za-z\d.]+?(?=<\/i>)/g)].flat();
  },
};

let siteUrlMap: Record<string, string[]> | undefined;

const initSiteUrlMap = async () =>
  Object.fromEntries(
    await Promise.all(
      Object.entries(siteUrlFnMap).map(
        async ([name, fn]) => [name, await fn()] as const,
      ),
    ),
  );

/** 根据发布页自动获取可用网址 */
export const siteUrl: OutputPluginOption = {
  name: 'self-siteUrl',
  async renderChunk(code) {
    siteUrlMap ||= await initSiteUrlMap();

    return code.replaceAll(
      /case 'siteUrl#(.+?)':(.+?)(?={)/gs,
      (_, name, other) => {
        if (!Reflect.has(siteUrlMap!, name))
          throw new Error(`未知站点：${name}`);
        const list = siteUrlMap![name].filter((url) =>
          URL.canParse(`https://${url}`),
        );
        if (list.length === 0)
          throw new Error(`未找到可用网址，${name}发布页已失效`);

        const otherUrlList = new Set<string>(
          [...other.matchAll(/(?<=case ').+?(?=':)/g)].flat(),
        );

        return `${list
          .filter((url) => !otherUrlList.has(url))
          .map((url) => `case '${url}':`)
          .join('\n    ')}${other}`;
      },
    );
  },
};
