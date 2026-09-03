import { type MangaProps } from 'components/Manga';
import {
  createEffectOn,
  exposeToGlobal,
  isEqual,
  onUrlChange,
  requestIdleCallback,
  sleep,
  wait,
  waitDom,
  waitUrlChange,
} from 'helper';
import { type Promisable } from 'type-fest';
import { AutoImageScanner } from 'userscript/autoImageScanner';

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
    handler?: (
      coreCtx: CoreContext,
      pageCtx: T & { type: 'manga' },
    ) => Promisable<void>;
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

        await userHandler?.(coreCtx, pageCtx);

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
export type SpaPageContext = {
  type: string;
  /**
   * 当站点有多个不同 type 的页面都是漫画页时，需要显式设为 true 来标识，
   * 否则只会把 type === 'manga' 的页面当作漫画页
   */
  isManga?: boolean;
} & Record<string, unknown>;

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
    all?: (
      coreCtx: CoreContext<Options>,
      pageCtx: PageContext | undefined,
    ) => Promisable<void | CleanupFn<PageContext>>;
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
   *
   * 如果没有使用 `pageCtx` 参数，会在所有页面执行
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

  // 没有 handlers.all 时，等到进入可识别页面再继续
  pageCtx = handlers.all
    ? await getPageContext(pageCtx)
    : await waitUrlChange(() => getPageContext(pageCtx));

  if (isDevMode) exposeToGlobal({ pageCtx });

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
    const isMangePage = newPageCtx?.isManga ?? newPageCtx?.type === 'manga';

    setState((state) => {
      state.flag.hasPageHandler =
        Boolean(newPageCtx?.type) && Reflect.has(handlers, newPageCtx!.type);
      state.manga.show = false;
      // 页面类型切换时重置 comicMap，触发响应式更新
      state.comicMap = {
        '': {
          getImgList: Object.assign(() => [], { type: 'init' as const }),
        },
      };
    });

    // handlers.all 需要在所有页面运行，包括 pageCtx 为 undefined 的页面
    const allCleanup = await handlers.all?.(coreCtx, newPageCtx);
    if (allCleanup) cleanupFns.push(allCleanup);

    if (features) {
      for (const [featureName, handler] of Object.entries(features)) {
        if (!options[featureName as keyof Options] || !handler) continue;
        // 接收 pageCtx 参数的 feature 依赖页面类型，在页面无法识别时跳过
        if (handler.length >= 2 && !newPageCtx) continue;
        // oxlint-disable-next-line no-loop-func
        requestIdleCallback(async () => {
          const cleanup = await handler(coreCtx, newPageCtx!);
          if (cleanup && pageCtx === newPageCtx) cleanupFns.push(cleanup);
        }, 1000);
      }
    }

    if (!newPageCtx) return;

    init(isMangePage);

    const handlerCleanup = await handlers[
      newPageCtx.type as PageContext['type']
    ]?.(
      coreCtx,
      newPageCtx as Extract<PageContext, { type: PageContext['type'] }>,
    );
    if (handlerCleanup) cleanupFns.push(handlerCleanup);

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

export type SimpleSetupOptions<
  T extends Record<string, any> = Record<string, any>,
> = {
  name: string;
  /** 初始站点配置 */
  initOptions?: Partial<Record<string, any>>;
  isMangaPage?: SetupOptions<T>['isMangaPage'];
  onPrev?: SetupOptions<T>['onPrev'];
  onNext?: SetupOptions<T>['onNext'];
  onExit?: MangaProps['onExit'];
  /** 站点显式提供的首选 selector；缺失时直接使用启发式发现 */
  selector?: string;
  /** 是否按图片在页面中的垂直位置排序，否则将按 Dom 顺序排序 */
  sortImageByTop?: boolean;
};

/** 适配「将所有图片显示在一个页面上」的网站 */
export const setupSimple = async <
  T extends Record<string, any> = Record<string, any>,
>({
  name,
  initOptions,
  isMangaPage,
  onPrev,
  onNext,
  onExit,
  selector,
  sortImageByTop,
}: SimpleSetupOptions<T>) => {
  let scanner: AutoImageScanner;

  await setupSiteAdapter<T & { type: 'manga' }>({
    name,
    options: initOptions,
    getPageContext: async () => {
      if (isMangaPage) {
        const data = await isMangaPage();
        if (!data) return;
        return { type: 'manga', ...(data === true ? {} : data) } as {
          type: 'manga';
        } & T;
      }

      // 没有 isMangaPage 但传了 selector 时，用 selector 是否匹配到多个元素来判断漫画页
      if (selector && !(await waitDom(selector, 2, 1000))) return;

      return { type: 'manga' } as { type: 'manga' } & T;
    },
    handlers: {
      manga: ({ setState, store }) => {
        scanner ??= new AutoImageScanner({
          selector,
          sortImageByTop,
          onImgListChange: (imgList) =>
            setState('comicMap', '', 'imgList', imgList),
          onChapterSwitchChange: async ({ prev, next }) => {
            const customPrev = onPrev ? await onPrev() : undefined;
            const customNext = onNext ? await onNext() : undefined;
            setState('manga', {
              onPrev: customPrev ?? prev,
              onNext: customNext ?? next,
            });
          },
          shouldTriggerLazyLoad: () =>
            store.manga.show || store.manga.imgList.length === 0,
        });

        setState((state) => {
          state.comicMap[''] = {
            getImgList: () => {
              scanner.start();
              void scanner.triggerLazyLoad();
              return scanner.waitFirstImage(10_000);
            },
          };
          state.manga.onExit = (isEnd?: boolean) => {
            onExit?.(isEnd);
            setState('manga', 'show', false);
          };
        });

        createEffectOn(
          () => store.manga.show,
          (show) => show && void scanner.triggerLazyLoad(),
        );

        return () => scanner.stop();
      },
    } as {
      manga: (
        coreCtx: CoreContext,
        pageCtx: T & { type: 'manga' },
      ) => Promisable<void | CleanupFn<T>>;
    },
  });
};
