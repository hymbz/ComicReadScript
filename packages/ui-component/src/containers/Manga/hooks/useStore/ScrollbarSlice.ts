import type { Draft } from 'immer';
import type { MouseEventHandler } from 'react';
import type { SelfState, SelfStateCreator } from '.';

export interface ScrollbarSlice {
  /** 滚动条 */
  scrollbar: {
    /** 滚动条高度 */
    dragHeight: number;
    /** 滚动条所处高度 */
    dragTop: number;

    /** 更新滚动条滑块的高度和所处高度 */
    updateScrollbarDrag: (state: Draft<SelfState>) => void;
    /** 监视漫画页的滚动事件 */
    watchMangaFlowScroll: () => void;

    handleCLick: MouseEventHandler;
  };
}

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

    handleCLick: (e) => {
      e.stopPropagation();

      const {
        activeSlideIndex,
        mangaFlowRef,
        rootRef,
        slideData,
        option: { scrollMode },
        scrollbar: { dragHeight, dragTop },
      } = get();

      if (!mangaFlowRef.current) return;

      /** 点击位置在滚动条上的位置比率 */
      let top = e.nativeEvent.offsetY / (e.target as HTMLElement).offsetHeight;

      if (scrollMode) {
        /** 能显示出漫画的高度 */
        const windowHeight = rootRef.current?.offsetHeight;
        if (!windowHeight) return;

        // 跳过点在滚动条位置上的情况
        if (top >= dragTop && top <= dragTop + dragHeight) return;
        // 确保滚动条的中心会在点击位置
        top -= dragHeight / 2;
        // 处理靠近边缘的情况
        if (top < 0) top = 0;
        else if (top > 1) top = 1;

        if (mangaFlowRef.current.scrollTop !== top)
          mangaFlowRef.current.scrollTo({
            top: top * windowHeight,
            left: 0,
            behavior: 'smooth',
          });
      } else {
        const newSlideIndex = Math.floor(top * slideData.length);
        if (newSlideIndex !== activeSlideIndex)
          set((state) => {
            state.activeSlideIndex = newSlideIndex;
          });
      }
    },
  },
});
