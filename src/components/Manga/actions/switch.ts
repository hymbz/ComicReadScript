import { refs, setState, store } from '../store';
import { zoom } from './zoom';
import { setOption } from './helper';
import { updatePageData } from './image';
import { nowFillIndex } from './memo';

/** 切换页面填充 */
export const switchFillEffect = () => {
  setState((state) => {
    // 如果当前页不是双页显示的就跳过，避免在显示跨页图的页面切换却没看到效果的疑惑
    if (state.pageList[state.activePageIndex].length !== 2) return;

    state.fillEffect[nowFillIndex()] = +!state.fillEffect[nowFillIndex()];
    updatePageData(state);
  });
};

/** 切换卷轴模式 */
export const switchScrollMode = () => {
  zoom(100);
  setOption((draftOption, state) => {
    draftOption.scrollMode = !draftOption.scrollMode;
    draftOption.onePageMode = draftOption.scrollMode;
    updatePageData(state);
  });
  // 切换到卷轴模式后自动定位到对应页
  if (store.option.scrollMode)
    refs.mangaFlow.children[store.activePageIndex]?.scrollIntoView();
};

/** 切换单双页模式 */
export const switchOnePageMode = () => {
  setOption((draftOption, state) => {
    draftOption.onePageMode = !draftOption.onePageMode;
    updatePageData(state);
  });
};

/** 切换阅读方向 */
export const switchDir = () => {
  setOption((draftOption) => {
    draftOption.dir = draftOption.dir !== 'rtl' ? 'rtl' : 'ltr';
  });
};

/** 切换网格模式 */
export const switchGridMode = () => {
  setState((state) => {
    state.gridMode = !state.gridMode;
    if (state.zoom.scale !== 100) zoom(100);
    state.page.anima = '';
  });
  // 切换到网格模式后自动定位到当前页
  if (store.gridMode)
    refs.mangaFlow.children[store.activePageIndex]?.scrollIntoView({
      block: 'center',
      inline: 'center',
    });
};
