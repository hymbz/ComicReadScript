import { clamp, singleThreaded } from 'helper';
import { createEffectOn, createRootMemo } from 'helper/solidJs';
import { t } from 'helper/i18n';
import { log } from 'helper/logger';
import { createSignal } from 'solid-js';

import { store, setState, _setState } from '../store';

import { preloadNum } from './memo/common';
import { updateImgSize } from './imageSize';
import { renderImgList } from './renderPage';

const [loadLock, setLoadLock] = createSignal(false);

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
const handleImgLoaded = (i: number, e: HTMLImageElement) => () => {
  setState((state) => {
    const img = state.imgList[i];
    if (!img) return;
    if (img.width !== e.naturalWidth || img.height !== e.naturalHeight)
      updateImgSize(state, i, e.naturalWidth, e.naturalHeight);
    img.loadType = 'loaded';
    // 为了避免加载好的图片被垃圾回收掉，在这里挂下引用
    img.dom = e;
    state.prop.Loading?.(state.imgList, img);
  });
  setLoadLock(false);
  loadingImgMap.delete(i);
  // 火狐浏览器在图片进入视口前，即使已经加载完了也不会对图片进行解码
  // 所以需要手动调用 decode 提前解码，防止在翻页时闪烁
  e.decode();
};

/** 图片加载出错的回调 */
const handleImgError = (i: number, e: HTMLImageElement) => () => {
  loadingImgMap.delete(i);
  setState((state) => {
    const img = state.imgList[i];
    if (!img) return;
    img.loadType = 'error';
    img.type = undefined;
    if (e) log.error(t('alert.img_load_failed'), e);
    state.prop.Loading?.(state.imgList, img);
  });
  setLoadLock(false);
};

/** 当前要加载的图片 */
const loadImgList = new Set<number>();

const loadImg = (index: number) => {
  if (!needLoadImgList().has(index) || !store.imgList[index].src) return;

  if (!loadingImgMap.has(index)) {
    const img = new Image();
    img.onload = handleImgLoaded(index, img);
    img.onerror = handleImgError(index, img);
    img.src = store.imgList[index].src;
    loadingImgMap.set(index, img);
    _setState('imgList', index, 'loadType', 'loading');
  }
  loadImgList.add(index);
};

/**
 * 以当前显示页为基准，预加载附近指定页数的图片，并取消其他预加载的图片
 * @param target 加载目标页
 * @param loadNum 加载图片数量
 * @returns 返回是否成功加载了指定数量的图片
 */
const loadPageImg = (target = 0, loadNum = 2) => {
  const load = (i: number) => {
    for (const index of store.pageList[i]) loadImg(index);
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
    for (let index = start; index <= end; index++) if (load(index)) return true;
  } else {
    for (let index = start; index >= end; index--) if (load(index)) return true;
  }

  return false;
};

const updateImgLoadType = singleThreaded(() => {
  if (needLoadImgList().size === 0 || loadLock()) return;

  loadImgList.clear();
  setLoadLock(false);

  if (store.imgList.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ =
      // 优先加载当前显示的图片
      loadPageImg() ||
      // 再加载后面几页
      loadPageImg(preloadNum().back) ||
      // 再加载前面几页
      loadPageImg(-preloadNum().front) ||
      // 根据图片总数和设置决定是否要继续加载其余图片
      (!store.option.alwaysLoadAllImg && store.imgList.length > 60) ||
      // 加载当前页后面的图片
      loadPageImg(Number.POSITIVE_INFINITY, 5) ||
      // 加载当前页前面的图片
      loadPageImg(Number.NEGATIVE_INFINITY, 5);
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
