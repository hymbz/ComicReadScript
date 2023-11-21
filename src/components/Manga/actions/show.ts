import { createRoot, createEffect, on } from 'solid-js';
import type { State } from '../store';
import { _setState, setState, store } from '../store';
import { updateImgLoadType, activePage } from './image';
import { resetUI } from './helper';

/** 更新渲染页面相关变量 */
export const updateRenderPage = (state: State, animation = false) => {
  state.memo.renderPageList = state.pageList.slice(
    Math.max(0, state.activePageIndex - 1),
    Math.min(state.pageList.length, state.activePageIndex + 2),
  );

  const i = state.memo.renderPageList.indexOf(
    state.pageList[state.activePageIndex],
  );

  state.page.offset.x.pct = 0;
  state.page.offset.y.pct = 0;
  if (store.page.vertical) state.page.offset.y.pct = i === -1 ? 0 : -i * 100;
  else state.page.offset.x.pct = i === -1 ? 0 : i * 100;

  state.page.anima = animation ? 'page' : '';
};

const updateShowPageList = (state: State) => {
  state.memo.showPageList = [
    ...new Set(
      state.memo.showImgList.map(
        (img) => +img.parentElement!.getAttribute('data-index')!,
      ),
    ),
  ];
  state.memo.showPageList.sort();

  if (state.option.scrollMode)
    state.activePageIndex = state.memo.showPageList[0] ?? 0;
};

export const handleObserver: IntersectionObserverCallback = (entries) => {
  setState((state) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting)
        state.memo.showImgList.push(target as HTMLImageElement);
      else
        state.memo.showImgList = state.memo.showImgList.filter(
          (img) => img !== target,
        );
    });

    if (!store.gridMode) updateShowPageList(state);
  });
};

createRoot(() => {
  // 页数发生变动时
  createEffect(
    on(
      () => store.activePageIndex,
      () => {
        setState((state) => {
          updateImgLoadType(state);
          if (state.show.endPage) state.show.endPage = undefined;
        });
      },
      { defer: true },
    ),
  );

  // 在关闭工具栏的同时关掉滚动条的强制显示
  createEffect(
    on(
      () => store.show.toolbar,
      () => {
        if (store.show.scrollbar && !store.show.toolbar)
          _setState('show', 'scrollbar', false);
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      activePage,
      (page) => {
        if (!store.option.scrollMode && !store.isDragMode)
          setState(updateRenderPage);
        // 如果当前显示页面有出错的图片，就重新加载一次
        page?.forEach((i) => {
          if (store.imgList[i]?.loadType !== 'error') return;
          _setState('imgList', i, 'loadType', 'wait');
        });
      },
      { defer: true },
    ),
  );

  // 在切换网格模式后关掉 滚动条和工具栏 的强制显示
  createEffect(
    on(
      () => store.gridMode,
      () => setState(resetUI),
      { defer: true },
    ),
  );
});
