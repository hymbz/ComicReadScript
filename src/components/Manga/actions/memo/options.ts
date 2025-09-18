import { createRootMemo, createThrottleMemo } from 'helper';

import { store } from '../../store';

/** 当前是否为并排卷轴模式 */
export const isAbreastMode = createRootMemo(
  () => store.option.scrollMode.enabled && store.option.scrollMode.abreastMode,
);

/** 当前是否为双页卷轴模式 */
export const isDoubleMode = createRootMemo(
  () =>
    store.option.scrollMode.enabled &&
    store.option.scrollMode.doubleMode &&
    !store.option.scrollMode.abreastMode,
);

/** 当前是否为单页卷轴模式 */
export const isSingleMode = createRootMemo(
  () =>
    store.option.scrollMode.enabled &&
    !store.option.scrollMode.doubleMode &&
    !store.option.scrollMode.abreastMode,
);

/** 当前是否为普通卷轴模式（包含了双页卷轴模式） */
export const isScrollMode = createRootMemo(
  () => store.option.scrollMode.enabled && !store.option.scrollMode.abreastMode,
);

/** 当前是否正在卷轴模式下使用自动缩放值 */
export const isUseAutoScale = createRootMemo(
  () =>
    isScrollMode() && typeof store.option.scrollMode.adjustToWidth === 'number',
);

/** 当前是否开启了识别背景色 */
export const isEnableBg = createRootMemo(
  () =>
    store.option.imgRecognition.enabled &&
    store.option.imgRecognition.background,
);

/** 当前是否开启了图像放大 */
export const isUpscale = createRootMemo(
  () =>
    !store.isMobile &&
    store.option.imgRecognition.enabled &&
    store.option.imgRecognition.upscale,
);

/** 根据视区宽高判断单双页模式 */
export const autoPageNum = createThrottleMemo(() =>
  store.rootSize.width >= store.rootSize.height ? 2 : 1,
);

/** 当前使用的单双页模式 */
export const pageNum = createRootMemo(
  () => store.option.pageNum || autoPageNum(),
);

/** 是否为单页模式 */
export const isOnePageMode = createRootMemo(() => {
  if (store.isMobile || store.imgList.length <= 1) return true;
  if (store.option.scrollMode.enabled) {
    if (store.option.scrollMode.abreastMode) return true;
    return !store.option.scrollMode.doubleMode;
  }
  return pageNum() === 1;
});
