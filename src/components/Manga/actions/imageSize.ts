import { createEffectOn } from 'helper';

import { type State, setState, store } from '../store';
import { type BlankMargin, type ComicImg } from '../store/image';
import { withOptionalState } from './helper';
import { updateImgType } from './imageType';
import {
  abreastColumnWidth,
  imgList,
  isAbreastMode,
  placeholderSize,
  scrollModeScale,
} from './memo';

type ImgSizeSource = Pick<ComicImg, 'width' | 'height' | 'blankMargin'>;

/** 计算裁切后的四边比例，没有裁切时返回 null */
export const getCropMargin = (
  { blankMargin: margin, width, height }: ImgSizeSource,
  state: State = store,
): BlankMargin | null => {
  const { crop, keepMargin } = state.option.imgRecognition;
  if (!crop || !margin || !width || !height) return null;

  const left = Math.max(0, margin.left - keepMargin / width);
  const right = Math.max(0, margin.right - keepMargin / width);
  const top = Math.max(0, margin.top - keepMargin / height);
  const bottom = Math.max(0, margin.bottom - keepMargin / height);
  if (left + right + top + bottom === 0) return null;
  return { left, right, top, bottom };
};

/** 获取指定图片的显示尺寸（会将边缘裁切计算在内） */
export const getImgDisplaySize = (state: State, img: ImgSizeSource) => {
  let height = img.height ?? placeholderSize().height;
  let width = img.width ?? placeholderSize().width;

  if (state.option.imgRecognition.crop && img.width && img.height) {
    const crop = getCropMargin(img, state);
    if (crop) {
      width = img.width * (1 - crop.left - crop.right);
      height = img.height * (1 - crop.top - crop.bottom);
    }
  }

  if (!state.option.scrollMode.enabled) return { height, width };

  const setWidth = (w: number) => {
    height *= w / width;
    width = w;
    return { height, width };
  };

  if (isAbreastMode()) return setWidth(abreastColumnWidth());
  if (state.option.scrollMode.adjustToWidth === 'full')
    return setWidth(state.rootSize.width);

  height *= scrollModeScale();
  width *= scrollModeScale();

  if (width > state.rootSize.width) return setWidth(state.rootSize.width);

  return { height, width };
};

/** 更新图片尺寸 */
export const updateImgSize = withOptionalState(
  // oxlint-disable-next-line max-params
  (url: string, width: number, height: number, state: State) => {
    const img = state.imgMap[url];

    if (img.width !== width || img.height !== height) {
      img.width = width;
      img.height = height;
      updateImgType(state, img);
    }

    const size = getImgDisplaySize(state, img);
    if (img.size.width !== size.width || img.size.height !== size.height)
      Object.assign(img.size, size);
  },
);

createEffectOn(
  [
    imgList,
    scrollModeScale,
    placeholderSize,
    () => store.rootSize,
    () => store.option.scrollMode.enabled,
    () => store.option.scrollMode.abreastMode,
    () => store.option.scrollMode.adjustToWidth,
    () => store.option.imgRecognition.crop,
    () => store.option.imgRecognition.keepMargin,
  ],
  ([{ length }]) => {
    if (length === 0) return;
    setState((state) => {
      for (const url of state.imgList) {
        const img = state.imgMap[url];
        Object.assign(img.size, getImgDisplaySize(state, img));
      }
    });
  },
);
