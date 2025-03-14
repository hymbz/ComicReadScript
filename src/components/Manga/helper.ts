import { request, type RequestDetails } from 'request';
import { t } from 'helper';

import { _setState, store } from './store';

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

const headers = {
  Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
  'User-Agent': navigator.userAgent,
  Referer: window.location.href,
};
export const downloadImg = async (
  imgUrl: string,
  details?: RequestDetails<Blob>,
) => {
  const url = store.imgMap[imgUrl]?.blobUrl ?? imgUrl;

  if (url.startsWith('blob:')) {
    const res = await fetch(url);
    return res.blob();
  }

  const res = await request<Blob>(url, {
    responseType: 'blob',
    errorText: t('translation.tip.download_img_failed'),
    headers,
    retryFetch: true,
    ...details,
  });

  if (Reflect.has(store.imgMap, imgUrl))
    _setState('imgMap', imgUrl, 'blobUrl', URL.createObjectURL(res.response));

  return res.response;
};
