import type { RequestDetails } from 'request';

import { downloadImg as _downloadImg } from 'request';

import { setState, store } from './store';

/** 阻止事件冒泡 */
export const stopPropagation = (e: Event) => {
  e.stopPropagation();
};

/** 从头开始播放元素的动画 */
export const playAnimation = (e?: HTMLElement) => {
  if (!e) return;
  for (const animation of e.getAnimations()) {
    animation.cancel();
    animation.play();
  }
};

export const downloadImg = async (
  imgUrl: string,
  details?: RequestDetails<Blob>,
  retryNum = 0,
) => {
  const url = store.imgMap[imgUrl]?.blobUrl ?? imgUrl;

  if (url.startsWith('blob:')) {
    const res = await fetch(url);
    return res.blob();
  }

  const res = await _downloadImg(url, details, retryNum);
  if (Reflect.has(store.imgMap, imgUrl))
    setState('imgMap', imgUrl, 'blobUrl', URL.createObjectURL(res));
  return res;
};
