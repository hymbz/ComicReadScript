import { createEffectOn } from 'helper';

import type { State } from '../store';

import { setState, store } from '../store';
import { updateImgType } from './imageType';
import {
  abreastColumnWidth,
  imgList,
  isAbreastMode,
  placeholderSize,
} from './memo';

/** 获取指定图片的显示尺寸 */
export const getImgDisplaySize = (
  state: State,
  img: { width?: number; height?: number },
) => {
  let height = img.height ?? placeholderSize().height;
  let width = img.width ?? placeholderSize().width;

  if (!state.option.scrollMode.enabled) return { height, width };

  const setWidth = (w: number) => {
    height *= w / width;
    width = w;
    return { height, width };
  };

  if (isAbreastMode()) return setWidth(abreastColumnWidth());
  if (state.option.scrollMode.fitToWidth) return setWidth(state.rootSize.width);

  height *= state.option.scrollMode.imgScale;
  width *= state.option.scrollMode.imgScale;

  if (width > state.rootSize.width) return setWidth(state.rootSize.width);

  return { height, width };
};

/** 更新图片尺寸 */
export const updateImgSize = (url: string, width: number, height: number) =>
  setState((state) => {
    const img = state.imgMap[url];
    if (img.width === width && img.height === height) return;
    img.width = width;
    img.height = height;
    img.size = getImgDisplaySize(state, img);
    updateImgType(state, img);
  });

createEffectOn(
  [
    imgList,
    () => store.option.scrollMode.enabled,
    () => store.option.scrollMode.abreastMode,
    () => store.option.scrollMode.fitToWidth,
    () => store.option.scrollMode.imgScale,
    () => store.rootSize,
    placeholderSize,
  ],
  ([{ length }]) => {
    if (length === 0) return;
    setState((state) => {
      for (const url of state.imgList)
        state.imgMap[url].size = getImgDisplaySize(state, state.imgMap[url]);
    });
  },
);
