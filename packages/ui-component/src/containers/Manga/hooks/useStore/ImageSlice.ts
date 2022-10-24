import type { Draft } from 'immer';
import { throttle, debounce } from 'throttle-debounce';
import type { SyntheticEvent } from 'react';
import { handleComicData } from '../../handleComicData';
import type { SelfState, SelfStateCreator } from '.';

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

  type SlideData = Array<[ComicImg] | [ComicImg, ComicImg]>;
}

/** 页面填充数据 */
export type FillEffect = Map<number, boolean>;

export interface ImageSLice {
  imgList: ComicImg[];
  slideData: SlideData;
  /** 页面填充数据 */
  fillEffect: FillEffect;

  activeImgIndex: number;
  activeSlideIndex: number;
  nowFillIndex: number;

  img: {
    单页比例: number;
    横幅比例: number;
    条漫比例: number;

    updateSlideData: (callback?: (state: Draft<SelfState>) => void) => void;

    /** 根据比例更新图片类型 */
    updateImgType: (draftImg: Draft<ComicImg>) => void;

    /** 监视 rootDom 的大小变化 */
    resizeObserver: ResizeObserver;

    /** 切换页面填充 */
    switchFillEffect: () => void;

    /** 根据当前页数更新所有图片的加载状态 */
    updateImgLoadType: () => void;
  };

  /** 翻页 */
  pageTurn: (dir: 'next' | 'prev') => void;
}

export const imageSlice: SelfStateCreator<ImageSLice> = (set, get) => ({
  imgList: [],
  fillEffect: new Map([[-1, true]]),
  slideData: [],

  activeImgIndex: 0,
  activeSlideIndex: 0,
  nowFillIndex: -1,

  img: {
    单页比例: 0,
    横幅比例: 0,
    条漫比例: 0,

    updateSlideData: debounce(
      100,
      (callback?: (state: Draft<SelfState>) => void) => {
        set((state) => {
          if (state.option.onePageMode)
            state.slideData = state.imgList.map((img) => [img]);
          else
            state.slideData = handleComicData({
              comicImgList: state.imgList,
              fillEffect: state.fillEffect,
            });

          callback?.(state);

          // 确认没有图片在加载后，开始预加载图片
          if (!state.option.autoLoadOtherImg) return;
          if (state.imgList.some((img) => img.loadType === 'loading')) return;
          const preloadImg = state.imgList.find(
            (img) => img.loadType === 'wait',
          );
          if (!preloadImg) return;
          preloadImg.loadType = 'loading';
        });
      },
    ),

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
      throttle<ResizeObserverCallback>(100, ([entries]) => {
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

    updateImgLoadType: debounce(200, () => {
      set((state) => {
        const {
          activeImgIndex,
          option: { preloadImgNum },
        } = state;

        const loadScope = [
          activeImgIndex - preloadImgNum / 2,
          activeImgIndex + preloadImgNum,
        ];

        // 页数发生变动时，预加载当前页前后指定数量的图片，并取消其他预加载的图片
        state.imgList.forEach((_, i) => {
          if (_.loadType === 'loaded') return;
          const img = state.imgList[i];
          if (loadScope[0] < i && i < loadScope[1]) img.loadType = 'loading';
          else if (img.loadType === 'loading') img.loadType = 'wait';
        });
      });
    }),
  },

  pageTurn: (dir) => {
    const { slideData, showEndPage, activeSlideIndex } = get();
    if (dir === 'next') {
      set((state) => {
        // 在最后一页继续向后翻页时弹出结束页
        if (activeSlideIndex === slideData.length - 1) state.showEndPage = true;
        else state.activeSlideIndex += 1;
      });
      return;
    }

    // 向前翻页时如果当前正在显示结束页，则关闭结束页但不翻页
    if (showEndPage) {
      set((state) => {
        state.showEndPage = false;
      });
      return;
    }

    if (activeSlideIndex > 0) {
      set((state) => {
        state.activeSlideIndex -= 1;
      });
    }
  },
});
