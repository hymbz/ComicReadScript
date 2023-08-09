import type { FillEffect } from './hooks/useStore/ImageState';

// 1. 因为不同汉化组处理情况不同不可能全部适配，所以只能是尽量适配*出现频率更多*的情况
// 2. 因为大部分用户都不会在意正确页序，所以应该尽量少加填充页

/** 记录自动修改过页面填充的图片流 */
export const autoCloseFill = new Set<number>();

/** 找到指定页面所处的图片流 */
export const findFillIndex = (pageIndex: number, fillEffect: FillEffect) => {
  let nowFillIndex = pageIndex;
  while (!Reflect.has(fillEffect, nowFillIndex)) nowFillIndex -= 1;
  return nowFillIndex;
};

/** 判断图片是否是跨页图 */
export const isWideImg = (img: ComicImg) => {
  switch (img.type) {
    case 'long':
    case 'wide':
      return true;
    default:
      return false;
  }
};

/** 根据图片比例和填充页设置对漫画图片进行排列 */
export const handleComicData = (
  imgList: ComicImg[],
  fillEffect: FillEffect,
): PageList => {
  const pageList: PageList = [];
  let imgCache: number | null = null;

  for (let i = 0; i < imgList.length; i += 1) {
    const img = imgList[i];

    if (fillEffect[i - 1]) {
      if (imgCache !== null) pageList.push([imgCache]);
      imgCache = -1;
    }

    if (!isWideImg(img)) {
      if (imgCache !== null) {
        pageList.push([imgCache, i]);
        imgCache = null;
      } else {
        imgCache = i;
      }
      if (Reflect.has(fillEffect, i)) Reflect.deleteProperty(fillEffect, i);
    } else {
      if (imgCache !== null) {
        const nowFillIndex = findFillIndex(i, fillEffect);

        // 在除结尾外的位置出现了跨页图的话，那张跨页图大概率是页序的「正确答案」
        // 如果这张跨页导致了缺页就说明在这之前的页面填充有误，应该调整之前的填充设置
        // 排除结尾是防止被结尾汉化组图误导
        // 自动调整毕竟有可能误判，所以每个跨页都应该只调整一次，不能重复修改
        if (!autoCloseFill.has(i) && i < imgList.length - 2) {
          autoCloseFill.add(i);
          fillEffect[nowFillIndex] = !fillEffect[nowFillIndex];
          return handleComicData(imgList, fillEffect);
        }

        if (imgCache !== -1) pageList.push([imgCache, -1]);
        imgCache = null;
      }

      if (fillEffect[i] === undefined && img.loadType !== 'loading')
        fillEffect[i] = false;

      pageList.push([i]);
    }
  }

  if (imgCache !== null && imgCache !== -1) {
    pageList.push([imgCache, -1]);
    imgCache = null;
  }

  return pageList;
};
