import { createRootMemo, createThrottleMemo } from 'helper';

import type { ComicImg } from '../../store/image';

import { store } from '../../store';
import { findFillIndex } from '../helper';

export const imgList = createRootMemo(() =>
  store.imgList.map((url) => store.imgMap[url]),
);

/** 当前是否为并排卷轴模式 */
export const isAbreastMode = createRootMemo(
  () => store.option.scrollMode.enabled && store.option.scrollMode.abreastMode,
);

/** 当前是否为双页卷轴模式 */
export const isDoubleMode = createRootMemo(
  () => store.option.scrollMode.enabled && store.option.scrollMode.doubleMode,
);

/** 当前是否为普通卷轴模式（包含了双页卷轴模式） */
export const isScrollMode = createRootMemo(
  () => store.option.scrollMode.enabled && !store.option.scrollMode.abreastMode,
);

/** 当前是否开启了识别背景色 */
export const isEnableBg = createRootMemo(
  () =>
    store.option.imgRecognition.enabled &&
    store.option.imgRecognition.background,
);

/** 当前显示页面 */
export const activePage = createRootMemo(
  () => store.pageList[store.activePageIndex] ?? [],
);

/** 当前显示的第一张图片的 index */
export const activeImgIndex = createRootMemo(
  () => activePage().find((i) => i !== -1) ?? 0,
);

/** 当前所处的图片流 */
export const nowFillIndex = createRootMemo(() =>
  findFillIndex(activeImgIndex(), store.fillEffect),
);

/** 预加载页数 */
export const preloadNum = createRootMemo(() => ({
  back: store.option.preloadPageNum,
  front: Math.floor(store.option.preloadPageNum / 2),
}));

/** 获取图片列表中指定属性的中位数 */
const getImgMedian = (sizeFn: (value: ComicImg) => number) => {
  const list = imgList()
    .filter((img) => img.loadType === 'loaded' && img.width)
    .map(sizeFn)
    .sort((a, b) => a - b);
  // 因为涉及到图片默认类型的计算，所以至少等到加载完三张图片再计算，避免被首页大图干扰
  if (list.length < 3) return null;
  return list[Math.floor(list.length / 2)];
};

/** 图片占位尺寸 */
export const placeholderSize = createThrottleMemo(
  () => ({
    width: getImgMedian((img) => img.width!) ?? 800,
    height: getImgMedian((img) => img.height!) ?? 1200,
  }),
  500,
);

/** 并排卷轴模式下的列宽度 */
export const abreastColumnWidth = createRootMemo(() =>
  isAbreastMode()
    ? placeholderSize().width * store.option.scrollMode.imgScale
    : 0,
);

export const autoPageNum = createThrottleMemo(() =>
  store.rootSize.width >= store.rootSize.height ? 2 : 1,
);

export const pageNum = createRootMemo(
  () => store.option.pageNum || autoPageNum(),
);

/** 是否为单页模式 */
export const isOnePageMode = createRootMemo(() => {
  if (store.isMobile || store.imgList.length <= 1) return true;
  if (store.option.scrollMode.enabled) {
    if (store.option.scrollMode.abreastMode) return true;
    return !store.option.scrollMode.doubleMode;
  }
  return pageNum() === 1;
});

if (isDevMode)
  Object.assign((window as any).unsafeWindow ?? window, {
    _imgList: imgList,
  });
