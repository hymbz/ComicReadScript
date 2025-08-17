import type { MangaProps } from 'components/Manga';

import { onUrlChange, wait, waitUrlChange } from 'helper';

import type { MainContext, SiteOptions } from '.';

import { useInit } from './useInit';

export type UseInitFnMap = AsyncReturnType<typeof useInit>;

export type InitOptions = {
  name: string;
  /** 等待返回 true 后才开始运行。用于等待元素渲染 */
  wait?: () => unknown | Promise<unknown>;

  getImgList: (
    mainContext: MainContext,
  ) => Promise<MangaProps['imgList']> | MangaProps['imgList'];
  onPrev?: MangaProps['onPrev'];
  onNext?: MangaProps['onNext'];
  onExit?: MangaProps['onExit'];
  onShowImgsChange?: MangaProps['onShowImgsChange'];
  getCommentList?: () => Promise<string[]> | string[];

  /** 初始站点配置 */
  initOptions?: Partial<SiteOptions>;

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
export const universal = async ({
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
}: InitOptions) => {
  if (SPA?.isMangaPage) await waitUrlChange(SPA.isMangaPage);
  if (waitFn) await wait(waitFn);

  const mainContext = await useInit(name, initOptions);
  const { store, setState, showComic } = mainContext;

  setState('comicMap', '', { getImgList: () => getImgList(mainContext) });

  setState('manga', 'onShowImgsChange', onShowImgsChange);
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
