import {
  clamp,
  createEffectOn,
  createRootMemo,
  debounce,
  log,
  singleThreaded,
  t,
} from 'helper';
import { request } from 'request';

import { downloadImgHeaders as headers } from '../helper';
import { setState, store } from '../store';
import { getImg, getImgEle, getImgIndexs } from './helper';
import { handleImgRecognition } from './imageRecognition';
import { updateImgSize } from './imageSize';
import { imgList, preloadNum } from './memo';
import { renderImgList, showImgList } from './renderPage';
import { translationAll } from './translation';

/** 图片上次加载出错的时间 */
const imgErrorMap = new Map<string, number>();

/** 重新加载错误图片 */
export const reloadImg = (url: string) => {
  if (store.imgMap[url]?.loadType !== 'error') return;
  setState('imgMap', url, 'loadType', 'wait');
  updateImgLoadType();
};

/** 图片加载失败后定时重新加载 */
const handleTimeReload = (url: string) => {
  const count = imgErrorMap.get(url) || 0;
  // 最多重试 8 次
  if (count > 8) return;
  imgErrorMap.set(url, count + 1);
  const time = (2 ** count + Math.random() * 2) * 1000;
  setTimeout(reloadImg, time, url);
};

/** 图片加载完毕的回调 */
export const handleImgLoaded = (url: string, e?: HTMLImageElement) => {
  // 内联图片元素被创建后立刻就会触发 load 事件，如果在调用这个函数前 url 发生改变
  // 就会导致这里获得的是上个 url 图片的尺寸
  if (e && !e.isConnected) return;
  imgErrorMap.delete(url);

  const img = store.imgMap[url];
  if (img.translationType === 'show') return;
  if (img.loadType !== 'loaded') {
    setState('imgMap', url, 'loadType', 'loaded');
    updateImgLoadType();
    store.prop.onLoading?.(imgList(), store.imgMap[url]);
  }
  if (!e) return;

  updateImgSize(url, e.naturalWidth, e.naturalHeight);

  if (store.option.imgRecognition.enabled && e.src === img.blobUrl)
    setTimeout(handleImgRecognition, 0, url, e);

  translationAll();
};

/** 图片加载出错的回调 */
export const handleImgError = (url: string, e?: HTMLImageElement) => {
  if (e && !e.isConnected) return;
  setState((state) => {
    const img = state.imgMap[url];
    if (!img) return;
    const imgIndexs = getImgIndexs(url);
    log.error(imgIndexs, t('alert.img_load_failed'), e);
    img.loadType = 'error';
    img.type = undefined;
  });
  handleTimeReload(url);
  store.prop.onLoading?.(imgList(), store.imgMap[url]);
  store.prop.onImgError?.(url);
  updateImgLoadType();
};

/** 需要加载的图片 */
const needLoadImgList = createRootMemo(() => {
  const list = new Set<string>();
  for (const img of imgList())
    if (img.loadType !== 'loaded' && img.src) list.add(img.src);
  return list;
});

/** 当前加载的图片 */
const loadImgList = new Set<string>();

/** 加载指定图片。返回是否已加载完成 */
const loadImg = (url: string) => {
  const img = store.imgMap[url];
  if (!needLoadImgList().has(img.src)) return true;
  if (img.loadType === 'error') return true;
  loadImgList.add(url);
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
    if (!loadImg(getImg(index).src)) hasUnloadedImg = true;
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
  if (store.showRange[0] < 0 || needLoadImgList().size === 0) return;

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
    for (const url of needLoadImgList()) {
      const img = state.imgMap[url];
      if (loadImgList.has(url)) {
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

// 如果当前显示页面有出错的图片，就重新加载一次
createEffectOn(
  showImgList,
  debounce((list) => {
    if (imgErrorMap.size === 0) return;
    for (const i of list) reloadImg(getImg(i).src);
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

createEffectOn(loadingImgList, (downImgList, prevImgList) => {
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
      headers,
      onerror: () => handleImgError(url),
      onprogress({ loaded, total }) {
        setState('imgMap', url, 'progress', (loaded / total) * 100);
        // 一段时间内都没进度后超时中断
        handleTimeout();
      },
      onload({ response }) {
        abortMap.delete(url);
        setState('imgMap', url, {
          blobUrl: URL.createObjectURL(response),
          progress: undefined,
        });
        handleImgLoaded(url);
      },
    });
  }
});
