import { _setState, refs, setState, store } from '../store';

import { zoom } from './zoom';
import { setOption } from './helper';
import { updatePageData } from './image';
import { jumpToImg, saveScrollProgress } from './scroll';
import { activeImgIndex, nowFillIndex, pageNum, autoPageNum } from './memo';

/** 切换页面填充 */
export const switchFillEffect = () => {
  setState((state) => {
    // 如果当前页不是双页显示的就跳过，避免在显示跨页图的页面切换却没看到效果的疑惑
    if (state.pageList[state.activePageIndex].length !== 2) return;

    state.fillEffect[nowFillIndex()] = Number(
      !state.fillEffect[nowFillIndex()],
    ) as 0 | 1;
    updatePageData(state);
  });
};

/** 切换卷轴模式 */
export const switchScrollMode = () => {
  const index = activeImgIndex();
  zoom(100);
  setOption((draftOption, state) => {
    draftOption.scrollMode.enabled = !draftOption.scrollMode.enabled;
    state.page.offset.x.px = 0;
    state.page.offset.y.px = 0;
  });
  jumpToImg(index);
};

/** 切换单双页模式 */
export const switchOnePageMode = () => {
  const index = activeImgIndex();
  setOption((draftOption, state) => {
    if (draftOption.scrollMode.enabled) {
      if (draftOption.scrollMode.abreastMode) {
        draftOption.scrollMode.abreastMode = false;
        draftOption.scrollMode.doubleMode = true;
      } else
        draftOption.scrollMode.doubleMode = !draftOption.scrollMode.doubleMode;
    } else {
      const newPageNum = pageNum() === 1 ? 2 : 1;
      draftOption.pageNum =
        state.option.autoSwitchPageMode && newPageNum === autoPageNum()
          ? 0
          : newPageNum;
    }
  });
  jumpToImg(index);
};

/** 切换阅读方向 */
export const switchDir = () => {
  setOption((draftOption) => {
    draftOption.dir = draftOption.dir === 'rtl' ? 'ltr' : 'rtl';
  });
};

/** 切换网格模式 */
export const switchGridMode = () => {
  zoom(100);
  setState((state) => {
    state.gridMode = !state.gridMode;
    if (store.option.zoom.ratio !== 100) zoom(100);
    state.page.anima = '';
  });
  // 切换到网格模式后自动定位到当前页
  if (store.gridMode)
    requestAnimationFrame(() => {
      refs.mangaFlow.children[activeImgIndex()]?.scrollIntoView({
        block: 'center',
        inline: 'center',
      });
    });
};

/** 切换卷轴模式下图片适应宽度 */
export const switchFitToWidth = () => {
  const jump = saveScrollProgress();
  setOption((draftOption) => {
    draftOption.scrollMode.fitToWidth = !draftOption.scrollMode.fitToWidth;
  });
  jump();
};

/** 切换全屏 */
export const switchFullscreen = () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else refs.root.requestFullscreen();
};

/** 切换自动滚动 */
export const switchAutoScroll = () =>
  _setState('autoScroll', 'play', (val) => !val);
