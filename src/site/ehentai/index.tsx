import type { Component } from 'solid-js';

import { createSignal, For, Show } from 'solid-js';
import { render } from 'solid-js/web';

import type { MangaProps } from 'components/Manga';
import type { LoadImgFn } from 'main';

import {
  listenHotkey,
  imgList as MangaImgList,
  SettingBlockSubtitle,
  SettingHotkeys,
  SettingsItemSwitch,
} from 'components/Manga';
import {
  assign,
  createRootMemo,
  extractRange,
  log,
  plimit,
  querySelector,
  querySelectorAll,
  range,
  requestIdleCallback,
  scrollIntoView,
  singleThreaded,
  sleep,
  t,
  testImgUrl,
  useCache,
  useStyle,
  wait,
} from 'helper';
import { request, toast } from 'main';

import { colorizeTag } from './colorizeTag';
import { crossSiteLink } from './crossSiteLink';
import { detectAd } from './detectAd';
import { expandTagList } from './expandTagList';
import { floatTagList } from './floatTagList';
import { createEhContext, escHandler, isInCategories } from './helper';
import { addHotkeysActions } from './hotkeys';
import { quickFavorite } from './quickFavorite';
import { quickRating } from './quickRating';
import { quickTagDefine } from './quickTagDefine';
import { sortTags } from './sortTags';
import { tagLint } from './tagLint';

// [ehentai 图像限额](https://github.com/ccloli/E-Hentai-Downloader/wiki/E−Hentai-Image-Viewing-Limits-(Chinese))

(async () => {
  const context = await createEhContext();
  if (!context) return;

  const { setState, options, setOptions, showComic } = context;

  const SiteSettings: Component = () => (
    <>
      <For
        each={[
          'colorize_tag', // 标签染色
          'float_tag_list', // 悬浮标签列表
          'expand_tag_list', // 展开标签列表
          'tag_lint', // 标签检查
          '',
          'quick_favorite', // 快捷收藏
          'quick_rating', // 快捷评分
          'quick_tag_define', // 快捷查看标签定义
          '',
          'cross_site_link', // 关联外站
          'detect_ad', // 识别广告页
          'add_hotkeys_actions', // 增加快捷键操作
          'auto_adjust_option', // 自动调整配置
        ]}
      >
        {(name) => (
          <Show when={name} fallback={<hr />}>
            <SettingsItemSwitch
              name={t(`site.add_feature.${name}`)}
              value={options[name]}
              onChange={(v) => setOptions({ [name]: v })}
            />
          </Show>
        )}
      </For>
      <hr />
      <SettingBlockSubtitle>{t('other.hotkeys')}</SettingBlockSubtitle>
      <SettingHotkeys keys={['float_tag_list']} />
    </>
  );

  setState((state) => {
    state.manga.editSettingList = (list) => [
      ...list,
      ['E-Hentai', SiteSettings],
    ];
    state.fab.otherSpeedDial = [
      'tag_lint',
      'colorize_tag',
      'cross_site_link',
      'detect_ad',
    ];
  });

  if (context.type === 'mpv') {
    return setState('comicMap', '', {
      getImgList({ dynamicLoad }) {
        const imgEleList = querySelectorAll('.mimg[id]');
        const loadImgList: LoadImgFn = (setImg) => {
          const imagelist = unsafeWindow.imagelist as {
            i: string;
            xhr: XMLHttpRequest;
          }[];
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
        return dynamicLoad(loadImgList, imgEleList.length);
      },
    });
  }

  // 按顺序处理 esc 按键
  listenHotkey({
    Escape: (e) => {
      for (const handler of escHandler.values())
        if (handler() !== true) return e.stopImmediatePropagation();
    },
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
  // 展开标签列表
  if (options.expand_tag_list)
    requestIdleCallback(() => expandTagList(context), 1000);

  // 不是漫画页就退出
  if (context.type !== 'gallery') return addHotkeysActions(context);

  // 自动调整阅读配置
  if (
    options.auto_adjust_option &&
    !isInCategories('Doujinshi', 'Manga', 'Non-H')
  ) {
    let option: MangaProps['defaultOption'] = {
      // 使用单页模式
      pageNum: 1,
      // 关闭图像识别
      imgRecognition: { enabled: false },
    };
    if (options.option) option = assign(options.option, option);
    setState('manga', 'option', option);
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
    const lastNode = querySelector('#gd5 p:last-of-type')!;
    if (lastNode.offsetTop + lastNode.offsetHeight > 352)
      sidebarDom.dataset.long = '';
  });
  resizeObserver.observe(sidebarDom);
  useStyle(`
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


    /*
      消除 ehs 针对按钮太多时的解决办法，用脚本的处理方式就好了，避免在浮动标签栏时导致滚动
      https://github.com/EhTagTranslation/EhSyringe/commit/009054cc34ee818972d2a042990bf89bdff1895a
     */
    body #gmid #gd5 { --ehs-gap: 1; justify-content: unset; }
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
  const getImgPageUrl = async (pageNum = 0): Promise<[string, string][]> => {
    const res = await request(
      `${location.pathname}${pageNum ? `?p=${pageNum}` : ''}`,
      { fetch: true, errorText: t('site.ehentai.fetch_img_page_url_failed') },
    );
    checkIpBanned(res.responseText);
    const pageList: [string, string][] = [
      ...res.responseText.matchAll(
        // 缩略图有三种显示方式：
        // 使用 img 的旧版，不显示页码的单个 div，显示页码的嵌套 div
        /<a href="(.{20,50})"><(img alt=.+?|div><div |div )title=".+?: (.+?)"/g,
      ),
    ].map(([, url, , fileName]) => [url, fileName]);
    if (pageList.length === 0)
      throw new Error(t('site.ehentai.fetch_img_page_url_failed'));
    return pageList;
  };

  const [loadImgsText, setLoadImgsText] = createSignal(`1-${context.imgNum}`);

  const loadImgs = createRootMemo(() =>
    // oxlint-disable-next-line explicit-length-check
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
        range(totalPageNum, (pageNum) => () => getImgPageUrl(pageNum)),
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
        setImg(order, {
          src: context.imgList[i],
          name: context.fileNameList[i],
        });
      }),
    );
    checkAd?.();
  };
  setState('comicMap', '', {
    getImgList: ({ dynamicLoad }) =>
      dynamicLoad(loadImgList, () => loadImgs().size),
  });

  const cache = await useCache<{ pageRange: { id: number; range: string } }>({
    pageRange: 'id',
  });

  render(() => {
    const hasMultiPage = sidebarDom.children[6]?.classList.contains('gsp');

    const handleClick = async (e: MouseEvent) => {
      if (!e.shiftKey) return;
      e.stopPropagation();

      const saveRange = await cache.get('pageRange', unsafeWindow.gid);
      // eslint-disable-next-line no-alert
      const pageRange = prompt(t('other.page_range'), saveRange?.range);
      if (!pageRange) return;
      await cache.set('pageRange', {
        id: unsafeWindow.gid ?? context.galleryId,
        range: pageRange,
      });

      setLoadImgsText(pageRange ?? `1-${context.imgNum}`);
      // 删掉当前的图片列表以便触发重新加载
      setState('comicMap', '', 'imgList', undefined);
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
  addHotkeysActions(context);

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
    setState('comicMap', '', 'imgList', context.imgList);

    for (const img of MangaImgList())
      if (img.loadType === 'error') return reloadImg(img.src);
  });

  setState((state) => {
    state.manga.title = context.japanTitle || context.galleryTitle;
    state.manga.onExit = (isEnd) => {
      if (isEnd) scrollIntoView('#cdiv');
      setState('manga', 'show', false);
    };
    state.manga.onImgError = reloadImg;

    state.fab.initialShow = options.autoShow;
  });
})().catch((error) => log.error(error));
