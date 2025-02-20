import { promisifyRequest, throttle, useCache } from 'helper';
import { unwrap } from 'solid-js/store';

import { _setState, store, type State } from '../store';
import type { FillEffect } from '../store/image';

import { activeImgIndex, imgList } from './memo';
import { jumpToImg, scrollViewImg } from './scroll';
import { updateImgSize } from './imageSize';
import { updatePageData } from './image';

type Progress = {
  id: string;
  time: number;
  index: number;
  imgSize: Record<number, [number, number]>;
  fillEffect: FillEffect;
};

let cache = undefined as unknown as Awaited<
  ReturnType<typeof useCache<{ progress: Progress }>>
>;

const initCache = async () => {
  cache ||= await useCache({ progress: 'id' }, 'ReadProgress');
};

let lastIndex = -1;
/** 保存阅读进度 */
export const saveReadProgress = throttle(async () => {
  await initCache();

  const index = activeImgIndex();
  if (index === lastIndex) return;
  lastIndex = index;

  if (
    // 只保存 50 页以上漫画的进度
    store.imgList.length < 50 ||
    // 翻到最后几页时不保存
    index >= store.imgList.length - 5
  )
    return await cache.del('progress', location.pathname);

  const imgSize: Record<number, [number, number]> = {};
  for (const [i, img] of imgList().entries())
    if (img.width && img.height) imgSize[i] = [img.width, img.height];

  await cache.set('progress', {
    id: location.pathname,
    time: Date.now(),
    index,
    imgSize,
    fillEffect: unwrap(store.fillEffect),
  });
}, 1000);

/** 恢复阅读进度 */
export const resumeReadProgress = async (state: State) => {
  await initCache();
  const progress = await cache.get('progress', location.pathname);
  if (!progress) return;

  // 目前卷轴模式下无法避免因图片加载导致的抖动，
  // 为了避免在恢复阅读进度时出现问题，只能将图片显示相关的数据也存着用于恢复
  let i = state.imgList.length;
  while (i--) {
    const imgSize = progress.imgSize[i];
    if (imgSize) updateImgSize(state.imgList[i], ...imgSize);
  }
  state.fillEffect = progress.fillEffect;
  updatePageData(state);
  if (state.option.scrollMode.enabled)
    setTimeout(scrollViewImg, 500, progress.index);
  else jumpToImg(progress.index);

  // 清除过时的进度
  const nowTime = Date.now();
  cache.each('progress', async (data, cursor) => {
    if (nowTime - data.time < 1000 * 60 * 60 * 24 * 29) return;
    await promisifyRequest(cursor.delete());
  });
};
