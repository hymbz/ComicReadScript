import { clamp, isEqual, debounce } from 'helper';

import { autoCloseFill, handleComicData } from '../handleComicData';
import { type State, store } from '../store';

import { setOption } from './helper';
import {
  activeImgIndex,
  isOnePageMode,
  preloadNum,
  showPageList,
} from './memo';
import { saveScrollProgress } from './scroll';

type LoadImgDraft = { editNum: number; loadNum: number };
const loadImg = (
  state: State,
  index: number,
  draft = { editNum: 0, loadNum: 1 } as LoadImgDraft,
) => {
  if (index === -1) return false;
  const img = state.imgList[index];
  if (!img?.src) return false;
  if (img.loadType === 'wait') {
    img.loadType = 'loading';
    draft.editNum += 1;
  }

  return draft.editNum >= draft.loadNum;
};

const loadPage = (state: State, index: number, draft: LoadImgDraft) =>
  state.pageList[index]?.some((i) => loadImg(state, i, draft));

/**
 * 以当前显示页为基准，预加载附近指定页数的图片，并取消其他预加载的图片
 * @param state state
 * @param loadPageNum 加载页数
 * @param loadNum 加载图片的数量
 * @returns 返回是否成功加载了未加载图片
 */
const loadPageImg = (
  state: State,
  loadPageNum = Number.POSITIVE_INFINITY,
  loadNum = 2,
) => {
  const draft: LoadImgDraft = { editNum: 0, loadNum };
  const targetPageIndex = state.option.scrollMode.enabled
    ? showPageList().at(-1) ?? state.activePageIndex
    : state.activePageIndex;
  const targetPage = targetPageIndex + loadPageNum;

  if (targetPage < targetPageIndex) {
    const end = Math.max(0, targetPage);
    for (let i = targetPageIndex; i >= end; i--)
      if (loadPage(state, i, draft)) break;
  } else {
    const end = Math.min(state.pageList.length, targetPage);
    for (let i = targetPageIndex; i < end; i++)
      if (loadPage(state, i, draft)) break;
  }

  return draft.editNum > 0;
};

/** 在卷轴模式下进行缩放，并且保持滚动进度不变 */
export const zoomScrollModeImg = (zoomLevel: number, set = false) => {
  const jump = saveScrollProgress();
  setOption((draftOption) => {
    const newVal = set
      ? zoomLevel
      : store.option.scrollMode.imgScale + zoomLevel;
    draftOption.scrollMode.imgScale = clamp(0.1, Number(newVal.toFixed(2)), 3);
  });
  jump();

  // 并排卷轴模式下并没有一个明确直观的滚动进度，
  // 也想不出有什么实现效果能和普通卷轴模式的效果一致,
  // 所以就摆烂不管了，反正现在这样也已经能避免乱跳了
};

/** 根据当前页数更新所有图片的加载状态 */
export const updateImgLoadType = debounce((state: State) => {
  // 先将所有加载中的图片状态改为暂停
  let i = state.imgList.length;
  while (i--) {
    if (state.imgList[i].loadType === 'loading')
      state.imgList[i].loadType = 'wait';
  }

  // 优先加载当前显示的图片
  if (state.option.scrollMode.enabled) {
    for (const index of showPageList()) if (loadImg(state, index)) return true;
  } else if (loadPageImg(state, 1)) return true;

  return (
    // 再加载后面几页
    loadPageImg(state, preloadNum().back) ||
    // 再加载前面几页
    loadPageImg(state, -preloadNum().front) ||
    // 根据设置决定是否要继续加载其余图片
    (!state.option.alwaysLoadAllImg && state.imgList.length > 60) ||
    // 加载当前页后面的图片
    loadPageImg(state, Number.POSITIVE_INFINITY, 5) ||
    // 加载当前页前面的图片
    loadPageImg(state, Number.NEGATIVE_INFINITY, 5)
  );
});

/** 重新计算 PageData */
export const updatePageData = (state: State) => {
  const lastActiveImgIndex = activeImgIndex();

  let newPageList: PageList = [];
  newPageList = isOnePageMode()
    ? state.imgList.map((_, i) => [i])
    : handleComicData(state.imgList, state.fillEffect);
  if (!isEqual(state.pageList, newPageList)) state.pageList = newPageList;
  updateImgLoadType(state);

  // 在图片排列改变后自动跳转回原先显示图片所在的页数
  if (lastActiveImgIndex !== activeImgIndex()) {
    const newActivePageIndex = state.pageList.findIndex((page) =>
      page.includes(lastActiveImgIndex),
    );
    if (newActivePageIndex !== -1) state.activePageIndex = newActivePageIndex;
  }
};

/**
 * 将处理图片的相关变量恢复到初始状态
 *
 * 必须按照以下顺序调用
 * 1. 修改 imgList
 * 2. resetImgState
 * 3. updatePageData
 */
export const resetImgState = (state: State) => {
  state.flag.autoScrollMode = false;
  state.flag.autoWide = false;
  state.flag.autoLong = false;
  autoCloseFill.clear();
  // 如果用户没有手动修改过首页填充，才将其恢复初始
  if (typeof state.fillEffect['-1'] === 'boolean')
    state.fillEffect['-1'] =
      state.option.firstPageFill && state.imgList.length > 3;
};
