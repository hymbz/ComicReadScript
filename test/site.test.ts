import { type ComicImg } from 'components/Manga';
import { pick } from 'radash';
import { type Promisable } from 'type-fest';

import { pathResolve, readFile } from '../scripts/lib/utils';
import { cookie } from './cookie';

const waitExecute = async (fn: () => Promisable<boolean>) => {
  let res = false;
  let time = performance.now();
  while (!res) {
    const now = performance.now();
    if (now - time > 1000 * 60) throw new Error('等待超时');
    time = now;
    res = await browser.execute(fn);
  }
};

type SiteTestInfo = {
  name: string;
  url: string;
  only?: boolean;
};

const testSite = ({ name, url }: SiteTestInfo) =>
  // oxlint-disable-next-line jest/valid-title
  it(name, async () => {
    await browser.url(url);

    if (Reflect.has(cookie, name)) {
      const allCookies = await browser.getCookies();
      if (allCookies.length > 0)
        await browser.deleteCookies(allCookies.map((item) => item.name));
      console.log(`设置 ${name} cookie`);
      await browser.setCookies(
        cookie[name].map((item) =>
          pick(item, [
            'name',
            'value',
            'path',
            'domain',
            'secure',
            'httpOnly',
            'expiry',
          ]),
        ),
      );
      await browser.url(url);
      await browser.refresh();
    }
    await expect(browser).toHaveUrl(url);

    await expect($('#fab')).toExist();
    await expect($('#comicRead')).toExist();

    // 等待 getImgList 加载完毕
    await waitExecute(() =>
      Object.values((window as any).main.store.comicMap).some(
        (item: any) => item.getImgList.name !== 'init',
      ),
    );

    // 如果默认 autoShow 为 false 就手动点下
    const autoShow = await browser.execute(
      () => (window as any).main.store.options.autoShow,
    );
    if (!autoShow) await $('#fab').click();

    // 等待加载完毕
    await browser.pause(500);
    await expect($('#comicRead')).toBeDisplayed();
    await waitExecute(() => (window as any)._imgList().length > 0);
    await waitExecute(() =>
      (window as any)
        ._imgList()
        .slice(0, 3)
        .every((img: ComicImg) => img.loadType === 'loaded'),
    );

    await expect(browser).toMatchScreenSnapshot(`正常加载显示-${name}`, 1);
    // await browser.saveScreen(`正常加载显示-${name}`);
  });

const getSiteTestInfo = () => {
  const skip: string[] = [];
  const siteList: SiteTestInfo[] = [];

  const indexCode = readFile(pathResolve('src/index.ts'));
  for (const {
    groups: { comment, code },
  } of indexCode.matchAll(
    /(?<comment>\n\s+\/\/ #.+?)(?<code>case.+?break;\n {4}\})/gsu,
  )) {
    const match =
      /selfImport\('site\/(?<site>\w+)'\)| setup\(\{.+?name: '(?<name>.+?)'/su.exec(
        code,
      )?.groups;
    if (!match) throw new Error('index.ts 注释解析出错');
    const name = match.site || match.name;

    const commentRes = [...comment.matchAll(/\/\/ test: (?<url>.+)(?=\n)/gu)];
    if (commentRes.length === 0) {
      skip.push(name);
      continue;
    }

    const { url } = commentRes[0].groups;
    if (!url.startsWith('http')) continue;

    const only = comment.includes('// only');

    siteList.push({ name, url, only });
  }

  if (skip.length > 0) console.log(`跳过了 ${skip.join(', ')}`);

  return siteList;
};

describe('站点测试', function _() {
  this.retries(3);

  let list = getSiteTestInfo();
  const onlyList = list.filter((item) => item.only);
  if (onlyList.length > 0) list = onlyList;
  for (const siteInfo of list) testSite(siteInfo);
});
