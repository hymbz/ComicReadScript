import { clamp, createEffectOn, singleThreaded } from 'helper';

import { setState, store } from '../../store';
import { getImg, getImgEle } from '../helper';
import { updateImgSize } from '../imageSize';
import { imgList, preloadNum } from '../memo';
import { renderImgList } from '../renderPage';
import { loadState, setLoadingUrlSet } from './state';

/** 获取指定页数下的头/尾图片 */
const getPageImg = (pageNum: number, imgType: 'start' | 'end') => {
  const page = store.pageList[pageNum].filter((i) => i !== -1);
  if (page.length === 1) return page[0];
  return imgType === 'start' ? Math.min(...page) : Math.max(...page);
};

/** 规划当前要加载的图片 */
const planLoadBatch = () => {
  /** 当前批次中需要改成 loading 的图片 */
  const loadImgList = new Set<string>();
  /** 当前加载范围内还没有 src 的图片索引 */
  const waitUrlImgs = new Set<number>();

  /** 加载指定图片。返回是否已加载完成 */
  const loadImg = (index: number) => {
    const img = getImg(index);
    if (!img.src) {
      waitUrlImgs.add(index);
      return true;
    }
    if (img.loadType === 'loaded' || img.loadType === 'error') return true;
    loadImgList.add(img.src);
    return false;
  };

  /**
   * 以当前显示页为基准，预加载附近指定页数的图片，并取消其他预加载的图片
   * @param target 加载目标页
   * @param loadNum 加载图片数量
   * @returns 返回指定范围内是否还有未加载的图片
   */
  const loadRangeImg = (target = 0, loadNum = 2) => {
    let start = getPageImg(store.showRange[0], 'start');
    let end = getPageImg(store.showRange[1], 'end');

    if (target !== 0) {
      if (target < 0) {
        end = start + target;
        start -= 1;
      } else {
        start = end + 1;
        end += target;
      }

      start = clamp(0, start, store.imgList.length - 1);
      end = clamp(0, end, store.imgList.length - 1);
    }

    /** 是否还有未加载的图片 */
    let hasUnloadedImg = false;

    let index = start;
    const condition = start <= end ? () => index <= end : () => index >= end;
    const step = start <= end ? 1 : -1;

    while (condition()) {
      if (!loadImg(index)) hasUnloadedImg = true;
      if (loadImgList.size >= loadNum) return index !== end || hasUnloadedImg;
      index += step;
    }

    return hasUnloadedImg;
  };

  if (store.imgList.length > 0) {
    // oxlint-disable-next-line no-unused-expressions
    loadRangeImg() || // 优先加载当前显示的图片
      loadRangeImg(preloadNum().back) || // 再加载后面几页
      loadRangeImg(-preloadNum().front) || // 再加载前面几页
      !store.option.alwaysLoadAllImg || // 根据设置决定是否要继续加载其余图片
      loadRangeImg(Infinity, 5) || // 加载当前页后面的图片
      loadRangeImg(Number.NEGATIVE_INFINITY, 5); // 加载当前页前面的图片
  }

  return { loadImgList, waitUrlImgs };
};

/** 根据当前显示范围重新计算并修改图片加载状态 */
export const updateImgLoadType = singleThreaded(() => {
  if (
    store.showRange[0] < 0 ||
    (loadState.unloadedUrlSet.size === 0 && loadState.waitUrlImgNum === 0)
  )
    return;

  const { loadImgList, waitUrlImgs } = planLoadBatch();

  store.prop.onWaitUrlImgs?.(waitUrlImgs, imgList());

  setState((state) => {
    for (const url of new Set([...loadState.loadingUrlSet, ...loadImgList])) {
      const img = state.imgMap[url];
      if (!img) continue;

      if (loadImgList.has(url)) {
        if (img.loadType !== 'loading') {
          img.loadType = 'loading';
          if (!store.option.imgRecognition.enabled && img.width === undefined)
            setTimeout(checkImgSize, 0, img.src);
        }
      } else if (img.loadType === 'loading') img.loadType = 'wait';
    }
  });

  setLoadingUrlSet(loadImgList);
});

createEffectOn(
  [
    preloadNum,
    renderImgList,
    () => store.imgMap,
    () => store.option.alwaysLoadAllImg,
  ],
  updateImgLoadType,
);

/** 加载期间尽快获取图片尺寸 */
export const checkImgSize = (url: string) => {
  const imgDom = getImgEle(url);
  if (!imgDom) return;

  const timeoutId = setInterval(() => {
    if (!imgDom?.isConnected || store.option.imgRecognition.enabled)
      return clearInterval(timeoutId);

    const img = store.imgMap[url];
    if (!img || img.loadType !== 'loading') return clearInterval(timeoutId);

    if (imgDom.naturalWidth && imgDom.naturalHeight) {
      updateImgSize(url, imgDom.naturalWidth, imgDom.naturalHeight);
      return clearInterval(timeoutId);
    }
  }, 200);
};
