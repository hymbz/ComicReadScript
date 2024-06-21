import { createRoot } from 'solid-js';
import { getImgSize, singleThreaded } from 'helper';
import { createEffectOn } from 'helper/solidJs';

import { type State, setState, store } from '../store';
import { isWideImg } from '../handleComicData';

import { resetImgState, updatePageData } from './image';
import { rootSize } from './memo';

/** 根据比例判断图片类型 */
export const getImgType = (
  img: { width: number; height: number },
  state = store,
) => {
  const imgRatio = img.width / img.height;
  if (imgRatio <= state.proportion.单页比例) {
    return imgRatio < state.proportion.条漫比例 ? 'vertical' : '';
  }
  return imgRatio > state.proportion.横幅比例 ? 'long' : 'wide';
};

/** 更新图片类型。返回是否修改了图片类型 */
const updateImgType = (state: State, draftImg: ComicImg) => {
  if (!rootSize().width || !rootSize().height) return false;
  const { type } = draftImg;
  if (!draftImg.width || !draftImg.height) return false;
  draftImg.type = getImgType(draftImg as Required<ComicImg>, state);
  return type !== draftImg.type;
};

/** 检查指定图片周围包括自己在内，是否有足够数量的**连续**的符合条件的图片 */
const checkImgTypeCount = (
  state: State,
  index: number,
  maxNum: number,
  fn = (other: ComicImg, target: ComicImg) => other.type === target.type,
) => {
  let num = 1;

  const targetImg = state.imgList[index];

  let i = index;
  while (i--) {
    const img = state.imgList[i];
    if (img.loadType !== 'loaded') continue;
    if (fn(img, targetImg)) {
      num += 1;
      if (num >= maxNum) return true;
    } else break;
  }

  for (i = index; i < state.imgList.length; i++) {
    const img = state.imgList[i];
    if (img.loadType !== 'loaded') continue;
    if (fn(img, targetImg)) {
      num += 1;
      if (num >= maxNum) return true;
    } else break;
  }

  return false;
};

/** 是否是未知尺寸的图片 */
const isUnknownSize = (img: ComicImg) =>
  (img.loadType === 'wait' || img.loadType === 'error') && img.type === '';

/** 更新图片尺寸 */
export const updateImgSize = (i: number, width: number, height: number) => {
  setState((state) => {
    const img = state.imgList[i];
    if (!img) return;
    img.width = width;
    img.height = height;
    let isEdited = updateImgType(state, img);

    switch (img.type) {
      // 连续出现多张宽图后，自动将滚动条移至底部
      case 'long': {
        if (!state.flag.autoLong && checkImgTypeCount(store, i, 5))
          state.flag.autoLong = true;
        // fall through
      }

      // 连续出现多张跨页图后，将未知尺寸的图片类型设为跨页图
      case 'wide': {
        if (state.flag.autoWide || !checkImgTypeCount(state, i, 3, isWideImg))
          break;
        for (const [index, comicImg] of state.imgList.entries())
          if (isUnknownSize(comicImg)) state.imgList[index].type = 'wide';
        state.flag.autoWide = true;
        isEdited = true;
        break;
      }

      // 连续出现多张长图后，自动开启卷轴模式
      case 'vertical': {
        if (state.flag.autoScrollMode || !checkImgTypeCount(state, i, 3)) break;
        for (const [index, comicImg] of state.imgList.entries())
          if (isUnknownSize(comicImg)) state.imgList[index].type = 'vertical';
        state.option.scrollMode.enabled = true;
        state.flag.autoScrollMode = true;
        isEdited = true;
        break;
      }
    }

    if (!isEdited) return;

    Reflect.deleteProperty(state.fillEffect, i);
    updatePageData(state);
  });
};

createRoot(() => {
  const isLoading = () =>
    store.imgList.some((img) => img.loadType === 'loading');

  // 空闲期间预加载所有图片的尺寸
  // 卷轴模式下需要提前知道尺寸方便正确布局
  // 翻页模式下也需要提前发现跨页图重新排序
  createEffectOn(
    isLoading,
    singleThreaded(async () => {
      while (!isLoading()) {
        const i = store.imgList.findIndex((img) => !(img.width || img.height));
        if (i === -1) break;
        const size = await getImgSize(store.imgList[i].src);
        if (size) updateImgSize(i, ...size);
      }
    }),
  );

  // 处理显示窗口的长宽变化
  createEffectOn(
    rootSize,
    ({ width, height }) =>
      setState((state) => {
        state.proportion.单页比例 = Math.min(width / 2 / height, 1);
        state.proportion.横幅比例 = width / height;
        state.proportion.条漫比例 = state.proportion.单页比例 / 2;

        let isEdited = false;
        for (let i = 0; i < state.imgList.length; i++) {
          if (!updateImgType(state, state.imgList[i])) continue;
          isEdited = true;
          Reflect.deleteProperty(state.fillEffect, i);
        }

        if (isEdited) resetImgState(state);
        updatePageData(state);
      }),
    { defer: true },
  );
});
