import { createEffectOn, createRootEffect } from 'helper/solidJs';

import { type State, setState, store } from '../store';

import { resetImgState, updatePageData } from './image';
import { placeholderSize } from './memo';

const isWideType = (type: ComicImg['type']) =>
  type === 'wide' || type === 'long';

/** 根据比例判断图片类型 */
export const getImgType = (
  img: { width: number; height: number },
  state: State = store,
) => {
  const imgRatio = img.width / img.height;
  if (imgRatio <= state.proportion.单页比例) {
    return imgRatio < state.proportion.条漫比例 ? 'vertical' : '';
  }
  return imgRatio > state.proportion.横幅比例 ? 'long' : 'wide';
};

/** 更新图片类型。返回是否修改了图片类型 */
export const updateImgType = (state: State, draftImg: ComicImg) => {
  if (!state.rootSize.width || !state.rootSize.height) return false;
  const { type } = draftImg;
  if (!draftImg.width || !draftImg.height) return false;
  draftImg.type = getImgType(draftImg as Required<ComicImg>, state);

  if (isWideType(type) !== isWideType(draftImg.type)) updatePageData.throttle();

  return (type ?? state.defaultImgType) !== draftImg.type;
};

// 处理显示窗口的长宽变化
createEffectOn(
  [() => store.rootSize.width, () => store.rootSize.height],
  ([width, height]) =>
    setState((state) => {
      state.proportion.单页比例 = Math.min(width / 2 / height, 1);
      state.proportion.横幅比例 = width / height;
      state.proportion.条漫比例 = state.proportion.单页比例 / 2;

      let isEdited = false;
      for (let i = 0; i < state.imgList.length; i++) {
        const img = state.imgList[i];
        const isWide = isWideType(img.type);
        if (!updateImgType(state, img)) continue;
        if (isWide === isWideType(img.type)) continue;
        isEdited = true;
        Reflect.deleteProperty(state.fillEffect, i);
      }
      if (!isEdited) return;

      resetImgState(state);
      updatePageData(state);
    }),
);

/** 是否自动开启过卷轴模式 */
let autoScrollMode = false;

createRootEffect((prevIsWide) => {
  if (store.rootSize.width === 0 || store.rootSize.height === 0) return;

  const defaultImgType = getImgType(placeholderSize());
  if (defaultImgType === store.defaultImgType) return prevIsWide;

  const isWide = isWideType(defaultImgType);

  setState((state) => {
    state.defaultImgType = defaultImgType;

    // 连续出现多张长图后，自动开启卷轴模式
    if (
      defaultImgType === 'vertical' &&
      !autoScrollMode &&
      !state.option.scrollMode.enabled
    ) {
      state.option.scrollMode.enabled = true;
      autoScrollMode = true;
      updatePageData(state);
      return;
    }

    if (isWide !== prevIsWide) updatePageData(state);
  });

  return isWide;
}, false);
