import type { Draft } from 'immer';
import type { WheelEventHandler } from 'react';
import type { SelfState, SelfStateCreator } from '.';
import type { UseDragOption } from '../useDrag';

export interface ScrollbarSlice {
  /** 滚动条 */
  scrollbar: {
    /** 滚动条高度比率 */
    dragHeight: number;
    /** 滚动条所处高度比率 */
    dragTop: number;

    /** 更新滚动条滑块的高度和所处高度 */
    updateScrollbarDrag: (state: Draft<SelfState>) => void;
    /** 监视漫画页的滚动事件 */
    watchMangaFlowScroll: () => void;

    handleWheel: WheelEventHandler;

    dragOption: UseDragOption;
  };
}

/** 开始拖拽时的 dragTop 值 */
let startTop = 0;

export const scrollbarSlice: SelfStateCreator<ScrollbarSlice> = (set, get) => ({
  scrollbar: {
    dragHeight: 0,
    dragTop: 0,

    updateScrollbarDrag: (state) => {
      if (!state.option.scrollMode) {
        state.scrollbar.dragHeight = 0;
        state.scrollbar.dragTop = 0;
        return;
      }

      /** 能显示出漫画的高度 */
      const windowHeight = state.rootRef.current?.offsetHeight;
      /** 漫画的总高度 */
      const contentHeight = state.mangaFlowRef.current?.scrollHeight;
      state.scrollbar.dragHeight =
        !windowHeight || !contentHeight ? 0 : windowHeight / contentHeight;
    },

    watchMangaFlowScroll: () => {
      set((state) => {
        if (!state.option.scrollMode) return;

        const mangaFlowDom = state.mangaFlowRef.current;
        /** 漫画的总高度 */
        const contentHeight = mangaFlowDom?.scrollHeight;

        state.scrollbar.dragTop =
          !mangaFlowDom || !contentHeight
            ? 0
            : mangaFlowDom.scrollTop / contentHeight;

        state.scrollbar.updateScrollbarDrag(state);
      });
    },

    // 使在滚动条上的滚轮可以触发滚动
    handleWheel: (e) => {
      const { mangaFlowRef, rootRef } = get();

      /** 能显示出漫画的高度 */
      const windowHeight = rootRef.current?.offsetHeight;
      if (!windowHeight) return;

      /** 滚动条高度 */
      const scrollbarHeight = (e.target as HTMLElement).offsetHeight;
      // 使用 scrollBy 会导致和原生滚动效果不同，少了平滑滚动，但初次之外找不到其他办法了
      mangaFlowRef.current?.scrollBy({
        top: (e.nativeEvent.deltaY / scrollbarHeight) * windowHeight,
      });
    },

    dragOption: {
      handleDrag: ({ type, xy: [, y], initial: [, iy] }, e) => {
        // 跳过拖拽结束事件（单击时会同时触发开始和结束，就用开始事件来完成单击的效果
        if (type === 'end') return;
        // 跳过没必要处理的情况
        if (type === 'dragging' && y === iy) return;

        const {
          activeSlideIndex,
          mangaFlowRef,
          slideData,
          option: { scrollMode },
          scrollbar: { dragHeight, dragTop },
        } = get();
        if (type === 'start') startTop = dragTop;

        if (!mangaFlowRef.current) return;

        /** 滚动条高度 */
        const scrollbarHeight = (e.target as HTMLElement).offsetHeight;
        /** 点击位置在滚动条上的位置比率 */
        let top = y / scrollbarHeight;

        if (scrollMode) {
          /** 漫画的总高度 */
          const contentHeight = mangaFlowRef.current.scrollHeight;

          if (type === 'dragging') {
            /** 在滚动条上的移动比率 */
            const dy = (y - iy) / scrollbarHeight;
            mangaFlowRef.current.scrollTo({
              top: (startTop + dy) * contentHeight,
            });
          } else {
            // 确保滚动条的中心会在点击位置
            top -= dragHeight / 2;
            // 处理靠近边缘的情况
            if (top < 0) top = 0;
            else if (top > 1) top = 1;

            mangaFlowRef.current.scrollTo({
              top: top * contentHeight,
              behavior: 'smooth',
            });
          }
        } else {
          const newSlideIndex = Math.floor(top * slideData.length);
          if (newSlideIndex !== activeSlideIndex)
            set((state) => {
              state.activeSlideIndex = newSlideIndex;
            });
        }
      },
    },
  },
});
