import { createRootEffect } from 'helper';

import { type State, setState, store } from '../store';

import { updatePageData } from './image';
import { placeholderSize } from './memo';

const isWideType = (type: ComicImg['type']) =>
  type === 'wide' || type === 'long';

// https://www.figma.com/design/h0x2ZHVh3P3bCbnszonRqk/漫画双页阅读比例图
// https://github.com/hymbz/ComicReadScript/issues/174#issuecomment-2252114640
// 用于判断图片类型的比例
const 单页比例 = 1920 / 2 / 1080;
const 横幅比例 = 1920 / 1080;
const 条漫比例 = 1920 / 2 / 1080 / 2;

/** 根据比例判断图片类型 */
const getImgType = (img: { width: number; height: number }) => {
  const imgRatio = img.width / img.height;
  if (imgRatio <= 单页比例) return imgRatio < 条漫比例 ? 'vertical' : '';
  return imgRatio > 横幅比例 ? 'long' : 'wide';
};

/** 更新图片类型。返回是否修改了图片类型 */
export const updateImgType = (state: State, draftImg: ComicImg) => {
  const { type } = draftImg;
  if (!draftImg.width || !draftImg.height) return false;
  draftImg.type = getImgType(draftImg as Required<ComicImg>);

  if (isWideType(type) !== isWideType(draftImg.type)) updatePageData.throttle();

  return (type ?? state.defaultImgType) !== draftImg.type;
};

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
      return;
    }

    if (isWide !== prevIsWide) updatePageData(state);
  });

  return isWide;
}, false);
