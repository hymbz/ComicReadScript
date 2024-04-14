import { type SiteOptions, autoUpdate, useInit, wait } from 'main';
import type { AsyncReturnType } from 'type-fest';

import type { MangaProps } from '../components/Manga';

export type UseInitFnMap = AsyncReturnType<typeof useInit>;

export interface InitOptions {
  name: string;
  /** 等待返回 true 后才开始运行。用于等待元素渲染 */
  wait?: () => boolean | Promise<boolean>;

  getImgList: (fnMap: UseInitFnMap) => Promise<string[]> | string[];
  onPrev?: MangaProps['onPrev'];
  onNext?: MangaProps['onNext'];
  onExit?: MangaProps['onExit'];
  getCommentList?: () => Promise<string[]> | string[];

  /** 初始站点配置 */
  initOptions?: Partial<SiteOptions>;

  /** 用于适配单页应用的配置项 */
  SPA?: {
    /** 判断当前页面是否是漫画页 */
    isMangaPage?: () => Promise<boolean> | boolean;
    getOnPrev?: () => Promise<MangaProps['onPrev']> | MangaProps['onPrev'];
    getOnNext?: () => Promise<MangaProps['onNext']> | MangaProps['onNext'];
  };
}

/** 对简单站点的通用解 */
export const universalInit = async ({
  name,
  wait: waitFn,
  getImgList,
  onPrev,
  onNext,
  onExit,
  getCommentList,
  initOptions,
  SPA,
}: InitOptions) => {
  if (SPA?.isMangaPage) await wait(SPA?.isMangaPage);
  if (waitFn) await wait(waitFn);

  const fnMap = await useInit(name, initOptions);
  const { init, options, setManga, setFab, needAutoShow } = fnMap;

  const { loadImgList } = init(() => getImgList(fnMap));

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

  let lastUrl = '';
  autoUpdate(async () => {
    if (!(await wait(() => window.location.href !== lastUrl, 5000))) return;
    lastUrl = window.location.href;

    if (isMangaPage && !(await isMangaPage())) {
      setFab('show', false);
      setManga({ show: false, imgList: [] });
      return;
    }

    if (waitFn) await wait(waitFn);

    setManga({ onPrev: undefined, onNext: undefined });
    needAutoShow.val = options.autoShow;
    await loadImgList();

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
