/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import type { OutputPluginOption } from 'rollup';

const siteUrlFnMap = {
  jm: async () => {
    const res = await axios<string>('https://jcomic-cn.vip');
    return [
      ...res.data
        .replace(/&nbsp;/g, '')
        .matchAll(/(?<=\n)[-A-Za-z0-9.]+?(?=<br)/g),
    ].flat();
  },
  wnacg: async () => {
    const res = await axios<string>('https://wnacg01.org');
    return [...res.data.matchAll(/(?<=<i>)[-A-Za-z0-9.]+?(?=<\/i>)/g)].flat();
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

export const siteUrl: OutputPluginOption = {
  name: 'self-siteUrl',
  async renderChunk(rawCode) {
    if (!siteUrlMap) siteUrlMap = await initSiteUrlMap();

    let code = rawCode;
    // 将 inject 函数调用替换为 dist 文件夹下的指定文件内容
    code = code.replaceAll(
      /case 'siteUrl#(.+?)':(.+?)(?=\{)/gs,
      (_, name, other) => {
        if (!Reflect.has(siteUrlMap!, name))
          throw new Error(`未知站点：${name}`);
        const list = siteUrlMap![name].filter((url) =>
          URL.canParse(`https://${url}`),
        );
        if (!list.length) throw new Error('未找到可用网址，发布页已失效');

        const otherUrlList: string[] = [
          ...other.matchAll(/(?<=case ').+?(?=':)/g),
        ].flat();

        return `${list
          .filter((url) => !otherUrlList.includes(url))
          .map((url) => `case '${url}':`)
          .join('\n    ')}${other}`;
      },
    );
    return code;
  },
};
