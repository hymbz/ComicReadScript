import { createRoot, createSignal } from 'solid-js';
import { inRange } from 'helper';
import { createEffectOn } from 'helper/solidJs';
import type { State } from '../../store';
import { setState, store } from '../../store';
import { contentHeight, imgTopList } from './common';
import { rootSize, scrollTop } from './observer';

const [renderRangeStart, setRenderRangeStart] = createSignal(0);
const [renderRangeEnd, setRenderRangeEnd] = createSignal(0);

/** 渲染范围 */
export const renderRange = { start: renderRangeStart, end: renderRangeEnd };

const findTopImg = (initIndex: number, top: number) => {
  let i = initIndex || 1;
  for (; i < imgTopList().length; i++) if (imgTopList()[i] > top) return i - 1;
  return imgTopList().length - 1;
};

/** 计算渲染页面 */
export const updateRenderRange = (state: State) => {
  let startPage: number | undefined;
  let endPage: number | undefined;

  if (state.option.scrollMode) {
    if (contentHeight() === 0) {
      startPage = 0;
      endPage = 1;
    } else {
      const top = scrollTop() - rootSize().height * 4;
      startPage = top < 0 ? 0 : findTopImg(0, top);
      const bottom = scrollTop() + rootSize().height * 5;
      endPage =
        bottom > contentHeight()
          ? imgTopList().length - 1
          : findTopImg(startPage, bottom);
    }
  } else {
    startPage = Math.max(0, state.activePageIndex - 1);
    endPage = Math.min(state.pageList.length, state.activePageIndex + 2);
  }

  if (!startPage) startPage = 0;
  if (!endPage) endPage = startPage + 1;
  setRenderRangeStart(startPage);
  setRenderRangeEnd(endPage);
};

createRoot(() => {
  createEffectOn(
    () => store.option.scrollModeImgScale,
    () => setState(updateRenderRange),
  );

  const getImgBottom = (i: number) =>
    i === imgTopList().length - 1 ? contentHeight() : imgTopList()[i + 1];

  let startImgBootom = 0;
  let endImgTop = 0;
  createEffectOn(scrollTop, (top) => {
    if (inRange(startImgBootom, top, endImgTop)) return;
    setState(updateRenderRange);
    startImgBootom = getImgBottom(renderRangeStart());
    endImgTop = imgTopList()[renderRangeEnd()];
  });
});
