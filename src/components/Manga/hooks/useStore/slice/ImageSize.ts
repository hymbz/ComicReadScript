import { createEffect, createRoot, on } from 'solid-js';
import { plimit, sleep } from 'helper';
import type { State } from '..';
import { setState, store } from '..';
import { updateDrag } from './Scrollbar';
import { isWideImg } from '../../../handleComicData';
import { updatePageData } from './Image';

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

/** 更新图片图片宽高 */
const updateImgSize = (i: number, width: number, height: number) => {
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

/** 更新所有图片的宽高 */
const updateAllImgSize = async (): Promise<void> => {
  const imgList = store.imgList.filter((img) => !(img.width || img.height));
  if (imgList.length === 0) return;

  await plimit(
    imgList.map(({ src }, i) => async () => {
      const img = new Image();
      img.src = src;
      while (!(img.naturalWidth || img.naturalHeight)) await sleep(30);
      updateImgSize(i, img.naturalWidth, img.naturalHeight);
    }),
    undefined,
    store.option.preloadPageNum,
  );
  return updateAllImgSize();
};

createRoot(() => {
  createEffect(on(() => store.imgList, updateAllImgSize));
});
