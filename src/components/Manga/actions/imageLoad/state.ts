import { ReactiveSet } from 'helper';
import { batch } from 'solid-js';

import { type State } from '../../store';

/** 图片加载管理器的持久状态 */
export const loadState = {
  /** 图片上次加载出错的时间，用于退避重试 */
  imgErrorMap: new Map<string, number>(),

  /** 尚未加载完成（包含出错）且有 src 的图片 url 集合 */
  unloadedUrlSet: new Set<string>(),

  /** 当前没有 src 的图片数量 */
  waitUrlImgNum: 0,

  /** 当前 loadType === 'loading' 的图片 url 集合 */
  loadingUrlSet: new ReactiveSet<string>(),

  /** 存放正在使用「图像识别」功能特殊下载的图片 url 所对应的 AbortController */
  abortMap: new Map<string, AbortController>(),
};

export const setLoadingUrlSet = (urls: Iterable<string>) => {
  batch(() => {
    loadState.loadingUrlSet.clear();
    for (const url of urls) loadState.loadingUrlSet.add(url);
  });
};

/** 在 `store.imgList` 或 `store.imgMap` 被修改后，进行完整的状态更新 */
export const syncImgLoadState = (state: State) => {
  loadState.unloadedUrlSet.clear();
  let waitNum = 0;
  const nextLoading = new Set<string>();

  for (const url of state.imgList) {
    const img = state.imgMap[url];
    if (!img) continue;

    if (img.src) {
      if (img.loadType !== 'loaded') loadState.unloadedUrlSet.add(url);
    } else waitNum += 1;

    if (img.loadType === 'loading') nextLoading.add(url);
  }

  loadState.waitUrlImgNum = waitNum;
  setLoadingUrlSet(nextLoading);
};
