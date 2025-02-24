import { type MangaProps } from 'components/Manga';
import { singleThreaded, wait } from 'helper';

import { useInit } from './useInit';
import { type SiteOptions } from './useSiteOptions';

export type UseInitFnMap = AsyncReturnType<typeof useInit>;

export interface InitOptions {
  name: string;
  /** 等待返回 true 后才开始运行。用于等待元素渲染 */
  wait?: () => unknown | Promise<unknown>;

  getImgList: (fnMap: UseInitFnMap) => Promise<string[]> | string[];
  onPrev?: MangaProps['onPrev'];
  onNext?: MangaProps['onNext'];
  onExit?: MangaProps['onExit'];
  onShowImgsChange?: MangaProps['onShowImgsChange'];
  getCommentList?: () => Promise<string[]> | string[];

  /** 初始站点配置 */
  initOptions?: Partial<SiteOptions>;

  /** 用于适配单页应用的配置项 */
  SPA?: {
    /** 判断当前页面是否是漫画页 */
    isMangaPage?: () => Promise<unknown> | unknown;
    getOnPrev?: () => Promise<MangaProps['onPrev']> | MangaProps['onPrev'];
    getOnNext?: () => Promise<MangaProps['onNext']> | MangaProps['onNext'];
    /** 有些 SPA 会在页数变更时修改 url，导致脚本误以为换章节了，需要处理下 */
    handlePageurl?: (location: Location) => string;
  };
}

/**
 * 通过监视点击等会触发动态加载的事件，在触发后执行指定动作
 * @param update 动态加载后的重新加载
 */
const autoUpdate = (update: () => Promise<void>) => {
  const refresh = singleThreaded(update);
  for (const eventName of ['click', 'popstate'])
    window.addEventListener(eventName, refresh, { capture: true });
  refresh();
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
  if (SPA?.isMangaPage) await wait(SPA?.isMangaPage);
  if (waitFn) await wait(waitFn);

  const fnMap = await useInit(name, initOptions);
  const {
    options,
    setComicLoad,
    setManga,
    setFab,
    needAutoShow,
    setComicMap,
    showComic,
  } = fnMap;

  setComicLoad(() => getImgList(fnMap));

  setManga({ onShowImgsChange });
  if (onExit)
    setManga({
      onExit(isEnd) {
        onExit?.(isEnd);
        setManga({ show: false });
      },
    });

  if (!SPA) {
    if (onNext ?? onPrev) setManga({ onNext, onPrev });
    if (getCommentList) setManga({ commentList: await getCommentList() });
    return;
  }

  const { isMangaPage, getOnPrev, getOnNext } = SPA;
  const handlePageurl = SPA?.handlePageurl ?? ((location) => location.href);

  let lastUrl = '';
  autoUpdate(async () => {
    if (!(await wait(() => handlePageurl(window.location) !== lastUrl, 5000)))
      return;
    lastUrl = handlePageurl(window.location);

    if (isMangaPage && !(await isMangaPage())) {
      setFab('show', false);
      setManga({ show: false });
      setComicMap('', 'imgList', undefined);
      return;
    }

    if (waitFn) await wait(waitFn);

    setManga({ onPrev: undefined, onNext: undefined });
    needAutoShow.val = options.autoShow;
    setComicMap('', 'imgList', undefined);
    if (needAutoShow.val && options.autoShow) await showComic('');

    await Promise.all([
      (async () =>
        getCommentList && setManga({ commentList: await getCommentList() }))(),
      (async () =>
        getOnPrev && setManga({ onPrev: await wait(getOnPrev, 5000) }))(),
      (async () =>
        getOnNext && setManga({ onNext: await wait(getOnNext, 5000) }))(),
    ]);
  });
};
