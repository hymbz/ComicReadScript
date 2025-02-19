import { createMemo, createSignal, type Component } from 'solid-js';
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
  createSequence,
  extractRange,
  useCache,
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
import { tagLint } from './tagLint';

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
    /** 标签检查 */
    tag_lint: false,
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
  // 标签检查
  if (options.tag_lint) requestIdleCallback(() => tagLint(pageType), 1000);

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

  // 限定右侧按钮框的高度，避免因为按钮太多而突出界面
  sidebarDom.style.overflow = 'auto';
  sidebarDom.style.maxHeight = '352px';

  const LoadButton: Component<{
    id: string;
    onClick?: (e: MouseEvent) => unknown;
  }> = (props) => {
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
        onClick={async (e) => {
          await props.onClick?.(e);
          showComic(props.id);
        }}
        children={tip()}
      />
    );
  };

  // 关联 nhentai
  if (options.associate_nhentai)
    requestIdleCallback(
      () => associateNhentai(dynamicLoad, setComicLoad, LoadButton),
      1000,
    );

  let totalImgNum = 0;
  totalImgNum = Number(
    querySelector('.gtb .gpc')
      ?.textContent?.replaceAll(',', '')
      .match(/\d+/g)
      ?.at(-1),
  );
  if (Number.isNaN(totalImgNum)) {
    totalImgNum = Number(
      /(?<=<td class="gdt2">)\d+(?= pages<\/td>)/.exec(
        (await request(window.location.href)).responseText,
      )?.[0],
    );
  }
  if (Number.isNaN(totalImgNum)) toast.error(t('site.changed_load_failed'));

  const ehImgList: string[] = [];
  const ehImgPageList: string[] = [];
  const ehImgFileNameList: string[] = [];

  const enableDetectAd =
    options.detect_ad && document.getElementById('ta_other:extraneous_ads');
  if (enableDetectAd) {
    setComicMap('', { adList: new ReactiveSet() });
    /** 缩略图列表 */
    const thumbnailList: Array<string | HTMLImageElement> = [];
    for (const e of querySelectorAll<HTMLAnchorElement>('#gdt > a')) {
      const index = Number(/.+-(\d+)/.exec(e.href)?.[1]) - 1;
      if (Number.isNaN(index)) continue;
      ehImgPageList[index] = e.href;

      const thumbnail = e.querySelector<HTMLElement>('[title]')!;
      ehImgFileNameList[index] = thumbnail.title.split(/：|: /)[1];
      thumbnailList[index] =
        thumbnail.tagName === 'IMG'
          ? (thumbnail as HTMLImageElement)
          : /url\("(.+)"\)/.exec(thumbnail.style.backgroundImage)![1];
    }

    // 先根据文件名判断一次
    await getAdPageByFileName(ehImgFileNameList, comicMap[''].adList!);
    // 不行的话再用缩略图识别
    if (comicMap[''].adList!.size === 0)
      await getAdPageByContent(thumbnailList, comicMap[''].adList!);

    // 模糊广告页的缩略图
    useStyle(
      createRootMemo(() => {
        if (!comicMap['']?.adList?.size) return '';
        return [...comicMap[''].adList]
          .map(
            (i) => `a[href="${ehImgPageList[i]}"] [title]:not(:hover) {
              filter: blur(8px);
              clip-path: border-box;
              backdrop-filter: blur(8px);
            }`,
          )
          .join('\n');
      }),
    );
  }

  /** 从图片页获取图片地址 */
  const getImgUrl = async (imgPageUrl: string): Promise<string> => {
    const res = await request(
      imgPageUrl,
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
  const getImgPageUrl = async (
    pageNum = 0,
  ): Promise<Array<[string, string]>> => {
    const res = await request(
      `${window.location.pathname}${pageNum ? `?p=${pageNum}` : ''}`,
      { fetch: true, errorText: t('site.ehentai.fetch_img_page_url_failed') },
    );
    const pageList: Array<[string, string]> = [
      ...res.responseText.matchAll(
        // 缩略图有三种显示方式：
        // 使用 img 的旧版，不显示页码的单个 div，显示页码的嵌套 div
        /<a href="(.{20,50})"><(img alt=.+?|div><div |div )title=".+?: (.+?)"/gm,
      ),
    ].map(([, url, fileName]) => [url, fileName]);
    if (pageList.length === 0) {
      if (
        res.responseText.includes(
          'Your IP address has been temporarily banned for excessive',
        )
      )
        throw new Error(t('site.ehentai.ip_banned'));
      throw new Error(t('site.ehentai.fetch_img_page_url_failed'));
    }
    return pageList;
  };

  const [loadImgsText, setLoadImgsText] = createSignal(`1-${totalImgNum}`);

  const loadImgs = createRootMemo(() =>
    // eslint-disable-next-line unicorn/explicit-length-check
    extractRange(loadImgsText(), ehImgList.length || totalImgNum),
  );

  const totalPageNum = Number(
    querySelector('.ptt td:nth-last-child(2)')!.textContent!,
  );

  const loadImgList: LoadImgFn = async (setImg) => {
    // 在不知道每页显示多少张图片的情况下，没办法根据图片序号反推出它所在的页数
    // 所以只能一次性获取所有页数上的图片页地址
    if (ehImgPageList.length !== totalPageNum) {
      const allPageList = await plimit(
        createSequence(totalPageNum).map(
          (pageNum) => () => getImgPageUrl(pageNum),
        ),
      );
      ehImgPageList.length = 0;
      ehImgFileNameList.length = 0;
      for (const pageList of allPageList) {
        for (const [url, fileName] of pageList) {
          ehImgPageList.push(url);
          ehImgFileNameList.push(fileName);
        }
      }
    }

    await plimit(
      [...loadImgs()].map((i, order) => async () => {
        if (i < 0) return;
        ehImgList[i] ||= await getImgUrl(ehImgPageList[i]);
        setImg(order, ehImgList[i]);
      }),
    );
    if (enableDetectAd) {
      await getAdPageByFileName(ehImgFileNameList, comicMap[''].adList!);
      await getAdPageByContent(ehImgList, comicMap[''].adList!);
    }
  };
  setComicLoad(dynamicLoad(loadImgList, () => loadImgs().size));

  const cache = await useCache<{ pageRange: { id: number; range: string } }>({
    pageRange: 'id',
  });

  render(() => {
    const hasMultiPage = sidebarDom.children[6]?.classList.contains('gsp');

    const handleClick = async (e: MouseEvent) => {
      if (!e.shiftKey) return;
      e.stopPropagation();

      // eslint-disable-next-line no-alert
      const range = prompt(
        t('other.page_range'),
        (await cache.get('pageRange', unsafeWindow.gid))?.range,
      );
      if (!range) return;
      await cache.set('pageRange', {
        id: unsafeWindow.gid ?? Number(location.pathname.split('/')[2]),
        range,
      });

      setLoadImgsText(range ?? `1-${totalImgNum}`);
      // 删掉当前的图片列表以便触发重新加载
      setComicMap('', 'imgList', undefined);
      showComic();
    };

    return (
      <p
        class="g2 gsp"
        style={{
          'padding-bottom': 0,
          // 表站开启了 Multi-Page Viewer 的话会将点击按钮挤出去，得缩一下位置
          'padding-top': hasMultiPage ? 0 : undefined,
        }}
        oncapture:click={handleClick}
      >
        <img src="https://ehgt.org/g/mr.gif" />
        <LoadButton id="" />
      </p>
    );
  }, sidebarDom);

  // 等加载按钮渲染好后再绑定快捷键，防止在还没准备好时就触发加载导致出错
  if (options.hotkeys) hotkeysPageTurn(pageType);

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
    // TODO: 使用 nl 参数获取新图片将消耗 50 额度，只是一两张还好
    // 但如果因为 bug 等原因导致大量刷新的话会导致额度迅速耗尽
    // 虽然目前没有问题，但以防万一应该在这加个限制
    // 在刷新了十页图片后弹个提示框，点掉提示框后才继续刷新
    const pageUrl = await getNewImgPageUrl(ehImgPageList[i]);
    let imgUrl = '';
    while (!imgUrl || !(await testImgUrl(imgUrl))) {
      imgUrl = await getImgUrl(pageUrl);
      log(`重新获取第 ${i} 页图片的地址\n${ehImgList[i]} ->\n${imgUrl}`);
      toast(`重新获取第 ${i} 页图片的地址`);
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
    title:
      querySelector('#gj')?.textContent || querySelector('#gn')?.textContent,
  });

  setFab('initialShow', options.autoShow);
})().catch((error) => log.error(error));
