import { createRoot, createEffect, on } from 'solid-js';
import type { State } from '../store';
import { _setState, setState, store } from '../store';
import { updateImgLoadType, activePage } from './image';

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

  createEffect(
    on(activePage, (page) => {
      // 如果当前显示页面有出错的图片，就重新加载一次
      page?.forEach((i) => {
        if (store.imgList[i]?.loadType !== 'error') return;
        _setState('imgList', i, 'loadType', 'wait');
      });

      if (store.option.scrollMode) return;
      // 在翻页时重新计算要渲染的页面
      if (!store.isDragMode) setState(updateRenderPage);
    }),
  );
});
