import type { Draft } from 'immer';
import { debounce, throttle } from 'lodash';
import { handleComicData } from '../../handleComicData';

declare global {
  interface Img {
    type: 'loading' | 'loaded' | 'error';
    element: HTMLImageElement;
    error?: ErrorEvent;
  }

  type ComicImg = Draft<{
    type: 'long' | 'wide' | 'vertical' | 'fill' | 'error' | 'loading' | '';
    index: number | '填充';
    src: string;
    imgData: Img;
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
    updateSlideData: {
      (state: Draft<SelfState>): void;
      debounce: () => void;
    };

    handleImgLoaded: (index: number) => () => void;
    handleImgError: (index: number) => (e: ErrorEvent) => void;

    /** 根据比例更新图片类型 */
    updateImgType: (draftImg: Draft<ComicImg>) => void;

    /** 监视 rootDom 的大小变化 */
    resizeObserver: ResizeObserver;

    /** 切换页面填充 */
    switchFillEffect: () => void;
  };
}

export const imageSlice: SelfStateCreator<ImageSLice> = (set, get) => {
  const updateSlideData = (state: Draft<SelfState>) => {
    if (state.option.onePageMode)
      state.slideData = state.imgList.map((img) => [img]);
    else
      state.slideData = handleComicData({
        comicImgList: state.imgList,
        fillEffect: state.fillEffect,
      });
  };
  updateSlideData.debounce = debounce(() => {
    set(updateSlideData);
  }, 100);

  return {
    imgList: [],
    fillEffect: new Map([[-1, true]]),
    slideData: [],

    activeImgIndex: 0,
    nowFillIndex: -1,

    img: {
      单页比例: 0,
      横幅比例: 0,
      条漫比例: 0,

      updateSlideData,

      handleImgLoaded: (i: number) => () => {
        set((state) => {
          const draftImg = state.imgList[i];
          draftImg.imgData.type = 'loaded';
          state.img.updateImgType(draftImg);
        });
      },
      handleImgError: (i: number) => (e: ErrorEvent) => {
        set((state) => {
          const draftImg = state.imgList[i];
          state.imgList[i].type = 'error';
          draftImg.imgData.type = 'error';
          draftImg.imgData.error = e;
        });
      },

      initImg: (imgUrlList: string[], initFillEffect?: FillEffect) => {
        set((state) => {
          if (initFillEffect) state.fillEffect = initFillEffect;
          const {
            img: { handleImgError, handleImgLoaded },
          } = get();

          imgUrlList.forEach((imgUrl, index) => {
            const img = new Image();
            state.imgList[index] = {
              type: '',
              index,
              src: imgUrl,
              imgData: {
                type: 'loading',
                element: img as Draft<HTMLImageElement>,
              },
            };

            img.addEventListener('error', handleImgError(index));
            img.addEventListener('load', handleImgLoaded(index));

            img.src = imgUrl;
          });
        });
      },

      updateImgType: (draftImg: Draft<ComicImg>) => {
        const {
          img: { 单页比例, 横幅比例, 条漫比例 },
          option: { scrollMode },
        } = get();

        const {
          imgData: {
            element: { width, height },
          },
          type,
        } = draftImg;

        let newType: ComicImg['type'] = '';
        const imgRatio = width / height;
        if (imgRatio <= 单页比例) {
          if (imgRatio < 条漫比例) newType = 'vertical';
        } else {
          newType = imgRatio > 横幅比例 ? 'long' : 'wide';
        }

        if (newType !== type) draftImg.type = newType;

        if (!scrollMode) updateSlideData.debounce();
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
          state.img.updateSlideData(state);
        });
      },
    },
  };
};
