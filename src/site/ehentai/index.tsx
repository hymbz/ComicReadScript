import { createMemo, type Component } from 'solid-js';
import { render } from 'solid-js/web';
import { request, useInit, toast, ReactiveSet, type LoadImgFn } from 'main';
import { type MangaProps } from 'components/Manga';
import { getAdPageByFileName, getAdPageByContent } from 'userscript/detectAd';
import {
  t,
  querySelector,
  scrollIntoView,
  plimit,
  querySelectorAll,
  wait,
  log,
  testImgUrl,
  singleThreaded,
  useStyle,
  createRootMemo,
  requestIdleCallback,
  linstenKeydown,
  assign,
} from 'helper';

import { escHandler } from './other';
import { quickFavorite } from './quickFavorite';
import { associateNhentai } from './associateNhentai';
import { hotkeysPageTurn } from './hotkeys';
import { colorizeTag } from './colorizeTag';
import { quickRating } from './quickRating';
import { quickTagDefine } from './quickTagDefine';
import { floatTagList } from './floatTagList';
import { sortTags } from './sortTags';

// [ehentai 图像限额](https://github.com/ccloli/E-Hentai-Downloader/wiki/E−Hentai-Image-Viewing-Limits-(Chinese))

type ListPageType =
  | 'm' // 最小化
  | 'p' // 最小化 + 关注标签
  | 'l' // 紧凑 + 标签
  | 'e' // 扩展
  | 't'; // 缩略图;

export type PageType = 'gallery' | 'mytags' | 'mpv' | ListPageType;

(async () => {
  let pageType: PageType | undefined;

  if (Reflect.has(unsafeWindow, 'display_comment_field')) pageType = 'gallery';
  else if (location.pathname === '/mytags') pageType = 'mytags';
  else if (Reflect.has(unsafeWindow, 'mpvkey')) pageType = 'mpv';
  else
    pageType = (
      querySelector('option[value="t"]')?.parentElement as HTMLSelectElement
    )?.value as PageType | undefined;

  if (!pageType) return;

  const {
    options,
    setComicLoad,
    dynamicLoad,
    showComic,
    comicMap,
    setComicMap,
    setImgList,
    setFab,
    setManga,
    mangaProps,
  } = await useInit('ehentai', {
    /** 关联 nhentai */
    associate_nhentai: true,
    /** 快捷键 */
    hotkeys: true,
    /** 识别广告页 */
    detect_ad: true,
    /** 快捷收藏 */
    quick_favorite: true,
    /** 标签染色 */
    colorize_tag: false,
    /** 快捷评分 */
    quick_rating: true,
    /** 快捷查看标签定义 */
    quick_tag_define: true,
    /** 悬浮标签列表 */
    float_tag_list: false,
    /** 自动调整配置 */
    auto_adjust_option: false,
    autoShow: false,
  });

  if (pageType === 'mpv') {
    return setComicLoad(() => {
      const imgEleList = querySelectorAll('.mimg[id]');
      const loadImgList: LoadImgFn = async (setImg) => {
        const imagelist = unsafeWindow.imagelist as Array<{
          i: string;
          xhr: XMLHttpRequest;
        }>;
        plimit(
          imagelist.map((_, i) => async () => {
            const url = () => imagelist[i].i;
            while (!url()) {
              if (!Reflect.has(imagelist[i], 'xhr')) {
                unsafeWindow.load_image(i + 1);
                unsafeWindow.next_possible_request = 0;
              }
              await wait(url);
            }
            setImg(i, url());
          }),
          undefined,
          4,
        );
      };
      return dynamicLoad(loadImgList, imgEleList.length)();
    });
  }

  // 按顺序处理 esc 按键
  linstenKeydown((e) => {
    if (e.key !== 'Escape') return;
    for (const handler of escHandler)
      if (handler() !== true) return e.stopImmediatePropagation();
  });

  // 标签染色
  if (options.colorize_tag) {
    colorizeTag(pageType);
    sortTags(pageType);
  }
  // 快捷键
  if (options.hotkeys) hotkeysPageTurn(pageType);
  // 悬浮标签列表
  if (options.float_tag_list)
    requestIdleCallback(() => floatTagList(pageType, mangaProps));
  // 快捷收藏。必须处于登录状态
  if (unsafeWindow.apiuid !== -1 && options.quick_favorite)
    requestIdleCallback(() => quickFavorite(pageType));
  // 快捷评分
  if (options.quick_rating)
    requestIdleCallback(() => quickRating(pageType), 1000);
  // 快捷查看标签定义
  if (options.quick_tag_define)
    requestIdleCallback(() => quickTagDefine(pageType), 1000);

  // 自动调整阅读配置
  if (
    options.auto_adjust_option &&
    // 在「Doujinshi」「Manga」「Non-H」以外的分类下
    !querySelector('#gdc > .cs:is(.ct2, .ct3, .ct9)')
  ) {
    let option: MangaProps['defaultOption'] = {
      // 使用单页模式
      pageNum: 1,
      // 关闭图像识别
      imgRecognition: { enabled: false },
    };
    if (options.option) option = assign(options.option, option);
    setManga({ option });
  }

  // 不是漫画页的话
  if (pageType !== 'gallery') return;

  const sidebarDom = document.getElementById('gd5')!;
  // 表站开启了 Multi-Page Viewer 的话会将点击按钮挤出去，得缩一下位置
  if (sidebarDom.children[6])
    (sidebarDom.children[6] as HTMLElement).style.padding = '0';

  const LoadButton: Component<{ id: string }> = (props) => {
    const tip = createMemo(() => {
      const _imgList = comicMap[props.id]?.imgList;
      const progress = _imgList?.filter(Boolean).length;

      switch (_imgList?.length) {
        case undefined:
          return ' Load comic';
        case progress:
          return ' Read';
        default:
          return ` loading - ${progress}/${_imgList!.length}`;
      }
    });

    return (
      <a
        href="javascript:;"
        onClick={() => showComic(props.id)}
        children={tip()}
      />
    );
  };

  render(
    () => (
      <p class="g2 gsp">
        <img src="https://ehgt.org/g/mr.gif" />
        <LoadButton id="" />
      </p>
    ),
    sidebarDom,
  );

  // 关联 nhentai
  if (options.associate_nhentai)
    requestIdleCallback(
      () => associateNhentai(dynamicLoad, setComicLoad, LoadButton),
      1000,
    );

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

  const loadImgList: LoadImgFn = async (setImg) => {
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
      );
      if (enableDetectAd) {
        await getAdPageByFileName(ehImgFileNameList, comicMap[''].adList!);
        await getAdPageByContent(ehImgList, comicMap[''].adList!);
      }
    }
  };
  setComicLoad(dynamicLoad(loadImgList, totalImgNum));

  const enableDetectAd =
    options.detect_ad && document.getElementById('ta_other:extraneous_ads');
  if (enableDetectAd) {
    setComicMap('', 'adList', new ReactiveSet());
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
    await getAdPageByFileName(ehImgFileNameList, comicMap[''].adList!);
    // 不行的话再用缩略图识别
    if (comicMap[''].adList!.size === 0)
      await getAdPageByContent(thumbnailEleList, comicMap[''].adList!);

    // 模糊广告页的缩略图
    useStyle(
      createRootMemo(() => {
        if (!comicMap['']?.adList?.size) return '';
        const styleList = [...comicMap[''].adList].map((i) => {
          const alt = `${i + 1}`.padStart(placeValueNum, '0');
          return `img[alt="${alt}"]:not(:hover) {
            filter: blur(8px);
            clip-path: border-box;
            backdrop-filter: blur(8px);
          }`;
        });
        return styleList.join('\n');
      }),
    );
  }

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
  const reloadImg = singleThreaded(async (_, i: number) => {
    const pageUrl = await getNewImgPageUrl(ehImgPageList[i]);
    let imgUrl = '';
    while (!imgUrl || !(await testImgUrl(imgUrl))) {
      imgUrl = await getImgFromImgPage(pageUrl);
      log(`刷新图片 ${i}\n${ehImgList[i]} ->\n${imgUrl}`);
    }
    ehImgList[i] = imgUrl;
    ehImgPageList[i] = pageUrl;
    setImgList('', i, imgUrl);
  });

  setManga({
    onExit(isEnd) {
      if (isEnd) scrollIntoView('#cdiv');
      setManga('show', false);
    },
    // 在图片加载出错时刷新图片
    onLoading(_, img) {
      if (!img || img.loadType !== 'error') return;
      const i = ehImgList.indexOf(img.src);
      if (i === -1) return;
      return reloadImg(i);
    },
  });

  setFab('initialShow', options.autoShow);
})().catch((error) => log.error(error));
