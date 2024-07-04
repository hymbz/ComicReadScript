import { createRoot } from 'solid-js';
import { t } from 'helper/i18n';
import { inRange, throttle } from 'helper';
import { createEffectOn } from 'helper/solidJs';

import { type State, _setState, setState, store } from '../store';

import { resetUI } from './helper';
import { activePage } from './memo';
import { updateShowRange } from './renderPage';

/** 将页面移回原位 */
export const resetPage = (state: State, animation = false) => {
  updateShowRange(state);
  state.page.offset.x.pct = 0;
  state.page.offset.y.pct = 0;

  if (state.option.scrollMode.enabled) {
    state.page.anima = '';
    return;
  }

  let i = -1;
  if (
    inRange(state.renderRange[0], state.activePageIndex, state.renderRange[1])
  )
    i = state.activePageIndex - state.renderRange[0];
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
  if (pageIndexText.length === 1) return pageIndexText[0];
  if (store.option.dir === 'rtl') pageIndexText.reverse();
  return pageIndexText.join(store.option.scrollMode.enabled ? '\n' : ' | ');
};

createRoot(() => {
  createEffectOn(
    () => store.activePageIndex,
    () => store.show.endPage && _setState('show', 'endPage', undefined),
    { defer: true },
  );

  createEffectOn(
    activePage,
    throttle(() => store.isDragMode || setState(resetPage)),
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
});
