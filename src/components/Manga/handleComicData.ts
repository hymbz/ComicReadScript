import type { FillEffect } from './hooks/useStore/ImageState';

// 1. 因为不同汉化组处理情况不同不可能全部适配，所以只能是尽量适配*出现频率更多*的情况
// 2. 因为大部分用户都不会在意正确页序，所以应该尽量少加填充页

/**
 * 根据图片比例和填充页设置对漫画图片进行排列
 */
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

    if (img.type !== 'long' && img.type !== 'wide') {
      if (imgCache !== null) {
        pageList.push([imgCache, i]);
        imgCache = null;
      } else {
        imgCache = i;
      }
    } else {
      if (imgCache !== null) {
        // 默认会开启首页填充，但如果在开头和中间出现了跨页，就应该关掉
        if (fillEffect['-1'] && i < imgList.length - 2) {
          fillEffect['-1'] = false;
          return handleComicData(imgList, fillEffect);
        }

        if (imgCache !== -1) {
          // 跨页在倒数两张的话大概率时汉化组加的图，应该将填充页放在后面
          if (i >= imgList.length - 2) pageList.push([imgCache, -1]);
          // 正常进度中出现的跨页应该代表页序的「正确答案」，导致了缺页的话就说明在这之前缺少填充页
          else pageList.push([-1, imgCache]);
        }
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
