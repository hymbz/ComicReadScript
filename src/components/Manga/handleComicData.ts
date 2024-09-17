import { log } from 'helper';

import { store } from './store';
import type { FillEffect } from './store/image';

// 1. 因为不同汉化组处理情况不同不可能全部适配，所以只能是尽量适配*出现频率更多*的情况
// 2. 因为大部分用户都不会在意正确页序，所以应该尽量少加填充页

/** 记录自动修改过页面填充的图片流 */
export const autoCloseFill = new Set<number>();

/** 判断图片是否是跨页图 */
const isWideImg = (img: ComicImg) => {
  switch (img.type ?? store.defaultImgType) {
    case 'long':
    case 'wide':
      return true;
    default:
      return false;
  }
};

/** 根据填充页设置双页排列单页图片 */
const arrangeImg = (pageList: number[], fill: boolean): PageList => {
  if (pageList.length === 0) return [];
  const newPageList: PageList = [];
  let imgCache: number[] = fill ? [-1] : [];
  for (const i of pageList) {
    imgCache.push(i);
    if (imgCache.length === 2) {
      newPageList.push(imgCache as [number, number]);
      imgCache = [];
    }
  }
  if (imgCache.length === 1 && imgCache[0] !== -1) {
    imgCache.push(-1);
    newPageList.push(imgCache as [number]);
  }

  return newPageList;
};

/** 计算指定图片流的左右页正确率 */
const computeAccuracy = (imgList: ComicImg[], pageList: PageList) => {
  let accuracy = 0;
  for (const [a, b] of pageList) {
    if (imgList[a]?.blankMargin?.left ?? 0 > 10) accuracy += 1;
    if (b === undefined) break;
    if (imgList[b]?.blankMargin?.right ?? 0 > 10) accuracy += 1;
  }
  return accuracy;
};

/** 自动切换填充页设置到左右页正确率更高的情况 */
const arrangePage = (
  pageList: number[],
  imgList: ComicImg[],
  fillEffect: FillEffect,
  fillIndex: number,
  switchFill?: boolean,
): PageList => {
  const fill = Boolean(fillEffect[fillIndex]);
  const newPageList = arrangeImg(pageList, fill);
  if (!switchFill || typeof fillEffect[fillIndex] === 'number')
    return newPageList;

  const anotherPageList = arrangeImg(pageList, !fill);
  const anotherAccuracy = computeAccuracy(imgList, anotherPageList);
  if (anotherAccuracy === 0) return newPageList;
  const nowAccuracy = computeAccuracy(imgList, newPageList);
  if (anotherAccuracy <= nowAccuracy) return newPageList;

  log(`${fillIndex} 自动切换页面填充`);
  fillEffect[fillIndex] = !fill;
  return anotherPageList;
};

/** 根据图片比例和填充页设置对漫画图片进行排列 */
export const handleComicData = (
  imgList: ComicImg[],
  fillEffect: FillEffect,
  switchFill?: boolean,
): PageList => {
  let pageList: PageList = [];
  let cacheList: number[] = [];

  let nowFillIndex = -1;

  for (let i = 0; i < imgList.length; i += 1) {
    const img = imgList[i];

    if (!isWideImg(img)) {
      cacheList.push(i);
      if (Reflect.has(fillEffect, i)) Reflect.deleteProperty(fillEffect, i);
      continue;
    }

    // 在除结尾（可能是汉化组图）外的位置出现了跨页图的话，那张跨页图大概率是页序的「正确答案」
    // 如果这张跨页导致了上面一页缺页，就说明在这之前的填充有误，应该据此调整之前的填充
    // 不过自动调整毕竟有可能误判，所以每个跨页都应该只调整一次，不能重复修改
    if (
      !autoCloseFill.has(i) &&
      i < imgList.length - 2 &&
      (cacheList.length + (fillEffect[nowFillIndex] ? 1 : 0)) % 2 === 1
    ) {
      autoCloseFill.add(i);
      fillEffect[nowFillIndex] = !fillEffect[nowFillIndex];
      return handleComicData(imgList, fillEffect);
    }

    pageList = [
      ...pageList,
      ...arrangePage(cacheList, imgList, fillEffect, nowFillIndex, switchFill),
      [i],
    ];
    cacheList = [];

    if (fillEffect[i] === undefined) fillEffect[i] = false;
    nowFillIndex = i;
  }

  if (cacheList.length > 0)
    pageList = [
      ...pageList,
      ...arrangePage(cacheList, imgList, fillEffect, nowFillIndex, switchFill),
    ];

  return pageList;
};
