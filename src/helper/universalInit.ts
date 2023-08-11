import { autoUpdate, useInit, wait } from 'main';
import type { AsyncReturnType } from 'type-fest';
import type { MangaProps } from '../components/Manga';

export type UseInitFnMap = AsyncReturnType<typeof useInit>;

export interface InitOptions {
  name: string;
  /** 等待返回 true 后才开始运行。用于等待元素渲染 */
  wait?: () => boolean | Promise<boolean>;
  /** 返回 true 立刻结束运行。用于跳过非漫画页 */
  exit?: () => boolean | Promise<boolean>;

  getImgList: (fnMap: UseInitFnMap) => Promise<string[]> | string[];
  onPrev?: MangaProps['onPrev'];
  onNext?: MangaProps['onNext'];
  onExit?: MangaProps['onExit'];
  getCommentList?: () => Promise<string[]> | string[];

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
  exit,
  wait: waitFn,
  getImgList,
  onPrev,
  onNext,
  onExit,
  getCommentList,
  SPA,
}: InitOptions) => {
  if (waitFn) await wait(waitFn);
  if (await exit?.()) return;

  const fnMap = await useInit(name);
  const { init, options, setManga, setFab, needAutoShow } = fnMap;

  const { loadImgList } = init(() => getImgList(fnMap));

  if (onExit)
    setManga({
      onExit: (isEnd) => {
        onExit?.(isEnd);
        setManga({ show: false });
      },
    });

  if (!SPA) {
    if (onNext || onPrev) setManga({ onNext, onPrev });
    if (getCommentList) setManga({ commentList: await getCommentList() });
    return;
  }

  const { isMangaPage, getOnPrev, getOnNext } = SPA;

  let lastUrl = '';
  autoUpdate(async () => {
    if (window.location.href === lastUrl) return;
    lastUrl = window.location.href;

    if (isMangaPage && !(await isMangaPage())) {
      setFab({ show: false });
      setManga({ show: false, imgList: [] });
      return;
    }

    if (waitFn) await wait(waitFn);

    // 先将 imgList 清空以便 activePageIndex 归零
    setManga({ imgList: [] });
    needAutoShow.val = options.autoShow;
    await loadImgList();

    if (getOnNext || getOnPrev)
      setManga({ onNext: await getOnNext?.(), onPrev: await getOnPrev?.() });
    if (getCommentList) setManga({ commentList: await getCommentList() });
  });
};
