import { createEffect, createRoot, on } from 'solid-js';

import { isEqualArray } from 'helper';
import { t } from 'helper/i18n';
import type { UseDrag, PointerState } from '../../useDrag';
import type { State } from '..';
import { setState, store } from '..';

/** 漫画流的总高度 */
export const contentHeight = () => store.ref.mangaFlow.scrollHeight;

/** 能显示出漫画的高度 */
export const windowHeight = () => store.ref.root.offsetHeight ?? 0;

/** 更新滚动条滑块的高度和所处高度 */
export const updateDrag = (state: State) => {
  if (!state.option.scrollMode) {
    state.scrollbar.dragHeight = 0;
    state.scrollbar.dragTop = 0;
    return;
  }
  state.scrollbar.dragHeight =
    windowHeight() / (contentHeight() || windowHeight());
};

/** 获取指定图片的提示文本 */
export const getImgTip = (state: State, i: number) => {
  if (i === -1) return t('other.fill_page');
  const img = state.imgList[i];

  // 如果图片未加载完毕则在其 index 后增加显示当前加载状态
  if (img.loadType !== 'loaded')
    return `${i + 1} (${t(`img_status.${img.loadType}`)})`;

  if (
    img.translationType &&
    img.translationType !== 'hide' &&
    img.translationMessage
  )
    return `${i + 1}：${img.translationMessage}`;

  return `${i + 1}`;
};

/** 获取指定页面的提示文本 */
export const getPageTip = (pageIndex: number): string => {
  const page = store.pageList[pageIndex];
  if (!page) return 'null';
  const pageIndexText = page.map((index) => getImgTip(store, index)) as
    | [string]
    | [string, string];
  if (store.option.dir === 'rtl') pageIndexText.reverse();
  return pageIndexText.join(store.option.scrollMode ? '\n' : ' | ');
};

/** 判断点击位置在滚动条上的位置比率 */
const getClickTop = (x: number, y: number, e: HTMLElement): number => {
  if (!store.isMobile) return y / e.offsetHeight;
  return store.option.dir === 'ltr' ? x / e.offsetWidth : 1 - x / e.offsetWidth;
};

/** 计算在滚动条上的拖动距离 */
const getDragDist = (
  [x, y]: PointerState['xy'],
  [ix, iy]: PointerState['initial'],
  e: HTMLElement,
) => {
  if (!store.isMobile) return (y - iy) / e.offsetHeight;
  return store.option.dir === 'ltr'
    ? (x - ix) / e.offsetWidth
    : (1 - (x - ix)) / e.offsetWidth;
};

/** 开始拖拽时的 dragTop 值 */
let startTop = 0;
export const handleScrollbarDrag: UseDrag = ({ type, xy, initial }, e) => {
  const [x, y] = xy;

  // 跳过拖拽结束事件（单击时会同时触发开始和结束，就用开始事件来完成单击的效果
  if (type === 'up') return;

  if (!store.ref.mangaFlow) return;

  const scrollbarDom = e.target as HTMLElement;

  /** 点击位置在滚动条上的位置比率 */
  const clickTop = getClickTop(x, y, e.target as HTMLElement);
  let top = clickTop;

  if (store.option.scrollMode) {
    if (type === 'move') {
      // console.log(initial);
      top = startTop + getDragDist(xy, initial, scrollbarDom);
      // 处理超出范围的情况
      if (top < 0) top = 0;
      else if (top > 1) top = 1;
      store.ref.mangaFlow.scrollTo({
        top: top * contentHeight(),
        behavior: 'instant',
      });
    } else {
      // 确保滚动条的中心会在点击位置
      top -= store.scrollbar.dragHeight / 2;
      startTop = top;
      store.ref.mangaFlow.scrollTo({
        top: top * contentHeight(),
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
};

// 更新 showPageList
const updateShowPageList = (state: State) => {
  if (!state.option.scrollMode) {
    state.memo.showPageList = [state.activePageIndex];
    return;
  }

  // TODO: 用 Observer 重构

  /** 当前显示页面列表 */
  const showPageList: number[] = [];

  const { scrollTop } = store.ref.mangaFlow;
  const eleList = state.ref.mangaFlow
    .childNodes as NodeListOf<HTMLImageElement>;
  const scrollBottom = scrollTop + state.ref.root.offsetHeight;

  // 通过一个一个检查页面元素所在高度来判断页面是否被显示
  for (let i = 0; i < eleList.length; i += 1) {
    const element = eleList[i];
    // 当页面的顶部位置在视窗口的底部位置时中断循环
    if (element.offsetTop > scrollBottom) break;
    // 当页面的底部位置还未达到视窗口的顶部位置时，跳到下一个页面
    if (element.offsetTop + element.offsetHeight < scrollTop) continue;
    const pageIndex = +element.getAttribute('data-index')!;
    if (!Number.isNaN(pageIndex)) showPageList.push(pageIndex);
  }

  state.activePageIndex = showPageList.at(-1) ?? 0;

  if (isEqualArray(state.memo.showPageList, showPageList)) return;
  state.memo.showPageList = showPageList;
};

/** 处理漫画页的滚动事件 */
export const handleMangaFlowScroll = () => {
  if (!store.option.scrollMode) return;

  requestAnimationFrame(() => {
    setState((state) => {
      state.scrollbar.dragTop =
        !store.ref.mangaFlow || !contentHeight()
          ? 0
          : store.ref.mangaFlow.scrollTop / contentHeight();
      updateDrag(state);
      updateShowPageList(state);
    });
  });
};

createRoot(() => {
  // 在关闭工具栏的同时关掉滚动条的强制显示
  createEffect(
    on(
      () => store.show.toolbar,
      () => {
        if (store.show.scrollbar && !store.show.toolbar)
          setState((state) => {
            state.show.scrollbar = false;
          });
      },
      { defer: true },
    ),
  );

  // 在开启网格模式后关掉 滚动条和工具栏 的强制显示
  createEffect(
    on(
      () => store.gridMode,
      (gridMode) => {
        if (gridMode)
          setState((state) => {
            state.show.scrollbar = false;
            state.show.toolbar = false;
          });
      },
      { defer: true },
    ),
  );
});
