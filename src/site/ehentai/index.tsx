import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';
import { request, toast, type LoadImgFn } from 'main';
import { type MangaProps, imgList as MangaImgList } from 'components/Manga';
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
  createRootMemo,
  requestIdleCallback,
  linstenKeydown,
  assign,
  createSequence,
  extractRange,
  useCache,
  sleep,
} from 'helper';

import { escHandler, createEhContext } from './helper';
import { quickFavorite } from './quickFavorite';
import { crossSiteLink } from './crossSiteLink';
import { hotkeysPageTurn } from './hotkeys';
import { colorizeTag } from './colorizeTag';
import { quickRating } from './quickRating';
import { quickTagDefine } from './quickTagDefine';
import { floatTagList } from './floatTagList';
import { sortTags } from './sortTags';
import { tagLint } from './tagLint';
import { detectAd } from './detectAd';

// [ehentai 图像限额](https://github.com/ccloli/E-Hentai-Downloader/wiki/E−Hentai-Image-Viewing-Limits-(Chinese))

(async () => {
  const context = await createEhContext({
    /** 关联外站 */
    cross_site_link: true,
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
  if (!context) return;

  const {
    options,
    setComicLoad,
    dynamicLoad,
    showComic,
    setComicMap,
    setImgList,
    setFab,
    setManga,
  } = context;

  if (context.type === 'mpv') {
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
    colorizeTag(context.type);
    sortTags(context);
  }
  // 快捷收藏。必须处于登录状态
  if (unsafeWindow.apiuid !== -1 && options.quick_favorite)
    requestIdleCallback(() => quickFavorite(context));
  // 快捷评分
  if (options.quick_rating)
    requestIdleCallback(() => quickRating(context), 1000);

  // 不是漫画页就退出
  if (context.type !== 'gallery') return hotkeysPageTurn(context);

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

  // 悬浮标签列表
  if (options.float_tag_list) requestIdleCallback(() => floatTagList(context));
  // 快捷查看标签定义
  if (options.quick_tag_define)
    requestIdleCallback(() => quickTagDefine(context), 1000);
  // 标签检查
  if (options.tag_lint) requestIdleCallback(() => tagLint(context), 1000);

  const sidebarDom = document.getElementById('gd5')!;

  // 限定右侧按钮框的高度，避免因为按钮太多而突出界面
  const resizeObserver = new ResizeObserver(() => {
    // 只在超出正常高度时才使用 css 限制，避免和其他脚本（如：EhAria2下载助手）冲突
    Reflect.deleteProperty(sidebarDom.dataset, 'long');
    if (sidebarDom.scrollHeight > 352) sidebarDom.dataset.long = '';
  });
  resizeObserver.observe(sidebarDom);
  GM_addStyle(`
    #gd5[data-long] {
      --scrollbar-slider: ${getComputedStyle(querySelector('.gm')!).borderColor};
      scrollbar-color: var(--scrollbar-slider) transparent;
      scrollbar-width: thin;
      overflow: auto;
      max-height: 352px;
      &::-webkit-scrollbar { width: 5px; height: 10px; }
      &::-webkit-scrollbar-track { background: transparent; }
      &::-webkit-scrollbar-thumb { background: var(--scrollbar-slider); }
    }
    /* 在显示 ehs 时隐藏 gd5 上的滚动条，避免同时显示两个滚动条 */
    #gd5[data-long]:has(#ehs-introduce-box .ehs-content) { overflow: hidden; }
    #gmid #ehs-introduce-box { width: 100%; }
  `);

  // 关联外站
  if (options.cross_site_link)
    requestIdleCallback(() => crossSiteLink(context), 1000);

  if (Number.isNaN(context.imgNum))
    return toast.error(t('site.changed_load_failed'));

  /** 在图片加载后识别广告 */
  const checkAd = await detectAd(context);

  const checkIpBanned = (text: string) =>
    text.includes('IP address has been temporarily banned') &&
    toast.error(t('site.ehentai.ip_banned'), {
      throw: true,
      duration: Number.POSITIVE_INFINITY,
    });

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
    checkIpBanned(res.responseText);
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
    checkIpBanned(res.responseText);
    const pageList: Array<[string, string]> = [
      ...res.responseText.matchAll(
        // 缩略图有三种显示方式：
        // 使用 img 的旧版，不显示页码的单个 div，显示页码的嵌套 div
        /<a href="(.{20,50})"><(img alt=.+?|div><div |div )title=".+?: (.+?)"/gm,
      ),
    ].map(([, url, , fileName]) => [url, fileName]);
    if (pageList.length === 0)
      throw new Error(t('site.ehentai.fetch_img_page_url_failed'));
    return pageList;
  };

  const [loadImgsText, setLoadImgsText] = createSignal(`1-${context.imgNum}`);

  const loadImgs = createRootMemo(() =>
    // eslint-disable-next-line unicorn/explicit-length-check
    extractRange(loadImgsText(), context.imgList.length || context.imgNum),
  );

  const totalPageNum = Number(
    querySelector('.ptt td:nth-last-child(2)')!.textContent!,
  );

  const loadImgList: LoadImgFn = async (setImg) => {
    // 在不知道每页显示多少张图片的情况下，没办法根据图片序号反推出它所在的页数
    // 所以只能一次性获取所有页数上的图片页地址
    if (context.pageList.length !== totalPageNum) {
      const allPageList = await plimit(
        createSequence(totalPageNum).map(
          (pageNum) => () => getImgPageUrl(pageNum),
        ),
      );
      context.pageList.length = 0;
      context.fileNameList.length = 0;
      for (const pageList of allPageList) {
        for (const [url, fileName] of pageList) {
          context.pageList.push(url);
          context.fileNameList.push(fileName);
        }
      }
    }

    await plimit(
      [...loadImgs()].map((i, order) => async () => {
        if (i < 0) return;
        context.imgList[i] ||= await getImgUrl(context.pageList[i]);
        setImg(order, context.imgList[i]);
      }),
    );
    checkAd?.();
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
        id: unsafeWindow.gid ?? context.galleryId,
        range,
      });

      setLoadImgsText(range ?? `1-${context.imgNum}`);
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
        <context.LoadButton id="" />
      </p>
    );
  }, sidebarDom);

  // 等加载按钮渲染好后再绑定快捷键，防止在还没准备好时就触发加载导致出错
  if (options.hotkeys) hotkeysPageTurn(context);

  /** 获取新的图片页地址 */
  const getNewImgPageUrl = async (url: string) => {
    const res = await request(url, {
      errorText: t('site.ehentai.fetch_img_page_source_failed'),
    });
    checkIpBanned(res.responseText);
    const nl = /nl\('(.+?)'\)/.exec(res.responseText)?.[1];
    if (!nl) throw new Error(t('site.ehentai.fetch_img_url_failed'));
    const newUrl = new URL(url);
    newUrl.searchParams.set('nl', nl);
    return newUrl.href;
  };

  /** 刷新指定图片 */
  const reloadImg = singleThreaded(async (_, url: string): Promise<void> => {
    const i = context.imgList.indexOf(url);
    if (i === -1) return;
    context.imgList[i] = await getImgUrl(context.pageList[i]);
    if (!(await testImgUrl(context.imgList[i]))) {
      context.pageList[i] = await getNewImgPageUrl(context.pageList[i]);
      context.imgList[i] = await getImgUrl(context.pageList[i]);
      toast.warn(t('alert.retry_get_img_url', { i }));
      if (!(await testImgUrl(context.imgList[i]))) {
        await sleep(500);
        return reloadImg(url);
      }
    }
    setImgList('', i, context.imgList[i]);

    for (const img of MangaImgList())
      if (img.loadType === 'error') return reloadImg(img.src);
  });

  setManga({
    title: context.japanTitle || context.galleryTitle,
    onExit(isEnd) {
      if (isEnd) scrollIntoView('#cdiv');
      setManga('show', false);
    },
    onImgError: reloadImg,
  });

  setFab('initialShow', options.autoShow);
})().catch((error) => log.error(error));
