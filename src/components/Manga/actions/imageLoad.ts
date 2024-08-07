import { clamp, debounce, singleThreaded } from 'helper';
import { createEffectOn, createRootMemo } from 'helper/solidJs';
import { t } from 'helper/i18n';
import { log } from 'helper/logger';

import { store, setState, _setState, refs } from '../store';

import { preloadNum } from './memo/common';
import { updateImgSize } from './imageSize';
import { renderImgList, showImgList } from './renderPage';

/** 图片加载完毕的回调 */
export const handleImgLoaded = (i: number, e: HTMLImageElement) => {
  setState((state) => {
    const img = state.imgList[i];
    // 与图片全载一起使用时会出现 src 不一样的情况，需要跳过
    if (!img || e.src !== img.src) return;
    if (img.width !== e.naturalWidth || img.height !== e.naturalHeight)
      updateImgSize(state, i, e.naturalWidth, e.naturalHeight);
    img.loadType = 'loaded';
    state.prop.Loading?.(state.imgList, img);
  });
  updateImgLoadType();
  e.decode().catch(() => {});
};

/** 图片加载出错的次数 */
const imgErrorNum = new Map<string, number>();

/** 图片加载出错的回调 */
export const handleImgError = (i: number, e: HTMLImageElement) => {
  imgErrorNum.set(e.src, (imgErrorNum.get(e.src) ?? 0) + 1);
  setState((state) => {
    const img = state.imgList[i];
    if (!img) return;
    img.loadType = 'error';
    img.type = undefined;
    log.error(i, t('alert.img_load_failed'), e);
    state.prop.Loading?.(state.imgList, img);
  });
  updateImgLoadType();
};

/** 需要加载的图片 */
const needLoadImgList = createRootMemo(() => {
  const list = new Set<number>();
  for (const [index, img] of store.imgList.entries())
    if (img.loadType !== 'loaded' && img.src) list.add(index);
  return list;
});

/** 当前需要加载的图片 */
const loadImgList = new Set<number>();

/** 加载指定图片。返回是否已加载完成 */
const loadImg = (index: number) => {
  if (index === -1 || !needLoadImgList().has(index)) return true;
  const img = store.imgList[index];
  if (img.loadType === 'error') {
    if (!renderImgList().has(index) || (imgErrorNum.get(img.src) ?? 0) >= 3)
      return true;
    _setState('imgList', index, 'loadType', 'wait');
    return false;
  }
  loadImgList.add(index);
  return false;
};

/** 获取指定页数下的头/尾图片 */
const getPageImg = (pageNum: number, imgType: 'start' | 'end') => {
  const page = store.pageList[pageNum].filter((i) => i !== -1);
  if (page.length === 1) return page[0];
  return imgType === 'start' ? Math.min(...page) : Math.max(...page);
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

/** 加载期间尽快获取图片尺寸 */
export const checkImgSize = (index: number) => {
  const imgDom = refs.mangaFlow.querySelector<HTMLImageElement>(
    `#_${index} img`,
  )!;
  const timeoutId = setInterval(() => {
    const img = store.imgList[index];
    if (!img || img.loadType !== 'loading') return clearInterval(timeoutId);

    if (imgDom.naturalWidth && imgDom.naturalHeight) {
      setState((state) =>
        updateImgSize(state, index, imgDom.naturalWidth, imgDom.naturalHeight),
      );
      return clearInterval(timeoutId);
    }
  }, 200);
};

const updateImgLoadType = singleThreaded(() => {
  if (needLoadImgList().size === 0) return;

  loadImgList.clear();

  if (store.imgList.length > 0) {
    // 优先加载当前显示的图片
    loadRangeImg() ||
      // 再加载后面几页
      loadRangeImg(preloadNum().back) ||
      // 再加载前面几页
      loadRangeImg(-preloadNum().front) ||
      // 根据设置决定是否要继续加载其余图片
      !store.option.alwaysLoadAllImg ||
      // 加载当前页后面的图片
      loadRangeImg(Number.POSITIVE_INFINITY, 5) ||
      // 加载当前页前面的图片
      loadRangeImg(Number.NEGATIVE_INFINITY, 5);
  }

  setState((state) => {
    for (const index of needLoadImgList()) {
      const img = state.imgList[index];
      if (loadImgList.has(index)) {
        if (img.loadType !== 'loading') {
          img.loadType = 'loading';
          if (img.width === undefined) setTimeout(checkImgSize, 0, index);
        }
      } else if (img.loadType === 'loading') img.loadType = 'wait';
    }
  });
});

createEffectOn(
  [
    preloadNum,
    () => [...renderImgList()].map((i) => store.imgList[i]),
    () => store.option.alwaysLoadAllImg,
  ],
  updateImgLoadType,
);

createEffectOn(
  showImgList,
  debounce((showImgList) => {
    // 如果当前显示页面有出错的图片，就重新加载一次
    for (const i of showImgList) {
      if (store.imgList[i]?.loadType !== 'error') continue;
      _setState('imgList', i, 'loadType', 'wait');
      updateImgLoadType();
    }
  }, 500),
  { defer: true },
);
