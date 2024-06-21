import { createRootMemo, createThrottleMemo } from 'helper/solidJs';

import { store } from '../../store';

import { abreastColumnWidth, isAbreastMode, placeholderSize } from './common';
import { rootSize } from './observer';

// XXX: 每次都全部重新计算太浪费了，要重构成按需计算

/** 每张图片的尺寸 */
export const imgSize = createThrottleMemo(() => {
  const maxWidth = rootSize().width;

  let height = 0;
  let width = 0;

  const setWidth = (w: number) => {
    height *= w / width;
    width = w;
    return { height, width };
  };

  return store.imgList.map((img) => {
    height = img.height ?? placeholderSize().height;
    width = img.width ?? placeholderSize().width;

    if (isAbreastMode()) return setWidth(abreastColumnWidth());
    if (store.option.scrollMode.fitToWidth) return setWidth(rootSize().width);
    if (width > maxWidth) setWidth(maxWidth);

    height *= store.option.scrollMode.imgScale;
    width *= store.option.scrollMode.imgScale;
    return { height, width };
  });
});

/** 卷轴模式下每张图片的位置 */
export const imgTopList = createRootMemo(() => {
  if (!store.option.scrollMode.enabled) return [];

  const list = Array.from<number>({ length: imgSize().length });
  let top = 0;
  for (let i = 0; i < imgSize().length; i++) {
    list[i] = top;
    top += imgSize()[i].height + store.option.scrollMode.spacing * 7;
  }

  return list;
});

/** 漫画流的总高度 */
export const contentHeight = createRootMemo(
  () => (imgTopList().at(-1) ?? 0) + (imgSize().at(-1)?.height ?? 0),
);
