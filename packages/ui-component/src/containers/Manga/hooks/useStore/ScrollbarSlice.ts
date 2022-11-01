import type { Draft } from 'immer';
import type { UIEventHandler, WheelEventHandler } from 'react';
import shallow from 'zustand/shallow';
import type { SelfState, SelfStateCreator, Subscribe } from '.';
import type { UseDragOption } from '../useDrag';
import { loadTypeMap } from './ImageSlice';

export interface ScrollbarSlice {
  /** 滚动条 */
  scrollbar: {
    /** 滚动条提示文本 */
    tipText: string;
    /** 滚动条高度比率 */
    dragHeight: number;
    /** 滚动条所处高度比率 */
    dragTop: number;

    /** 更新滚动条提示文本 */
    updateTipText: (state: Draft<SelfState>) => void;

    /** 更新滚动条滑块的高度和所处高度 */
    updateDrag: (state: Draft<SelfState>) => void;
    /** 监视漫画页的滚动事件 */
    watchMangaFlowScroll: UIEventHandler;

    handleWheel: WheelEventHandler;

    dragOption: UseDragOption;
  };
}

/** 开始拖拽时的 dragTop 值 */
let startTop = 0;

/**
 * 获取指定 page 中的图片 index，并在后面加上加载状态
 *
 * @param state
 * @param pageIndex
 */
const getPageIndexText = (state: Draft<SelfState>, pageIndex: number) => {
  const pageIndexText = state.pageList[pageIndex].map((index) => {
    if (index === -1) return '填充页';
    const img = state.imgList[index];
    if (img.loadType === 'loaded') return `${img.index}`;
    // 如果图片未加载完毕则在其 index 后增加显示当前加载状态
    return `${img.index} (${loadTypeMap[img.loadType]})`;
  }) as [string] | [string, string];
  if (state.option.dir === 'rtl') pageIndexText.reverse();
  return pageIndexText;
};

export const scrollbarSlice: SelfStateCreator<ScrollbarSlice> = (set, get) => ({
  scrollbar: {
    tipText: '',
    dragHeight: 0,
    dragTop: 0,

    updateTipText: (state) => {
      state.scrollbar.tipText = (() => {
        if (!state.pageList.length) return '';

        if (!state.option.scrollMode)
          return getPageIndexText(state, state.activePageIndex).join(' | ');

        const {
          pageList,
          scrollbar: { dragHeight, dragTop },
        } = state;
        const pageIndex = pageList
          .slice(
            Math.floor(dragTop * pageList.length),
            Math.floor((dragTop + dragHeight) * pageList.length),
          )
          .flat()
          .map((index) => getPageIndexText(state, index));
        return pageIndex.join('\n');
      })();
    },

    updateDrag: (state) => {
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

        state.activePageIndex = Math.floor(
          state.scrollbar.dragTop * state.pageList.length,
        );

        state.scrollbar.updateDrag(state);

        state.showEndPage =
          state.scrollbar.dragHeight + state.scrollbar.dragTop === 1;
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
          activePageIndex,
          mangaFlowRef,
          pageList,
          option: { scrollMode },
          scrollbar: { dragHeight },
        } = get();

        if (!mangaFlowRef.current) return;

        /** 滚动条高度 */
        const scrollbarHeight = (e.target as HTMLElement).offsetHeight;
        /** 点击位置在滚动条上的位置比率 */
        const clickTop = y / scrollbarHeight;
        let top = clickTop;

        if (scrollMode) {
          /** 漫画的总高度 */
          const contentHeight = mangaFlowRef.current.scrollHeight;

          if (type === 'dragging') {
            /** 在滚动条上的移动比率 */
            const dy = (y - iy) / scrollbarHeight;
            top = startTop + dy;
            // 处理超出范围的情况
            if (top < 0) top = 0;
            else if (top > 1) top = 1;
            mangaFlowRef.current.scrollTo({ top: top * contentHeight });
          } else {
            // 确保滚动条的中心会在点击位置
            top -= dragHeight / 2;
            startTop = top;
            mangaFlowRef.current.scrollTo({
              top: top * contentHeight,
              behavior: 'smooth',
            });
          }
        } else {
          let newPageIndex = Math.floor(top * pageList.length);
          // 处理超出范围的情况
          if (newPageIndex < 0) newPageIndex = 0;
          else if (newPageIndex >= pageList.length)
            newPageIndex = pageList.length - 1;

          if (newPageIndex !== activePageIndex)
            set((state) => {
              state.activePageIndex = newPageIndex;
            });
        }
      },
    },
  },
});

export const scrollbarCallback: Subscribe = (useStore) => {
  // 更新滚动条提示文本
  useStore.subscribe(
    ({
      activePageIndex,
      pageList,
      scrollbar: { dragHeight, dragTop },
      option: { scrollMode, dir },
    }) => [activePageIndex, pageList, dragHeight, dragTop, scrollMode, dir],
    () => {
      useStore.setState((state) => {
        state.scrollbar.updateTipText(state);
      });
    },
    { equalityFn: shallow },
  );
};
