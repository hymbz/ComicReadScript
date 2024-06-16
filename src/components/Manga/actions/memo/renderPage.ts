import { createRoot, createSignal } from 'solid-js';
import { inRange } from 'helper';
import { createEffectOn, createRootMemo } from 'helper/solidJs';

import { type State, setState, store } from '../../store';

import { contentHeight, imgTopList } from './common';
import { rootSize, scrollTop } from './observer';

const [renderRangeStart, setRenderRangeStart] = createSignal(0);
const [renderRangeEnd, setRenderRangeEnd] = createSignal(0);

/** 渲染页面的范围 */
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

  if (state.option.scrollMode.enabled) {
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
    endPage = Math.min(state.pageList.length - 1, state.activePageIndex + 2);
  }

  startPage ||= 0;
  endPage ||= startPage + 1;
  setRenderRangeStart(startPage);
  setRenderRangeEnd(endPage);
};

createRoot(() => {
  createEffectOn(
    () => store.option.scrollMode.imgScale,
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

/** 渲染图片的范围 */
export const renderImgRange = createRootMemo(() => {
  if (!store.pageList[renderRangeStart()] || !store.pageList[renderRangeEnd()])
    return { start: 0, end: 0 };
  const renderImgList = [
    ...store.pageList[renderRangeStart()],
    ...store.pageList[renderRangeEnd()],
  ].filter((i) => i !== -1);
  return { start: Math.min(...renderImgList), end: Math.max(...renderImgList) };
});

/**
 * 图片显示状态
 *
 * 0 - 页面中的第一张图片
 * 1 - 页面中的最后一张图片
 * 2 - 页面中的唯一一张图片
 */
export const imgShowState = createRootMemo<Array<0 | 1 | 2>>(() => {
  const stateList: Array<0 | 1 | 2> = [];
  for (let i = 0; i < store.pageList.length; i++) {
    const [a, b] = store.pageList[i];
    if (b === undefined) {
      stateList[a] = 2;
    } else {
      stateList[a] = 0;
      stateList[b] = 1;
    }
  }

  return stateList;
}, []);
