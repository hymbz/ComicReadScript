import { createRootMemo } from 'helper';

import { refs, setState, store } from '../store';

import { zoom } from './zoom';
import { getImg, setOption } from './helper';
import { updatePageData } from './image';
import { setImgTranslationEnbale } from './translation';
import { saveScrollProgress, scrollViewImg } from './scroll';
import { updateImgLoadType } from './imageLoad';
import {
  activeImgIndex,
  nowFillIndex,
  activePage,
  pageNum,
  autoPageNum,
} from './memo';

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
  zoom(100);
  setOption((draftOption, state) => {
    draftOption.scrollMode.enabled = !draftOption.scrollMode.enabled;
    state.page.offset.x.px = 0;
    state.page.offset.y.px = 0;
  });
  // 切换到卷轴模式后自动定位到对应页
  scrollViewImg(store.activePageIndex);
};

/** 切换单双页模式 */
export const switchOnePageMode = () => {
  setOption((draftOption, state) => {
    const newPageNum = pageNum() === 1 ? 2 : 1;
    draftOption.pageNum =
      state.option.autoSwitchPageMode && newPageNum === autoPageNum()
        ? 0
        : newPageNum;
  });
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

/** 当前显示的图片是否正在翻译 */
export const isTranslatingImage = createRootMemo(() =>
  activePage().some((i) => {
    const img = getImg(i);
    return img?.translationType && img.translationType !== 'hide';
  }),
);

/** 切换当前页的翻译状态 */
export const switchTranslation = () =>
  setImgTranslationEnbale(activePage(), !isTranslatingImage());

/** 切换图片识别 */
export const switchImgRecognition = () => {
  setOption((draftOption, state) => {
    const enabled = !draftOption.imgRecognition.enabled;
    draftOption.imgRecognition.enabled = enabled;

    if (!enabled) return;
    for (const img of Object.values(state.imgMap))
      if (!img.blobUrl) img.loadType = 'wait';
    updateImgLoadType();
  });
};
