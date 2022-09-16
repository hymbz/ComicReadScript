import type { Draft } from 'immer';
import { debounce, throttle } from 'lodash';
import type { SyntheticEvent } from 'react';
import { handleComicData } from '../../handleComicData';

declare global {
  type ComicImg = Draft<{
    loadType: 'loading' | 'loaded' | 'error' | 'wait';
    type: 'long' | 'wide' | 'vertical' | 'fill' | '';
    index: number;
    src: string;
    width?: number;
    height?: number;
    error?: SyntheticEvent<HTMLImageElement, Event>;
  }>;

  /** 页面填充数据 */
  type FillEffect = Map<number, boolean>;

  type SlideData = Array<[ComicImg] | [ComicImg, ComicImg]>;
}

export interface ImageSLice {
  imgList: ComicImg[];
  slideData: SlideData;
  /** 页面填充数据 */
  fillEffect: FillEffect;

  activeImgIndex: number;
  nowFillIndex: number;

  img: {
    单页比例: number;
    横幅比例: number;
    条漫比例: number;

    initImg: (imgUrlList: string[], initFillEffect?: FillEffect) => void;
    updateSlideData: () => void;

    /** 根据比例更新图片类型 */
    updateImgType: (draftImg: Draft<ComicImg>) => void;

    /** 监视 rootDom 的大小变化 */
    resizeObserver: ResizeObserver;

    /** 切换页面填充 */
    switchFillEffect: () => void;
  };
}

export const imageSlice: SelfStateCreator<ImageSLice> = (set, get) => ({
  imgList: [],
  fillEffect: new Map([[-1, true]]),
  slideData: [],

  activeImgIndex: 0,
  nowFillIndex: -1,

  img: {
    单页比例: 0,
    横幅比例: 0,
    条漫比例: 0,

    updateSlideData: debounce(() => {
      set((state) => {
        if (state.option.onePageMode)
          state.slideData = state.imgList.map((img) => [img]);
        else
          state.slideData = handleComicData({
            comicImgList: state.imgList,
            fillEffect: state.fillEffect,
          });

        if (!state.option.autoLoadOtherImg) return;
        // 确认没有图片在加载后，开始预加载图片
        if (state.imgList.some((img) => img.loadType === 'loading')) return;
        const preloadImg = state.imgList.find((img) => img.loadType === 'wait');
        if (!preloadImg) return;
        preloadImg.loadType = 'loading';
      });
    }, 100),

    initImg: (imgUrlList: string[], initFillEffect?: FillEffect) => {
      set((state) => {
        if (initFillEffect) state.fillEffect = initFillEffect;

        imgUrlList.forEach((imgUrl, index) => {
          state.imgList[index] = {
            type: '',
            index,
            src: imgUrl,
            loadType: 'wait',
          };
        });
      });
    },

    updateImgType: (draftImg: Draft<ComicImg>) => {
      const {
        img: { 单页比例, 横幅比例, 条漫比例, updateSlideData },
        option: { scrollMode },
      } = get();
      const { width, height, type } = draftImg;

      if (width && height) {
        let newType: ComicImg['type'] = '';
        const imgRatio = width / height;
        if (imgRatio <= 单页比例) {
          if (imgRatio < 条漫比例) newType = 'vertical';
        } else {
          newType = imgRatio > 横幅比例 ? 'long' : 'wide';
        }

        if (newType !== type) draftImg.type = newType;
      }

      if (!scrollMode) updateSlideData();
    },

    // 在 rootDom 的大小改变时更新比例，并重新计算图片类型
    resizeObserver: new ResizeObserver(
      throttle(([entries]) => {
        const { width, height } = entries.contentRect;
        set((state) => {
          state.img.单页比例 = width / 2 / height;
          state.img.横幅比例 = width / height;
          state.img.条漫比例 = width / 2 / 3 / height;

          state.imgList.forEach(state.img.updateImgType);
        });
      }),
    ),

    switchFillEffect: () => {
      set((state) => {
        state.fillEffect.set(
          state.nowFillIndex,
          !state.fillEffect.get(state.nowFillIndex),
        );
        state.img.updateSlideData();
      });
    },
  },
});
