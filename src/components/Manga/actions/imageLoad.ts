import { request } from 'request';
import {
  clamp,
  debounce,
  singleThreaded,
  createEffectOn,
  createRootMemo,
  t,
  log,
} from 'helper';

import { store, setState, _setState } from '../store';

import { imgList, preloadNum } from './memo/common';
import { updateImgSize } from './imageSize';
import { renderImgList, showImgList } from './renderPage';
import { handleImgRecognition } from './imageRecognition';
import { getImg, getImgEle, getImgIndex } from './helper';

/** 图片加载完毕的回调 */
export const handleImgLoaded = (url: string, e?: HTMLImageElement) => {
  // 内联图片元素被创建后立刻就会触发 load 事件，如果在调用这个函数前 url 发生改变
  // 就会导致这里获得的是上个 url 图片的尺寸
  if (e && !e.isConnected) return;

  const img = store.imgMap[url];
  if (img.loadType !== 'loaded') {
    _setState('imgMap', url, 'loadType', 'loaded');
    updateImgLoadType();
    store.prop.Loading?.(imgList(), store.imgMap[url]);
  }
  if (!e) return;

  updateImgSize(url, e.naturalWidth, e.naturalHeight);

  if (store.option.imgRecognition.enabled && e.src === img.blobUrl)
    setTimeout(handleImgRecognition, 0, e, url);
};

/** 图片加载出错的次数 */
const imgErrorNum = new Map<string, number>();

/** 图片加载出错的回调 */
export const handleImgError = (url: string, e?: HTMLImageElement) => {
  if (e && !e.isConnected) return;
  imgErrorNum.set(url, (imgErrorNum.get(url) ?? 0) + 1);
  setState((state) => {
    const img = state.imgMap[url];
    if (!img) return;
    const imgIndex = getImgIndex(url);
    log.error(imgIndex, t('alert.img_load_failed'), e);
    img.loadType = 'error';
    img.type = undefined;
    if (
      imgIndex.some((i) => renderImgList().has(i)) &&
      (imgErrorNum.get(img.src) ?? 0) < 2
    )
      img.loadType = 'wait';
  });
  store.prop.Loading?.(imgList(), store.imgMap[url]);
  updateImgLoadType();
};

/** 需要加载的图片 */
const needLoadImgList = createRootMemo(() => {
  const list = new Set<number>();
  for (const [index, img] of imgList().entries())
    if (img.loadType !== 'loaded' && img.src) list.add(index);
  return list;
});

/** 当前需要加载的图片 */
const loadImgList = new Set<number>();

/** 加载指定图片。返回是否已加载完成 */
const loadImg = (index: number) => {
  if (index === -1 || !needLoadImgList().has(index)) return true;
  const img = getImg(index);
  if (img.loadType === 'error') return true;
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

export const updateImgLoadType = singleThreaded(() => {
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
      const img = getImg(index, state);
      if (loadImgList.has(index)) {
        if (img.loadType !== 'loading') {
          img.loadType = 'loading';
          if (!store.option.imgRecognition.enabled && img.width === undefined)
            setTimeout(checkImgSize, 0, img.src);
        }
      } else if (img.loadType === 'loading') img.loadType = 'wait';
    }
  });
});

createEffectOn(
  [
    preloadNum,
    createRootMemo(() => [...renderImgList()].map((i) => store.imgList[i])),
    () => store.option.alwaysLoadAllImg,
  ],
  updateImgLoadType,
);

createEffectOn(
  showImgList,
  debounce((_showImgList) => {
    // 如果当前显示页面有出错的图片，就重新加载一次
    for (const img of [..._showImgList].map((i) => getImg(i))) {
      if (img?.loadType !== 'error') continue;
      _setState('imgMap', img.src, 'loadType', 'wait');
      updateImgLoadType();
    }
  }, 500),
  { defer: true },
);

/** 加载中的图片 */
export const loadingImgList = createRootMemo(() => {
  const list = new Set<string>();
  for (const [url, img] of Object.entries(store.imgMap))
    if (img.loadType === 'loading') list.add(url);
  return list;
});

const abortMap = new Map<string, AbortController>();

const timeoutAbort = (url: string) => {
  if (!abortMap.has(url)) return;
  abortMap.get(url)!.abort();
  abortMap.delete(url);
  handleImgError(url);
};

createEffectOn(loadingImgList, async (downImgList, prevImgList) => {
  if (!store.option.imgRecognition.enabled) return;

  if (prevImgList) {
    // 中断取消下载的图片
    for (const url of prevImgList) {
      if (downImgList.has(url) || !abortMap.has(url)) continue;
      abortMap.get(url)?.abort();
      abortMap.delete(url);
      log(`中断下载 ${url}`);
    }
  }

  for (const url of downImgList.values()) {
    if (abortMap.has(url) || store.imgMap[url].blobUrl) continue;

    const controller = new AbortController();
    const handleTimeout = debounce(() => timeoutAbort(url), 1000 * 3);
    controller.signal.addEventListener('abort', handleTimeout.clear);
    abortMap.set(url, controller);
    handleTimeout();
    request<Blob>(url, {
      responseType: 'blob',
      retryFetch: true,
      signal: controller.signal,
      timeout: undefined,
      noTip: true,
      onerror: () => handleImgError(url),
      onprogress({ loaded, total }) {
        _setState('imgMap', url, 'progress', (loaded / total) * 100);
        // 一段时间内都没进度后超时中断
        handleTimeout();
      },
      onload({ response }) {
        abortMap.delete(url);
        _setState('imgMap', url, {
          blobUrl: URL.createObjectURL(response),
          progress: undefined,
        });
        handleImgLoaded(url);
      },
    });
  }
});
