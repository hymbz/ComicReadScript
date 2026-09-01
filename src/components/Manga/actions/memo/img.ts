import { createRootMemo, createThrottleMemo, exposeToGlobal } from 'helper';

import { store } from '../../store';
import { type ComicImg, type FillEffect } from '../../store/image';

export const imgList = createRootMemo(() =>
  store.imgList.map((url) => store.imgMap[url]),
);

/** 图片 url 对应的索引 */
export const imgIndexMap = createRootMemo(() => {
  const map = new Map<string, number[]>();
  for (const [index, url] of store.imgList.entries()) {
    const indexList = map.get(url);
    if (indexList) indexList.push(index);
    else map.set(url, [index]);
  }
  return map;
});

/** 当前显示页面 */
export const activePage = createRootMemo(
  () => store.pageList[store.activePageIndex] ?? [],
);

/** 当前显示的第一张图片的 index */
export const activeImgIndex = createRootMemo(
  () => activePage().find((i) => i !== -1) ?? 0,
);

/** 找到指定页面所处的图片流 */
const findFillIndex = (pageIndex: number, fillEffect: FillEffect) => {
  let nowFillIndex = pageIndex;
  while (!Reflect.has(fillEffect, nowFillIndex)) nowFillIndex -= 1;
  return nowFillIndex;
};

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
    .toSorted((a, b) => a - b);
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

if (isDevMode) exposeToGlobal({ mangaImgList: imgList });
