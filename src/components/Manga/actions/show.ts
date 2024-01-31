import { createRoot } from 'solid-js';
import { t } from 'helper/i18n';
import { inRange } from 'helper';
import { createEffectOn } from 'helper/solidJs';
import type { State } from '../store';
import { _setState, setState, store } from '../store';
import { updateImgLoadType } from './image';
import { resetUI } from './helper';
import { activePage, renderRange, updateRenderRange } from './memo';

/** 将页面移回原位 */
export const resetPage = (state: State, animation = false) => {
  updateRenderRange(state);
  state.page.offset.x.pct = 0;
  state.page.offset.y.pct = 0;

  if (state.option.scrollMode) {
    state.page.anima = '';
    return;
  }

  let i = -1;
  if (inRange(renderRange.start(), state.activePageIndex, renderRange.end()))
    i = state.activePageIndex - renderRange.start();
  if (store.page.vertical) state.page.offset.y.pct = i === -1 ? 0 : -i;
  else state.page.offset.x.pct = i === -1 ? 0 : i;

  state.page.anima = animation ? 'page' : '';
};

/** 获取指定图片的提示文本 */
export const getImgTip = (i: number) => {
  if (i === -1) return t('other.fill_page');
  const img = store.imgList[i];

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
  const pageIndexText = page.map((index) => getImgTip(index)) as
    | [string]
    | [string, string];
  if (store.option.dir === 'rtl') pageIndexText.reverse();
  return pageIndexText.join(store.option.scrollMode ? '\n' : ' | ');
};

createRoot(() => {
  // 页数发生变动时
  createEffectOn(
    () => store.activePageIndex,
    () => {
      setState((state) => {
        updateImgLoadType(state);
        if (state.show.endPage) state.show.endPage = undefined;
      });
    },
    { defer: true },
  );

  createEffectOn(
    activePage,
    (page) => {
      if (!store.isDragMode) setState(resetPage);
      // 如果当前显示页面有出错的图片，就重新加载一次
      page?.forEach((i) => {
        if (store.imgList[i]?.loadType !== 'error') return;
        _setState('imgList', i, 'loadType', 'wait');
      });
    },
    { defer: true },
  );

  // 在关闭工具栏的同时关掉滚动条的强制显示
  createEffectOn(
    () => store.show.toolbar,
    () =>
      store.show.scrollbar &&
      !store.show.toolbar &&
      _setState('show', 'scrollbar', false),
    { defer: true },
  );

  // 在切换网格模式后关掉 滚动条和工具栏 的强制显示
  createEffectOn(
    () => store.gridMode,
    () => setState(resetUI),
    { defer: true },
  );

  createEffectOn(
    () => store.option.scrollModeImgScale,
    () => setState(updateRenderRange),
  );
});
