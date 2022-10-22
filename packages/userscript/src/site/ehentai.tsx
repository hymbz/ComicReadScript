/* eslint-disable camelcase */

import { querySelector, sleep } from '../helper';
import { useInit } from '../helper/useInit';

(async () => {
  const { options, showFab, toast, showManga, setManga } = await useInit(
    'nhentai',
    { 自动翻页: true, 彻底屏蔽漫画: true, 在新页面中打开链接: true },
  );

  // 只在漫画页内运行
  if (!Reflect.has(unsafeWindow, 'gid')) return;

  const imgNum = parseInt(
    querySelector('#gdd > table > tbody > tr:nth-child(6) > td.gdt2')!
      .innerHTML,
    10,
  );

  /**
   * 从漫画单页源代码中提取图片地址
   *
   * @param html
   */
  const getImgUrl = (html: string) =>
    html.split('id="img" src="')[1].split('"')[0];
  /** 从漫画单页源代码中提取下一页地址的正则 */
  const getNextImgRe = /id="next" .*? href="(.+?)(?=")/;

  // TODO: 目前单线程的速度还是慢，可以试着直接从详情页获取每页图片的地址，然后直接 getImgUrl 获取
  const getImgList = async (
    url: string,
    imgList: string[] = [],
    errorNum = 0,
  ): Promise<string[]> => {
    const res = await GM.xmlHttpRequest({ method: 'GET', url });

    if (res.status !== 200 || !res.responseText) {
      if (errorNum > 3) throw new Error('漫画图片加载出错');
      console.error('漫画图片加载出错', res);
      toast('漫画图片加载出错', { type: 'error' });
      await sleep(1000 * 3);
      return getImgList(url, imgList, errorNum + 1);
    }

    // 返回的数据只能通过 eval 获得
    // eslint-disable-next-line no-eval
    const newImgList = [...imgList, getImgUrl(res.responseText)];

    if (newImgList.length !== imgNum) {
      showFab({
        progress: newImgList.length / imgNum,
        tip: `加载中 - ${newImgList.length}/${imgNum}`,
      });
      const nextUrl = getNextImgRe.exec(res.responseText)![1];
      return getImgList(nextUrl, newImgList);
    }

    showFab({ progress: 1, tip: '阅读模式' });

    return newImgList;
  };

  const imgList = { ehentai: [] as string[], nhentai: [] as string[] };

  const findAndShowComic = async () => {
    if (imgList.ehentai.length === 0) {
      try {
        imgList.ehentai = await getImgList(
          querySelector<HTMLAnchorElement>('#gdt > div:nth-child(1) a')!.href,
        );
        if (imgList.ehentai.length === 0) throw new Error('获取漫画图片失败');
        setManga({ imgList: imgList.ehentai });
      } catch (e) {
        console.error(e);
        toast('获取漫画图片失败', { type: 'error' });
      }
    }

    showManga();
  };

  showFab({ onClick: findAndShowComic });

  if (options.autoLoad) await findAndShowComic();
})();
