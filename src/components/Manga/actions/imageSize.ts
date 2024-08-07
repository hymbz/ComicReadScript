import { createEffectOn, createRootMemo } from 'helper/solidJs';

import { type State, store, setState } from '../store';

import { abreastColumnWidth, isAbreastMode, placeholderSize } from './memo';
import { updateImgType } from './imageType';

let height = 0;
let width = 0;

const setWidth = (w: number) => {
  height *= w / width;
  width = w;
  return { height, width };
};

/** 获取指定图片的显示尺寸 */
const getImgDisplaySize = (state: State, index: number) => {
  const img = state.imgList[index];

  height = img.height ?? placeholderSize().height;
  width = img.width ?? placeholderSize().width;

  if (!state.option.scrollMode.enabled) return { height, width };
  if (isAbreastMode()) return setWidth(abreastColumnWidth());
  if (state.option.scrollMode.fitToWidth) return setWidth(state.rootSize.width);

  height *= state.option.scrollMode.imgScale;
  width *= state.option.scrollMode.imgScale;

  if (width > state.rootSize.width) return setWidth(state.rootSize.width);

  return { height, width };
};

/** 更新图片尺寸 */
export const updateImgSize = (
  state: State,
  index: number,
  width: number,
  height: number,
) => {
  const img = state.imgList[index];
  if (img.width === width && img.height === height) return;
  img.width = width;
  img.height = height;
  img.size = getImgDisplaySize(state, index);
  updateImgType(state, img);
};

createEffectOn(
  [
    () => store.imgList,
    () => store.option.scrollMode.enabled,
    () => store.option.scrollMode.abreastMode,
    () => store.option.scrollMode.fitToWidth,
    () => store.option.scrollMode.imgScale,
    () => store.rootSize,
    placeholderSize,
  ],
  ([imgList]) => {
    if (imgList.length === 0) return;
    setState((state) => {
      for (const [index, img] of state.imgList.entries())
        img.size = getImgDisplaySize(state, index);
    });
  },
);

/** 卷轴模式下每张图片的位置 */
export const imgTopList = createRootMemo(() => {
  if (!store.option.scrollMode.enabled) return [];

  const list = Array.from<number>({ length: store.imgList.length });
  let top = 0;
  for (let i = 0; i < store.imgList.length; i++) {
    list[i] = top;
    top += store.imgList[i].size.height + store.option.scrollMode.spacing * 7;
  }
  return list;
});

/** 卷轴模式下漫画流的总高度 */
export const contentHeight = createRootMemo(
  () => (imgTopList().at(-1) ?? 0) + (store.imgList.at(-1)?.size.height ?? 0),
);

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
