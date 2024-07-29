import { isEqual, throttle } from 'helper';
import { createEffectOn } from 'helper/solidJs';

import { autoCloseFill, handleComicData } from '../handleComicData';
import { setState, type State } from '../store';

import { activeImgIndex, isOnePageMode, pageNum } from './memo/common';

/** 重新计算图片排列 */
export const updatePageData = (state: State) => {
  const lastActiveImgIndex = activeImgIndex();

  let newPageList: PageList = [];
  newPageList = isOnePageMode()
    ? state.imgList.map((_, i) => [i])
    : handleComicData(state.imgList, state.fillEffect);
  if (isEqual(state.pageList, newPageList)) return;
  state.pageList = newPageList;

  // 在图片排列改变后自动跳转回原先显示图片所在的页数
  if (lastActiveImgIndex !== activeImgIndex()) {
    const newActivePageIndex = state.pageList.findIndex((page) =>
      page.includes(lastActiveImgIndex),
    );
    if (newActivePageIndex !== -1) state.activePageIndex = newActivePageIndex;
  }
};
updatePageData.throttle = throttle(() => setState(updatePageData), 100);

/**
 * 将处理图片的相关变量恢复到初始状态
 *
 * 必须按照以下顺序调用
 * 1. 修改 imgList
 * 2. resetImgState
 * 3. updatePageData
 */
export const resetImgState = (state: State) => {
  autoCloseFill.clear();
  // 如果用户没有手动修改过首页填充，才将其恢复初始
  if (typeof state.fillEffect['-1'] === 'boolean')
    state.fillEffect['-1'] =
      state.option.firstPageFill && state.imgList.length > 3;
};

createEffectOn([pageNum, isOnePageMode], () => setState(updatePageData));
