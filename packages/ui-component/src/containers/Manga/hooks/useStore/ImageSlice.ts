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

  type Slide = [ComicImg] | [ComicImg, ComicImg];
  type SlideData = Array<Slide>;
}

/** 加载状态的中文描述 */
export const loadTypeMap: Record<ComicImg['loadType'], string> = {
  error: '出错',
  loading: '加载中',
  wait: '等待加载',
  loaded: '',
};

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

    /** 重新计算 SlideData，有防抖 */
    updateSlideData: {
      (): void;
      /** 重新计算 SlideData，无防抖同步版 */
      sync: () => void;
    };

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

/**
 * 预加载指定图片，并取消其他预加载的图片
 *
 * @param state
 * @param start
 * @param end
 * @param loadNum 加载数量
 * @returns 返回指定范围内的图片在执行前是否还有未加载完的
 */
const loadImg = (
  state: SelfState,
  start: number,
  end?: number,
  loadNum = NaN,
) => {
  let editNum = 0;
  const endIndex = end ?? start;
  for (let i = start; i <= endIndex; i += 1) {
    const img = state.imgList[i];
    if (img.loadType !== 'loaded') {
      img.loadType = 'loading';
      editNum += 1;
    }
    if (editNum >= loadNum) break;
  }
  const edited = editNum > 0;
  if (edited) state.scrollbar.updateTipText(state);
  return edited;
};

export const imageSlice: SelfStateCreator<ImageSLice> = (set, get) => {
  const _updateSlideData = () => {
    set((state) => {
      if (state.option.onePageMode || state.option.scrollMode)
        state.slideData = state.imgList.map((img) => [img]);
      else
        state.slideData = handleComicData({
          comicImgList: state.imgList,
          fillEffect: state.fillEffect,
        });
      state.scrollbar.updateDrag(state);
      state.img.updateImgLoadType();
    });
  };

  return {
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

      updateSlideData: Object.assign(debounce(100, _updateSlideData), {
        sync: _updateSlideData,
      }),

      updateImgType: (draftImg: Draft<ComicImg>) => {
        const {
          img: { 单页比例, 横幅比例, 条漫比例, updateSlideData },
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

        updateSlideData();
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
            state.scrollbar.updateDrag(state);
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
            slideData,
            imgList,
            activeSlideIndex,
            activeImgIndex,
            option: { preloadImgNum },
          } = state;

          // 先将所有加载中的图片状态改为暂停
          state.imgList.forEach(({ loadType }, i) => {
            if (loadType === 'loading') state.imgList[i].loadType = 'wait';
          });

          const activeSlide = slideData[activeSlideIndex];
          if (
            // 如果当前显示页还没有加载完，则优先加载
            loadImg(state, activeSlide[0].index, activeSlide[1]?.index) ||
            // 之后加载后几页
            loadImg(state, activeImgIndex, activeImgIndex + preloadImgNum) ||
            // 最后加载前两页
            (activeImgIndex >= 2 &&
              loadImg(state, activeImgIndex - 2, activeImgIndex))
          )
            return;

          // 确认没有图片在加载后，在空闲时间自动加载其余图片
          if (
            !state.option.autoLoadOtherImg &&
            state.imgList.some((img) => img.loadType === 'loading')
          )
            return;
          // 优先加载当前页后面的图片
          if (loadImg(state, activeImgIndex, imgList.length - 1, 1)) return;
          loadImg(state, 0, imgList.length - 1, 1);
        });
      }),
    },

    pageTurn: (dir) => {
      const { slideData, showEndPage, activeSlideIndex } = get();
      if (dir === 'next') {
        set((state) => {
          // 在最后一页继续向后翻页时弹出结束页
          if (activeSlideIndex === slideData.length - 1)
            state.showEndPage = true;
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
  };
};
