import { clamp, singleThreaded } from 'helper';
import { createEffectOn, createRootMemo } from 'helper/solidJs';
import { t } from 'helper/i18n';
import { log } from 'helper/logger';
import { createSignal } from 'solid-js';

import { store, setState, _setState } from '../store';

import { preloadNum } from './memo/common';
import { updateImgSize } from './imageSize';
import { renderImgList } from './renderPage';

const [loadLock, setLoadLock] = createSignal(false, { equals: false });

/** 用于存储正在加载的图片元素 */
const loadingImgMap = new Map<number, HTMLImageElement>();

/** 需要加载的图片 */
const needLoadImgList = createRootMemo(() => {
  const list = new Set<number>();
  for (const [index, img] of store.imgList.entries())
    if (img.loadType !== 'loaded') list.add(index);
  return list;
});

/** 图片加载完毕的回调 */
export const handleImgLoaded = (i: number, e: HTMLImageElement) => () => {
  setState((state) => {
    const img = state.imgList[i];
    if (!img) return;
    if (img.width !== e.naturalWidth || img.height !== e.naturalHeight)
      updateImgSize(state, i, e.naturalWidth, e.naturalHeight);
    img.loadType = 'loaded';
    state.prop.Loading?.(state.imgList, img);
  });
  setLoadLock(false);
  loadingImgMap.delete(i);
  // 火狐浏览器在图片进入视口前，即使已经加载完了也不会对图片进行解码
  // 所以需要手动调用 decode 提前解码，防止在翻页时闪烁
  e.decode();
};

/** 图片加载出错的回调 */
export const handleImgError = (i: number, e: HTMLImageElement) => () => {
  loadingImgMap.delete(i);
  setState((state) => {
    const img = state.imgList[i];
    if (!img) return;
    img.loadType = 'error';
    img.type = undefined;
    if (e) log.error(i, t('alert.img_load_failed'), e);
    state.prop.Loading?.(state.imgList, img);
  });
  setLoadLock(false);
};

/** 当前要加载的图片 */
const loadImgList = new Set<number>();

/** 加载指定图片。返回是否加载成功 */
const loadImg = (index: number) => {
  if (index === -1) return true;
  const img = store.imgList[index];
  if (img.loadType === 'loaded') return true;
  if (!img.src) return false;
  if (img.loadType === 'error' && !renderImgList().has(index)) return true;

  if (!loadingImgMap.has(index)) {
    const imgEle = new Image();
    imgEle.onload = handleImgLoaded(index, imgEle);
    imgEle.onerror = handleImgError(index, imgEle);
    imgEle.src = img.src;
    loadingImgMap.set(index, imgEle);
    _setState('imgList', index, 'loadType', 'loading');
  }
  loadImgList.add(index);
  return true;
};

/**
 * 以当前显示页为基准，预加载附近指定页数的图片，并取消其他预加载的图片
 * @param target 加载目标页
 * @param loadNum 加载图片数量
 * @returns 返回指定范围内是否还有未加载的图片
 */
const loadRangeImg = (target = 0, loadNum = 2) => {
  /** 是否还有未加载的图片 */
  let hasUnloadedImg = false;

  const loadPage = (i: number) => {
    for (const index of store.pageList[i])
      if (!loadImg(index)) hasUnloadedImg = true;
    if (loadImgList.size >= loadNum) {
      setLoadLock(true);
      return true;
    }
  };

  let [start, end] = store.showRange;

  if (target !== 0) {
    if (target < 0) {
      start = store.showRange[0] - 1;
      end = store.showRange[0] + target;
    } else {
      start = store.showRange[1] + 1;
      end = store.showRange[1] + target;
    }

    start = clamp(0, start, store.pageList.length - 1);
    end = clamp(0, end, store.pageList.length - 1);
  }

  if (start <= end) {
    for (let index = start; index <= end; index++)
      if (loadPage(index)) return index !== end || hasUnloadedImg;
  } else {
    for (let index = start; index >= end; index--)
      if (loadPage(index)) return index !== end || hasUnloadedImg;
  }

  return hasUnloadedImg;
};

const updateImgLoadType = singleThreaded(() => {
  if (needLoadImgList().size === 0 || loadLock()) return;

  loadImgList.clear();

  if (store.imgList.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ =
      // 优先加载当前显示的图片
      loadRangeImg() ||
      // 再加载后面几页
      loadRangeImg(preloadNum().back) ||
      // 再加载前面几页
      loadRangeImg(-preloadNum().front) ||
      // 根据图片总数和设置决定是否要继续加载其余图片
      (!store.option.alwaysLoadAllImg && store.imgList.length > 60) ||
      // 加载当前页后面的图片
      loadRangeImg(Number.POSITIVE_INFINITY, 5) ||
      // 加载当前页前面的图片
      loadRangeImg(Number.NEGATIVE_INFINITY, 5);
  }

  // 取消其他预加载的图片
  for (const index of loadingImgMap.keys())
    if (!loadImgList.has(index)) loadingImgMap.delete(index);
});

createEffectOn(
  [
    loadLock,
    () => [...renderImgList()].map((i) => store.imgList[i]),
    () => store.option.alwaysLoadAllImg,
  ],
  updateImgLoadType,
);
