import { createEffect, createRoot, on } from 'solid-js';

import type { State } from '..';
import { setState, store } from '..';
import type { UseDragOption } from '../../useDrag';
import { loadTypeMap } from '../ImageState';

/**
 * 获取指定 page 中的图片 index，并在后面加上加载状态
 */
const getPageIndexText = (state: State, pageIndex: number) => {
  const pageIndexText = state.pageList[pageIndex].map((index) => {
    if (index === -1) return '填充页';
    const img = state.imgList[index];
    if (img.loadType === 'loaded') return `${index + 1}`;
    // 如果图片未加载完毕则在其 index 后增加显示当前加载状态
    return `${index + 1} (${loadTypeMap[img.loadType]})`;
  }) as [string] | [string, string];
  if (state.option.dir === 'rtl') pageIndexText.reverse();
  return pageIndexText;
};

/** 更新滚动条提示文本 */
export const updateTipText = (state: State) => {
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
};

/** 更新滚动条滑块的高度和所处高度 */
export const updateDrag = (state: State) => {
  if (!state.option.scrollMode) {
    state.scrollbar.dragHeight = 0;
    state.scrollbar.dragTop = 0;
    return;
  }

  /** 能显示出漫画的高度 */
  const windowHeight = state.rootRef!.offsetHeight;
  /** 漫画的总高度 */
  const contentHeight = state.mangaFlowRef!.scrollHeight;
  state.scrollbar.dragHeight =
    !windowHeight || !contentHeight ? 0 : windowHeight / contentHeight;
};

/** 监视漫画页的滚动事件 */
export const handleMangaFlowScroll = () => {
  if (!store.option.scrollMode) return;

  setState((state) => {
    /** 漫画的总高度 */
    const contentHeight = state.mangaFlowRef?.scrollHeight;

    state.scrollbar.dragTop =
      !state.mangaFlowRef || !contentHeight
        ? 0
        : state.mangaFlowRef.scrollTop / contentHeight;
    state.activePageIndex = Math.floor(
      state.scrollbar.dragTop * state.pageList.length,
    );
  });

  setState(updateDrag);
};

/** 使在滚动条上的滚轮可以触发滚动 */
export const handleWheel = (e: WheelEvent) => {
  /** 能显示出漫画的高度 */
  const windowHeight = store.rootRef?.offsetHeight;
  if (!windowHeight) return;

  /** 滚动条高度 */
  const scrollbarHeight = (e.target as HTMLElement).offsetHeight;
  // 使用 scrollBy 会导致和原生滚动效果不同，少了平滑滚动，但初次之外找不到其他办法了
  store.mangaFlowRef?.scrollBy({
    top: (e.deltaY / scrollbarHeight) * windowHeight,
  });
};

/** 开始拖拽时的 dragTop 值 */
let startTop = 0;
export const dragOption: UseDragOption = {
  handleDrag: ({ type, xy: [, y], initial: [, iy] }, e) => {
    // 跳过拖拽结束事件（单击时会同时触发开始和结束，就用开始事件来完成单击的效果
    if (type === 'end') return;
    // 跳过没必要处理的情况
    if (type === 'dragging' && y === iy) return;

    if (!store.mangaFlowRef) return;

    /** 滚动条高度 */
    const scrollbarHeight = (e.target as HTMLElement).offsetHeight;
    /** 点击位置在滚动条上的位置比率 */
    const clickTop = y / scrollbarHeight;
    let top = clickTop;

    if (store.option.scrollMode) {
      /** 漫画的总高度 */
      const contentHeight = store.mangaFlowRef.scrollHeight;

      if (type === 'dragging') {
        /** 在滚动条上的移动比率 */
        const dy = (y - iy) / scrollbarHeight;
        top = startTop + dy;
        // 处理超出范围的情况
        if (top < 0) top = 0;
        else if (top > 1) top = 1;
        store.mangaFlowRef.scrollTo({ top: top * contentHeight });
      } else {
        // 确保滚动条的中心会在点击位置
        top -= store.scrollbar.dragHeight / 2;
        startTop = top;
        store.mangaFlowRef.scrollTo({
          top: top * contentHeight,
          behavior: 'smooth',
        });
      }
    } else {
      let newPageIndex = Math.floor(top * store.pageList.length);
      // 处理超出范围的情况
      if (newPageIndex < 0) newPageIndex = 0;
      else if (newPageIndex >= store.pageList.length)
        newPageIndex = store.pageList.length - 1;

      if (newPageIndex !== store.activePageIndex) {
        setState((state) => {
          state.activePageIndex = newPageIndex;
        });
      }
    }
  },
};

createRoot(() => {
  // 更新滚动条提示文本
  createEffect(
    on(
      [
        () => store.activePageIndex,
        () => store.pageList,
        () => store.scrollbar.dragHeight,
        () => store.scrollbar.dragTop,
        () => store.option.scrollMode,
        () => store.option.dir,
      ],
      () => {
        setState(updateTipText);
      },
    ),
  );
});
