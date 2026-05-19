import { type MangaProps } from 'components/Manga';
import {
  isEqual,
  onUrlChange,
  requestIdleCallback,
  sleep,
  wait,
  waitUrlChange,
} from 'helper';
import { type Promisable } from 'type-fest';

import { type CoreContext } from './types';
import { useInit } from './useInit';

export type SetupOptions<T extends Record<string, any> = Record<string, any>> =
  {
    name: string;
    /** 初始站点配置 */
    initOptions?: Partial<Record<string, any>>;

    /**
     * SpaInitOptions.getPageContext 的简化版，只用来判断漫画页
     *
     * 返回的对象会被当作 pageCtx，用来区分不同章节
     * （SPA 网站必须返回额外字段来区分）
     */
    isMangaPage?: () => Promisable<T | boolean | void>;

    getImgList: (
      coreCtx: CoreContext,
      pageCtx: T & { type: 'manga' },
    ) => Promisable<MangaProps['imgList']>;
    onPrev?: () => Promisable<MangaProps['onPrev'] | undefined>;
    onNext?: () => Promisable<MangaProps['onNext'] | undefined>;
    onExit?: MangaProps['onExit'];

    // 给小众特殊需求留的接口
    handler?: (coreCtx: CoreContext) => Promisable<void>;
  };

/** 快速适配简单网站 */
export const setup = async <
  T extends Record<string, any> = Record<string, any>,
>({
  name,
  initOptions,
  isMangaPage,
  getImgList,
  onPrev,
  onNext,
  onExit,
  handler: userHandler,
}: SetupOptions<T>) => {
  await setupSiteAdapter<T & { type: 'manga' }>({
    name,
    options: initOptions,
    getPageContext: async () => {
      const data = isMangaPage ? await isMangaPage() : {};
      if (!data) return;
      return { type: 'manga', ...(data === true ? {} : data) } as {
        type: 'manga';
      } & T;
    },
    handlers: {
      manga: async (coreCtx, pageCtx) => {
        const { setState } = coreCtx;

        setState((state) => {
          state.comicMap[''] = {
            getImgList: (ctx) => getImgList(ctx, pageCtx),
          };
          state.manga.onExit = (isEnd?: boolean) => {
            onExit?.(isEnd);
            setState('manga', 'show', false);
          };
        });

        await userHandler?.(coreCtx);

        (async () => {
          if (onPrev) setState('manga', { onPrev: await wait(onPrev, 5000) });
          if (onNext) setState('manga', { onNext: await wait(onNext, 5000) });
        })();
      },
    } as {
      manga: (
        coreCtx: CoreContext,
        pageCtx: T & { type: 'manga' },
      ) => Promisable<void | CleanupFn<T>>;
    },
  });
};

/** 用于适配 SPA 站点的页面上下文类型 */
export type SpaPageContext = { type: string } & Record<string, unknown>;

type CleanupFn<PageContext> = (nextPageCtx?: PageContext) => Promisable<void>;

export type PageHandler<
  PageContext extends SpaPageContext = SpaPageContext,
  Options extends Record<string, unknown> = Record<string, unknown>,
> = (
  coreCtx: CoreContext<Options>,
  pageCtx: PageContext,
) => Promisable<void | CleanupFn<PageContext>>;

export type SpaInitOptions<
  PageContext extends SpaPageContext = SpaPageContext,
  Options extends Record<string, unknown> = Record<string, unknown>,
> = {
  name: string;
  options?: Partial<Options>;
  /**
   * 获取当前页面的上下文信息
   *
   * 返回的对象中，type 字段用于匹配对应的 handler，其值变化将触发重新初始化。
   * 对于同一类型下的不同页面实例（如不同画廊、不同章节），
   * 需通过添加自定义标识字段（如 galleryId、chapterId 等）来区分。
   */
  getPageContext: (
    lastPageCtx?: PageContext,
  ) => Promisable<PageContext | undefined>;
  /** 根据 PageContext 自动调用匹配的 handler */
  handlers: {
    /** 在匹配到的 handler 执行前调用，用于放置在所有页面上都要执行的逻辑 */
    all?: PageHandler<PageContext, Options>;
  } & {
    [K in PageContext['type']]?: (
      coreCtx: CoreContext<Options>,
      pageCtx: Extract<PageContext, { type: K }>,
    ) => Promisable<void | CleanupFn<PageContext>>;
  };
  /**
   * 类似 handlers.all，但只会在对应的 options 启用时执行
   *
   * 在匹配的 handlers 执行前调用
   */
  features?: {
    [FeatureName in keyof Options]?: PageHandler<PageContext, Options>;
  };
};

export const setupSiteAdapter = async <
  PageContext extends SpaPageContext = SpaPageContext,
  Options extends Record<string, any> = Record<string, any>,
>({
  name,
  options: initOptions,
  getPageContext,
  handlers,
  features,
}: SpaInitOptions<PageContext, Options>) => {
  let pageCtx: PageContext | undefined;
  const cleanupFns: CleanupFn<PageContext>[] = [];

  pageCtx = await waitUrlChange(() => getPageContext(pageCtx));

  const coreCtx = await useInit(name, initOptions);
  const { store, setState, showComic, loadComic, init, options } = coreCtx;

  const processPageContext = async (
    newPageCtx: PageContext | undefined,
    force = false,
  ) => {
    if (!force && isEqual(pageCtx, newPageCtx)) return;

    for (const cleanup of cleanupFns) await cleanup(newPageCtx);
    cleanupFns.length = 0;
    pageCtx = newPageCtx;
    const isMangePage = newPageCtx?.type === 'manga';

    setState((state) => {
      state.flag.hasPageHandler =
        Boolean(newPageCtx?.type) && Reflect.has(handlers, newPageCtx!.type);
      state.manga.show = false;
      // 页面类型切换时重置 comicMap，触发响应式更新
      state.comicMap = {
        '': {
          // oxlint-disable-next-line func-name-matching no-shadow
          getImgList: function init() {
            return [];
          },
        },
      };
    });

    if (!newPageCtx) return;

    init(isMangePage);

    const allCleanup = await handlers.all?.(coreCtx, newPageCtx);
    if (allCleanup) cleanupFns.push(allCleanup);

    const handlerCleanup = await handlers[
      newPageCtx.type as PageContext['type']
    ]?.(
      coreCtx,
      newPageCtx as Extract<PageContext, { type: PageContext['type'] }>,
    );
    if (handlerCleanup) cleanupFns.push(handlerCleanup);

    if (features) {
      for (const [featureName, handler] of Object.entries(features)) {
        if (!options[featureName as keyof Options] || !handler) continue;
        // oxlint-disable-next-line no-loop-func
        requestIdleCallback(async () => {
          const cleanup = await handler(coreCtx, newPageCtx);
          if (cleanup && pageCtx === newPageCtx) cleanupFns.push(cleanup);
        }, 1000);
      }
    }

    if (!isMangePage || !store.options.autoShow) return;

    const lastImg = store.comicMap[store.nowComic].imgList?.[0];
    const res = await wait(async () => {
      await sleep(200);
      await loadComic();
      return store.comicMap[store.nowComic].imgList?.[0] !== lastImg;
    }, 10 * 1000);
    if (res) await showComic();
  };

  onUrlChange(async (lastUrl) => {
    if (!lastUrl) return await processPageContext(pageCtx, true);
    await processPageContext(await getPageContext(pageCtx));
  });
};
