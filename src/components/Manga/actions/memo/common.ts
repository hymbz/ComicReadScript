import { createRootMemo, createThrottleMemo } from 'helper/solidJs';
import { store, refs } from '../../store';
import { findFillIndex } from '../../handleComicData';

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

/** 默认图片类型 */
export const defaultImgType = createRootMemo<ComicImg['type']>(() => {
  if (store.flag.autoWide) return 'wide';
  if (store.flag.autoScrollMode) return 'vertical';
  return '';
});

/** 获取图片列表中指定属性的中位数 */
const getImgMedian = (sizeFn: (value: ComicImg) => number) => {
  if (!store.option.scrollMode) return 0;
  const list = store.imgList
    .filter((img) => img.loadType === 'loaded' && img.width)
    .map(sizeFn)
    .sort();
  if (!list.length) return null;
  return list[Math.floor(list.length / 2)];
};

/** 图片占位尺寸 */
export const placeholderSize = createThrottleMemo(
  () => ({
    width: getImgMedian((img) => img.width!) ?? refs.root?.offsetWidth,
    height: getImgMedian((img) => img.height!) ?? refs.root?.offsetHeight,
  }),
  500,
);

/** 每张图片的高度 */
export const imgHeightList = createRootMemo(() =>
  store.option.scrollMode
    ? store.imgList.map(
        (img) =>
          (img.height ?? placeholderSize().height) *
          store.option.scrollModeImgScale,
      )
    : [],
);

/** 卷轴模式下每张图片的位置 */
export const imgTopList = createRootMemo(() => {
  if (!store.option.scrollMode) return [];

  const list = new Array<number>(imgHeightList().length);
  let top = 0;
  for (let i = 0; i < imgHeightList().length; i++) {
    list[i] = top;
    top += imgHeightList()[i] + store.option.scrollModeSpacing * 7;
  }
  return list;
});

/** 漫画流的总高度 */
export const contentHeight = createRootMemo(
  () => (imgTopList().at(-1) ?? 0) + (imgHeightList().at(-1) ?? 0),
);
