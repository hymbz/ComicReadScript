import {
  t,
  insertNode,
  querySelector,
  scrollIntoView,
  request,
  useInit,
  toast,
  plimit,
  querySelectorAll,
  wait,
  log,
  testImgUrl,
  singleThreaded,
  store,
  createEffectOn,
  getAdPageByFileName,
  getAdPageByContent,
  ReactiveSet,
  requestIdleCallback,
} from 'main';

import { quickFavorite } from './quickFavorite';
import { associateNhentai } from './associateNhentai';
import { hotkeysPageTurn } from './hotkeys';
import { colorizeTag } from './ColorizeTag';
import { quickRating } from './quickRating';

type ListPageType =
  /** 最小化 */
  | 'm'
  /** 最小化 + 关注标签 */
  | 'p'
  /** 紧凑 + 标签 */
  | 'l'
  /** 扩展 */
  | 'e'
  /** 缩略图 */
  | 't';

export type PageType = 'gallery' | 'mytags' | ListPageType;

(async () => {
  let pageType: PageType | undefined;

  if (Reflect.has(unsafeWindow, 'display_comment_field')) pageType = 'gallery';
  else if (location.pathname === '/mytags') pageType = 'mytags';
  else
    pageType = querySelector<HTMLSelectElement>('#ujumpbox ~ div > select')
      ?.value as PageType | undefined;

  if (!pageType) return;

  const {
    options,
    init,
    setFab,
    setManga,
    dynamicUpdate,
    onLoading,
    mangaProps,
  } = await useInit('ehentai', {
    /** 关联 nhentai */
    associate_nhentai: true,
    /** 快捷键翻页 */
    hotkeys_page_turn: true,
    /** 识别广告页 */
    detect_ad: true,
    /** 快捷收藏 */
    quick_favorite: true,
    /** 标签染色 */
    colorize_tag: false,
    /** 快捷评分 */
    quick_rating: true,
    autoShow: false,
  });

  if (Reflect.has(unsafeWindow, 'mpvkey')) {
    const imgEleList = querySelectorAll('.mi0[id]');
    init(
      dynamicUpdate(
        (setImg) =>
          plimit(
            imgEleList.map((ele, i) => async () => {
              const getUrl = () => ele.querySelector('img')?.src;
              if (!getUrl()) unsafeWindow.load_image(i + 1);
              unsafeWindow.next_possible_request = 0;
              const imgUrl = await wait(getUrl);
              setImg(i, imgUrl);
            }),
            undefined,
            4,
          ),
        imgEleList.length,
      ),
    );
    return;
  }

  // 标签染色
  if (options.colorize_tag) colorizeTag(pageType);
  // 快捷键翻页
  if (options.hotkeys_page_turn) hotkeysPageTurn(pageType);
  // 快捷评分
  if (options.quick_rating)
    requestIdleCallback(() => quickRating(pageType), 1000);
  // 快捷收藏。必须处于登录状态
  if (unsafeWindow.apiuid !== -1 && options.quick_favorite)
    quickFavorite(pageType);

  // 不是漫画页的话
  if (pageType !== 'gallery') return;

  const sidebarDom = document.getElementById('gd5')!;
  // 表站开启了 Multi-Page Viewer 的话会将点击按钮挤出去，得缩一下位置
  if (sidebarDom.children[6])
    (sidebarDom.children[6] as HTMLElement).style.padding = '0';
  // 虽然有 Fab 了不需要这个按钮，但都点习惯了没有还挺别扭的（
  insertNode(
    sidebarDom,
    '<p class="g2 gsp"><img src="https://ehgt.org/g/mr.gif"><a id="comicReadMode" href="javascript:;"> Load comic</a></p>',
  );
  const comicReadModeDom = document.getElementById('comicReadMode')!;

  /** 从图片页获取图片地址 */
  const getImgFromImgPage = async (url: string): Promise<string> => {
    const res = await request(
      url,
      {
        fetch: true,
        errorText: t('site.ehentai.fetch_img_page_source_failed'),
      },
      10,
    );

    try {
      return /id="img" src="(.+?)"/.exec(res.responseText)![1];
    } catch {
      throw new Error(t('site.ehentai.fetch_img_url_failed'));
    }
  };

  /** 从详情页获取图片页的地址 */
  const getImgFromDetailsPage = async (
    pageNum = 0,
  ): Promise<Array<[string, string]>> => {
    const res = await request(
      `${window.location.pathname}${pageNum ? `?p=${pageNum}` : ''}`,
      { fetch: true, errorText: t('site.ehentai.fetch_img_page_url_failed') },
    );
    // 从详情页获取图片页的地址
    const reRes = res.responseText.matchAll(
      /<a href="(.{20,50})"><img alt=.+?title=".+?: (.+?)"/gm,
    );
    if (reRes === null) {
      if (
        res.responseText.includes(
          'Your IP address has been temporarily banned for excessive',
        )
      )
        throw new Error(t('site.ehentai.ip_banned'));
      throw new Error(t('site.ehentai.fetch_img_page_url_failed'));
    }

    return [...reRes].map(([, url, fileName]) => [url, fileName]);
  };

  const getImgNum = async () => {
    let numText = querySelector('.gtb .gpc')
      ?.textContent?.replaceAll(',', '')
      .match(/\d+/g)
      ?.at(-1);
    if (numText) return Number(numText);

    const res = await request(window.location.href);
    numText = /(?<=<td class="gdt2">)\d+(?= pages<\/td>)/.exec(
      res.responseText,
    )?.[0];
    if (numText) return Number(numText);

    toast.error(t('site.changed_load_failed'));
    return 0;
  };

  const totalImgNum = await getImgNum();
  const placeValueNum = `${totalImgNum}`.length;

  const ehImgList: string[] = [];
  const ehImgPageList: string[] = [];
  const ehImgFileNameList: string[] = [];

  const enableDetectAd =
    options.detect_ad && document.getElementById('ta_other:extraneous_ads');
  if (enableDetectAd) {
    setManga('adList', new ReactiveSet());
    /** 缩略图元素列表 */
    const thumbnailEleList: HTMLImageElement[] = [];

    for (const e of querySelectorAll<HTMLImageElement>('#gdt img')) {
      const index = Number(e.alt) - 1;
      if (Number.isNaN(index)) return;
      thumbnailEleList[index] = e;
      // 根据当前显示的图片获取一部分文件名
      [, ehImgFileNameList[index]] = e.title.split(/：|: /);
    }
    // 先根据文件名判断一次
    await getAdPageByFileName(ehImgFileNameList, mangaProps.adList);
    // 不行的话再用缩略图识别
    if (mangaProps.adList!.size === 0)
      await getAdPageByContent(thumbnailEleList, mangaProps.adList);

    // 模糊广告页的缩略图
    const stylesheet = new CSSStyleSheet();
    document.adoptedStyleSheets.push(stylesheet);
    createEffectOn(
      () => [...(mangaProps.adList ?? [])],
      (adList) => {
        if (adList.length === 0) return;
        const styleList = adList.map((i) => {
          const alt = `${i + 1}`.padStart(placeValueNum, '0');
          return `img[alt="${alt}"]:not(:hover) {
          filter: blur(8px);
          clip-path: border-box;
          backdrop-filter: blur(8px);
        }`;
        });
        return stylesheet.replace(styleList.join('\n'));
      },
    );
  }

  const { loadImgList } = init(
    dynamicUpdate(async (setImg) => {
      comicReadModeDom.innerHTML = ` loading`;

      const totalPageNum = Number(
        querySelector('.ptt td:nth-last-child(2)')!.textContent!,
      );
      for (let pageNum = 0; pageNum < totalPageNum; pageNum++) {
        const startIndex = ehImgList.length;
        const imgPageUrlList = await getImgFromDetailsPage(pageNum);
        await plimit(
          imgPageUrlList.map(([imgPageUrl, fileName], i) => async () => {
            const imgUrl = await getImgFromImgPage(imgPageUrl);
            const index = startIndex + i;
            ehImgList[index] = imgUrl;
            ehImgPageList[index] = imgPageUrl;
            ehImgFileNameList[index] = fileName;
            setImg(index, imgUrl);
          }),
          async (_doneNum) => {
            const doneNum = startIndex + _doneNum;
            setFab({
              progress: doneNum / totalImgNum,
              tip: `${t('other.loading_img')} - ${doneNum}/${totalImgNum}`,
            });
            comicReadModeDom.innerHTML = ` loading - ${doneNum}/${totalImgNum}`;

            if (doneNum === totalImgNum) {
              comicReadModeDom.innerHTML = ` Read`;
              if (enableDetectAd) {
                await getAdPageByFileName(ehImgFileNameList, mangaProps.adList);
                await getAdPageByContent(ehImgList, mangaProps.adList);
              }
            }
          },
        );
      }
    }, totalImgNum),
  );

  /** 获取新的图片页地址 */
  const getNewImgPageUrl = async (url: string) => {
    const res = await request(url, {
      errorText: t('site.ehentai.fetch_img_page_source_failed'),
    });
    const nl = /nl\('(.+?)'\)/.exec(res.responseText)?.[1];
    if (!nl) throw new Error(t('site.ehentai.fetch_img_url_failed'));
    const newUrl = new URL(url);
    newUrl.searchParams.set('nl', nl);
    return newUrl.href;
  };

  /** 刷新指定图片 */
  const reloadImg = async (i: number) => {
    const pageUrl = await getNewImgPageUrl(ehImgPageList[i]);
    let imgUrl = '';
    while (!imgUrl || !(await testImgUrl(imgUrl))) {
      imgUrl = await getImgFromImgPage(pageUrl);
      log(`刷新图片 ${i}\n${ehImgList[i]} ->\n${imgUrl}`);
    }
    ehImgList[i] = imgUrl;
    ehImgPageList[i] = pageUrl;
    setManga('imgList', i, imgUrl);
  };

  /** 判断当前显示的是否是 eh 源 */
  const isShowEh = () => store.imgList[0]?.src === ehImgList[0];

  /** 刷新所有错误图片 */
  const reloadErrorImg = singleThreaded(() =>
    plimit(
      store.imgList.map(({ loadType }, i) => () => {
        if (loadType !== 'error' || !isShowEh()) return;
        return reloadImg(i);
      }),
    ),
  );

  setManga({
    onExit(isEnd) {
      if (isEnd) scrollIntoView('#cdiv');
      setManga('show', false);
    },
    // 在图片加载出错时刷新图片
    async onLoading(imgList, img) {
      onLoading(imgList, img);
      if (!img) return;
      if (img.loadType !== 'error' || (await testImgUrl(img.src))) return;
      return reloadErrorImg();
    },
  });

  setFab('initialShow', options.autoShow);
  comicReadModeDom.addEventListener('click', () =>
    loadImgList(ehImgList.length > 0 ? ehImgList : undefined, true),
  );

  // 关联 nhentai
  if (options.associate_nhentai) associateNhentai(init, dynamicUpdate);
})().catch((error) => log.error(error));
