import { createEffectOn } from 'helper/solidJs';

import { type State, setState, store } from '../store';
import { defaultImgType, isWideImg } from '../handleComicData';

import { resetImgState, updatePageData } from './image';

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
const _updateImgType = (state: State, draftImg: ComicImg) => {
  if (!state.rootSize.width || !state.rootSize.height) return false;
  const { type } = draftImg;
  if (!draftImg.width || !draftImg.height) return false;
  draftImg.type = getImgType(draftImg as Required<ComicImg>, state);
  return (type ?? defaultImgType()) !== draftImg.type;
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

export const updateImgType = (state: State, i: number) => {
  const img = state.imgList[i];

  let isEdited = _updateImgType(state, img);

  switch (img.type) {
    // 连续出现多张宽图后，自动将滚动条移至底部
    case 'long': {
      if (!state.flag.autoLong && checkImgTypeCount(store, i, 5))
        state.flag.autoLong = true;
      // fall through
    }

    // 连续出现多张跨页图后，将默认图片类型设为跨页图
    case 'wide': {
      if (state.flag.autoWide || !checkImgTypeCount(state, i, 3, isWideImg))
        break;
      state.flag.autoWide = true;
      isEdited = true;
      break;
    }

    // 连续出现多张长图后，自动开启卷轴模式
    case 'vertical': {
      if (state.flag.autoScrollMode || !checkImgTypeCount(state, i, 3)) break;
      state.option.scrollMode.enabled = true;
      state.flag.autoScrollMode = true;
      isEdited = true;
      break;
    }
  }

  if (!isEdited) return;

  Reflect.deleteProperty(state.fillEffect, i);
  updatePageData(state);
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
        if (!_updateImgType(state, state.imgList[i])) continue;
        isEdited = true;
        Reflect.deleteProperty(state.fillEffect, i);
      }

      if (isEdited) resetImgState(state);
      updatePageData(state);
    }),
);
