import { createEffect, createRoot, on } from 'solid-js';
import { plimit } from 'helper';
import type { State } from '../store';
import { setState, store } from '../store';
import { updateDrag } from './scrollbar';
import { isWideImg } from '../handleComicData';
import { handleImgError, updatePageData } from './image';

/** 根据比例更新图片类型 */
export const updateImgType = (state: State, draftImg: ComicImg) => {
  const { width, height, type } = draftImg;

  if (!width || !height) return;

  const imgRatio = width / height;
  if (imgRatio <= state.proportion.单页比例) {
    draftImg.type = imgRatio < state.proportion.条漫比例 ? 'vertical' : '';
  } else {
    draftImg.type = imgRatio > state.proportion.横幅比例 ? 'long' : 'wide';
  }

  if (type !== draftImg.type) updatePageData.debounce();
};

/** 处理显示窗口的长宽变化 */
export const handleResize = (state: State, width: number, height: number) => {
  if (!(width && height)) return;
  state.proportion.单页比例 = Math.min(width / 2 / height, 1);
  state.proportion.横幅比例 = width / height;
  state.proportion.条漫比例 = state.proportion.单页比例 / 2;

  state.imgList.forEach((img) => updateImgType(state, img));

  state.isMobile = window.matchMedia('(max-width: 800px)').matches;
};

/** 检查已加载图片中是否**连续**出现了多个指定类型的图片 */
const checkImgTypeCount = (
  state: State,
  fn: (img: ComicImg) => boolean,
  maxNum = 3,
) => {
  let num = 0;
  for (let i = 0; i < state.imgList.length; i++) {
    const img = state.imgList[i];
    if (img.loadType !== 'loaded') continue;
    if (!fn(img)) {
      num = 0;
      continue;
    }
    num += 1;
    if (num >= maxNum) return true;
  }
  return false;
};

/** 更新图片尺寸 */
export const updateImgSize = (i: number, width: number, height: number) => {
  setState((state) => {
    const img = state.imgList[i];
    if (!img) return;
    img.width = width;
    img.height = height;

    switch (img.type) {
      // 连续出现多张跨页图后，将剩余未加载图片类型设为跨页图
      case 'long':
      case 'wide': {
        if (!state.flag.autoWide || !checkImgTypeCount(state, isWideImg)) break;
        state.imgList.forEach((comicImg, index) => {
          if (comicImg.loadType === 'wait' && comicImg.type === '')
            state.imgList[index].type = 'wide';
        });
        state.flag.autoWide = false;
        break;
      }

      // 连续出现多张长图后，自动开启卷轴模式
      case 'vertical': {
        if (
          !state.flag.autoScrollMode ||
          !checkImgTypeCount(state, (image) => image.type === 'vertical')
        )
          break;
        state.option.scrollMode = true;
        state.flag.autoScrollMode = false;
        break;
      }
    }

    updateImgType(state, img);
    updateDrag(state);
  });
};

/** 等待图片的真实尺寸被加载出来 */
const waitImgSizeLoaded = (
  img: HTMLImageElement,
  resolve: (value: unknown) => void,
): void => {
  if (img.naturalWidth && img.naturalHeight) return resolve(null);
  setTimeout(waitImgSizeLoaded, 30, img, resolve);
};

let continueRun = false;
let timeoutId: number | undefined;
/** 更新所有图片的尺寸 */
const updateAllImgSize = async (): Promise<void> => {
  await plimit(
    store.imgList.map((img, i) => async () => {
      if (img.loadType !== 'wait' || img.width || img.height || !img.src)
        return;

      const image = new Image();

      try {
        await new Promise((resolve, reject) => {
          image.onerror = reject;
          image.src = img.src;
          waitImgSizeLoaded(image, resolve);
        });
        updateImgSize(i, image.naturalWidth, image.naturalHeight);
      } catch (_) {
        handleImgError(i, image);
      }
    }),
    undefined,
    Math.max(store.option.preloadPageNum, 1),
  );
  if (continueRun) {
    continueRun = false;
    timeoutId = window.setTimeout(updateAllImgSize);
  } else timeoutId = undefined;
};

createRoot(() => {
  createEffect(
    on(
      () => store.imgList,
      () => {
        if (continueRun) return;
        if (timeoutId) continueRun = true;
        else timeoutId = window.setTimeout(updateAllImgSize);
      },
    ),
  );
});
