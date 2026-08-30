import { createEffectOn, debounce, log, t } from 'helper';
import { downloadImgHeaders as headers, request } from 'request';

import { setState, store } from '../../store';
import { getImg, getImgIndexs } from '../helper';
import { handleImgRecognition, isInRenderRange } from '../imageRecognition';
import { updateImgSize } from '../imageSize';
import { imgList } from '../memo';
import { showImgList } from '../renderPage';
import { translationAll } from '../translation';
import { updateImgLoadType } from './scheduler';
import { loadState } from './state';

/** 重新加载错误图片 */
export const reloadImg = (url: string) => {
  if (store.imgMap[url]?.loadType !== 'error') return;
  setState('imgMap', url, 'loadType', 'wait');
  void updateImgLoadType();
};

/** 图片加载失败后定时重新加载 */
const handleTimeReload = (url: string) => {
  const count = loadState.imgErrorMap.get(url) || 0;
  // 最多重试 8 次
  if (count > 8) return;
  loadState.imgErrorMap.set(url, count + 1);
  const time = (2 ** count + Math.random() * 2) * 1000;
  setTimeout(reloadImg, time, url);
};

/** 图片加载完毕的回调 */
export const handleImgLoaded = (url: string, e?: HTMLImageElement) => {
  loadState.imgErrorMap.delete(url);

  const img = store.imgMap[url];
  if (img.translationType === 'show') return;
  if (img.loadType !== 'loaded') {
    setState('imgMap', url, 'loadType', 'loaded');
    loadState.unloadedUrlSet.delete(url);
    loadState.loadingUrlSet.delete(url);
    void updateImgLoadType();
    store.prop.onLoading?.(imgList(), store.imgMap[url]);
  }
  if (!e) return;

  updateImgSize(url, e.naturalWidth, e.naturalHeight);

  if (
    store.option.imgRecognition.enabled &&
    e.src === img.blobUrl &&
    isInRenderRange(url)
  )
    setTimeout(handleImgRecognition, 0, url, e);

  if (store.option.translation.enabled) void translationAll();
};

/** 图片加载出错的回调 */
export const handleImgError = (url: string, e?: HTMLImageElement) => {
  if (e && !e.isConnected) return;
  setState((state) => {
    const img = state.imgMap[url];
    if (!img) return;
    log.error(getImgIndexs(url), t('alert.img_load_failed'), e);
    img.loadType = 'error';
    img.type = undefined;
  });
  loadState.loadingUrlSet.delete(url);
  handleTimeReload(url);
  store.prop.onLoading?.(imgList(), store.imgMap[url]);
  store.prop.onImgError?.(url);
  void updateImgLoadType();
};

// 如果当前显示页面有出错的图片，就重新加载一次
createEffectOn(
  showImgList,
  debounce((list) => {
    if (loadState.imgErrorMap.size === 0) return;
    for (const i of list) reloadImg(getImg(i).src);
  }, 500),
  { defer: true },
);

const timeoutAbort = (url: string) => {
  if (!loadState.abortMap.has(url)) return;
  loadState.abortMap.get(url)!.abort();
  loadState.abortMap.delete(url);
  handleImgError(url);
};

createEffectOn(
  () => new Set(loadState.loadingUrlSet),
  (downImgList, prevImgList) => {
    if (!store.option.imgRecognition.enabled) return;

    if (prevImgList) {
      // 中断取消下载的图片
      for (const url of prevImgList) {
        if (downImgList.has(url) || !loadState.abortMap.has(url)) continue;
        loadState.abortMap.get(url)?.abort();
        loadState.abortMap.delete(url);
        log(`中断下载 ${url}`);
      }
    }

    for (const url of downImgList) {
      if (loadState.abortMap.has(url) || store.imgMap[url].blobUrl) continue;

      const controller = new AbortController();
      const handleTimeout = debounce(() => timeoutAbort(url), 1000 * 3);
      controller.signal.addEventListener('abort', handleTimeout.clear);
      loadState.abortMap.set(url, controller);
      handleTimeout();
      void request<Blob>(url, {
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
          loadState.abortMap.delete(url);
          setState('imgMap', url, {
            blobUrl: URL.createObjectURL(response),
            progress: undefined,
          });
          handleImgLoaded(url);
        },
      });
    }
  },
);
