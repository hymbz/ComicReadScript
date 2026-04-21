import type { Promisable } from 'type-fest';

import type { MangaProps } from 'components/Manga';

import { onUrlChange, sleep, wait, waitUrlChange } from 'helper';

import type { MainContext } from '.';

import { useInit } from './useInit';

export type UseInitFnMap = AsyncReturnType<typeof useInit>;

export type InitOptions<T extends Record<string, any> = Record<string, any>> = {
  name: string;
  /** 等待返回 true 后才开始运行。用于等待元素渲染 */
  wait?: () => unknown | Promise<unknown>;

  getImgList: (
    mainContext: MainContext<T>,
  ) => Promise<MangaProps['imgList']> | MangaProps['imgList'];
  onPrev?: MangaProps['onPrev'];
  onNext?: MangaProps['onNext'];
  onExit?: MangaProps['onExit'];
  onShowImgsChange?: MangaProps['onShowImgsChange'];
  getCommentList?: () => Promise<string[]> | string[];

  /** 初始站点配置 */
  initOptions?: Partial<T>;

  /** 用于适配单页应用的配置项 */
  SPA?: {
    /** 在 URL 发生变化后判断当前页面是否是漫画页 */
    isMangaPage?: () => Promise<unknown> | unknown;
    getOnPrev?: () => Promise<MangaProps['onPrev']> | MangaProps['onPrev'];
    getOnNext?: () => Promise<MangaProps['onNext']> | MangaProps['onNext'];
    /** 有些 SPA 会在页数变更时修改 url，导致脚本误以为换章节了，需要处理下 */
    handleUrl?: (location: Location) => string;
  };
};

/** 对简单站点的通用解 */
export const universal = async <T extends Record<string, any> = Record<string, any>>({
  name,
  wait: waitFn,
  getImgList,
  onPrev,
  onNext,
  onExit,
  onShowImgsChange,
  getCommentList,
  initOptions,
  SPA,
}: InitOptions<T>) => {
  if (SPA?.isMangaPage) await waitUrlChange(SPA.isMangaPage);
  if (waitFn) await wait(waitFn);

  const mainContext = await useInit(name, initOptions);
  const { store, setState, showComic } = mainContext;

  setState('comicMap', '', { getImgList: () => getImgList(mainContext) });

  setState('manga', { onShowImgsChange });
  if (onExit)
    setState('manga', {
      onExit: (isEnd?: boolean) => {
        onExit?.(isEnd);
        setState('manga', 'show', false);
      },
    });

  if (!SPA) {
    if (onNext ?? onPrev) setState('manga', { onNext, onPrev });
    if (getCommentList)
      setState('manga', 'commentList', await getCommentList());
    return;
  }

  onUrlChange(async () => {
    if (SPA.isMangaPage && !(await SPA.isMangaPage()))
      return setState((state) => {
        state.fab.show = false;
        state.manga.show = false;
        state.comicMap[''].imgList = undefined;
      });

    if (waitFn) await wait(waitFn);

    setState((state) => {
      state.fab.show = undefined;
      state.manga.onPrev = undefined;
      state.manga.onNext = undefined;
      state.flag.needAutoShow = state.options.autoShow;
      state.comicMap[''].imgList = undefined;
    });
    if (store.options.autoShow) await showComic('');

    await Promise.all([
      (async () =>
        getCommentList &&
        setState('manga', 'commentList', await getCommentList()))(),
      (async () =>
        SPA.getOnPrev &&
        setState('manga', { onPrev: await wait(SPA.getOnPrev, 5000) }))(),
      (async () =>
        SPA.getOnNext &&
        setState('manga', { onNext: await wait(SPA.getOnNext, 5000) }))(),
    ]);
  }, SPA?.handleUrl);
};

// TODO: 使用 universalSPA 重构 universal

/** 用于适配 SPA 站点的配置项 */
export type SpaPageType = { type: string; id: string | null };

export type SpaInitOptions<T extends Record<string, any> = Record<string, any>> = {
  options?: Partial<T>;
  /**
   * 获取当前页面的类型标识
   *
   * 返回的对象中，type 字段用于匹配对应的 handler，其值变化将触发重新初始化；
   * id 字段用于标识同一类型下的不同页面实例，在同类型页面切换时用于判断是否需要重新初始化。
   */
  getPageType: () => Promisable<SpaPageType | undefined>;
  handlers: Record<
    string,
    (
      mainContext: MainContext<T>,
      pageType: SpaPageType,
    ) => Promisable<void | (() => Promisable<void>)>
  >;
  handleUrl?: (location: Location) => string;
};

/** 对简单 SPA 网站的通用解 */
export const universalSPA = async <T extends Record<string, any> = Record<string, any>>(
  name: string,
  { options: initOptions, getPageType, handlers, handleUrl }: SpaInitOptions<T>,
) => {
  let pageType: SpaPageType | undefined = await waitUrlChange(getPageType);
  let cleanup: void | (() => Promisable<void>);

  const mainContext = await useInit(name, initOptions);
  const { store, setState, showComic, loadComic, init } = mainContext;

  const processPageType = async (
    newPageType: typeof pageType,
    force = false,
  ) => {
    if (
      !force &&
      pageType?.type === newPageType?.type &&
      pageType?.id === newPageType?.id
    )
      return;

    await cleanup?.();
    cleanup = undefined;
    pageType = newPageType;
    const isMangePage = newPageType?.type === 'manga';

    setState((state) => {
      // FAB 在漫画页要显示出来，其他页面默认不显示，有需要再在 handlers 里处理
      state.fab.show = isMangePage ? undefined : false;
      state.manga.show = false;
    });

    if (!newPageType) return;

    cleanup = await handlers[newPageType.type]?.(mainContext, newPageType);
    init(isMangePage);

    if (!isMangePage) return;

    const lastImg = store.comicMap[store.nowComic].imgList?.[0];
    // 等到能加载出新图片
    const res = await wait(async () => {
      await sleep(200);
      await loadComic();
      return store.comicMap[store.nowComic].imgList?.[0] !== lastImg;
    }, 10 * 1000);
    // 十秒都加载不出来就算了
    if (!res) return;

    if (store.options.autoShow) await showComic();
  };

  onUrlChange(async (lastUrl) => {
    if (!lastUrl) return await processPageType(pageType, true);

    await processPageType(await getPageType());
  }, handleUrl);
};
