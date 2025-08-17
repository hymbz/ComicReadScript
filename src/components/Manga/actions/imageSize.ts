import { createEffectOn, createRootMemo } from 'helper';

import type { State } from '../store';
import type { ComicImg } from '../store/image';

import { setState, store } from '../store';
import { getImg } from './helper';
import { updateImgType } from './imageType';
import {
  abreastColumnWidth,
  imgList,
  isAbreastMode,
  isDoubleMode,
  isScrollMode,
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

/** 卷轴模式下每张图片的位置 */
export const imgTopList = createRootMemo(() => {
  if (!isScrollMode()) return [];

  const list = Array.from<number>({ length: store.imgList.length });
  let top = 0;
  for (let i = 0; i < store.imgList.length; i++) {
    list[i] = top;
    top += getImg(i).size.height + store.option.scrollMode.spacing * 7;
  }
  return list;
});

/** 卷轴模式下漫画流的总高度 */
export const contentHeight = createRootMemo(() =>
  store.option.scrollMode.enabled
    ? (imgTopList().at(-1) ?? 0) + (imgList().at(-1)?.size.height ?? 0)
    : 0,
);

/** 双页卷轴模式下的每行高度 */
export const doubleScrollLineHeight = createRootMemo(() => {
  if (!isDoubleMode()) return [];

  const doubleWidth = store.rootSize.width / 2;

  return store.pageList.map((indexs) => {
    if (indexs.length === 1) return getImg(indexs[0]).size.height;

    // 选择更高的那张图片作为行高度，尽量放大图片
    let targetImg: ComicImg | undefined;
    for (const i of indexs) {
      if (i === -1) continue;
      const img = getImg(i);
      if (!targetImg || img.size.height > targetImg.size.height)
        targetImg = img;
    }
    if (!targetImg) throw new Error('找不到图片');
    if (
      targetImg.size.width < doubleWidth &&
      !store.option.scrollMode.fitToWidth
    )
      return targetImg.size.height;
    return targetImg.size.height * (doubleWidth / targetImg.size.width);
  });
});

// /** 预加载图片尺寸 */
// const preloadImgSize = singleThreaded(async () => {
//   let index = 0;
//   for (; index < store.imgList.length; index++) {
//     const img = store.imgList[index];
//     if (img.size === undefined) continue;
//     const size = await getImgSize(img.src);
//     if (!size) continue;
//     // 防止加载过程中 imgList 变了的情况
//     if (store.imgList[index].src !== img.src) break;
//     // eslint-disable-next-line @typescript-eslint/no-loop-func
//     setState((state) => updateImgSize(state, index, ...size));
//   }
//
//   if (index < store.imgList.length) requestIdleCallback(preloadImgSize);
// });
//
// 空闲期间预加载所有图片的尺寸
// 卷轴模式下需要提前知道尺寸方便正确布局
// 翻页模式下也需要提前发现跨页图重新排序
// requestIdleCallback(preloadImgSize);
// createEffectOn(() => store.imgList, preloadImgSize);
