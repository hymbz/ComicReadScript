import { approx } from 'helper';

import { setState, store } from '../store';
import { handleEndTurnPage } from './endPage';
import { getImg, setOption } from './helper';
import { reloadImg } from './imageLoad';
import {
  abreastScrollFill,
  findTopPage,
  getPageTop,
  isAbreastMode,
  isScrollMode,
  pageHeightList,
  scrollLength,
  scrollTop,
  setAbreastScrollFill,
} from './memo';
import { showImgList } from './renderPage';
import { constantScroll, scrollBy, scrollTo } from './scroll';
import {
  stopAutoScroll,
  switchAutoScroll,
  switchDir,
  switchFillEffect,
  switchFullscreen,
  switchOnePageMode,
  switchScrollMode,
} from './switch';
import { translateAll, translateCurrent, translateToEnd } from './translation';
import { finishTurnAnimation, turnPageAnimation } from './turnPageAnimator';

/** 卷轴模式下滚动至指定页数 */
const scrollIntoView = (index: number, position: 'start' | 'end' = 'start') =>
  scrollTo(
    position === 'start'
      ? getPageTop(index)
      : getPageTop(index + 1) - store.rootSize.height,
    true,
  );

/** 判断指定页能否被完全显示出来 */
const isFullView = (i: number) => pageHeightList()[i] < store.rootSize.height;

/** 在卷轴模式下，智能滚动至图片的头尾 */
const scrollViewTurnPage = (offset: number) => {
  if (!store.option.scrollMode.enabled) return;

  const dir = offset > 0 ? 'next' : 'prev';
  if (handleEndTurnPage(dir)) return;

  if (!store.option.scrollMode.alignEdge) return scrollBy(offset, true);

  const viewBottom = scrollTop() + store.rootSize.height;
  let viewBottomPage = findTopPage(viewBottom);
  // 如果底页只露出了一点点，就当它没显示出来，避免小数滚动的误差
  if (approx(getPageTop(viewBottomPage), viewBottom)) viewBottomPage -= 1;

  const viewTop = scrollTop();
  let viewTopPage = findTopPage(viewTop);
  // 如果顶页只露出了一点点，就当它没显示出来，避免小数滚动的误差
  if (approx(getPageTop(viewTopPage + 1), viewTop)) viewTopPage += 1;

  if (dir === 'next') {
    const pageBottom = getPageTop(viewBottomPage + 1);

    // 如果底页没显示出结尾，就跳转显示底页
    if (!approx(viewBottom, pageBottom)) {
      // 如果当前显示的图片占满了屏幕
      if (viewBottomPage === viewTopPage) {
        // 并且在滚动了指定距离后显示的还是这个图片，就直接滚动完事
        if (viewBottom + offset <= pageBottom) return scrollBy(offset, true);
        // 否则跳至底页结尾
        return scrollIntoView(viewBottomPage, 'end');
      }

      return scrollIntoView(
        viewBottomPage,
        isFullView(viewBottomPage) ? 'end' : 'start',
      );
    }
    // 否则下一页
    const nextPage = viewBottomPage + 1;
    scrollIntoView(nextPage, isFullView(nextPage) ? 'end' : 'start');
  } else {
    const pageTop = getPageTop(viewTopPage);

    // 如果顶页没显示出开头，就跳转显示顶页
    if (!approx(viewTop, pageTop)) {
      // 如果当前显示的图片占满了屏幕
      if (viewBottomPage === viewTopPage) {
        // 并且在滚动了指定距离后显示的还是这个图片，就直接滚动完事
        if (viewTop + offset >= pageTop) return scrollBy(offset, true);
        // 否则跳至顶页开头
        return scrollIntoView(viewTopPage, 'start');
      }

      return scrollIntoView(
        viewTopPage,
        isFullView(viewTopPage) ? 'start' : 'end',
      );
    }
    // 否则上一页
    const prevPage = viewTopPage - 1;
    scrollIntoView(prevPage, isFullView(prevPage) ? 'start' : 'end');
  }
};

/** 根据是否开启了 左右翻页键交换 来切换翻页方向 */
const handleSwapPageTurnKey = (nextPage: boolean) => {
  const next = store.option.swapPageTurnKey ? !nextPage : nextPage;
  return next ? 'next' : 'prev';
};

export const handleHotkey = (hotkey: string, e?: KeyboardEvent) => {
  // 用户手动触发快捷键时，停止自动滚动并直接走完当前翻页动画
  stopAutoScroll();
  finishTurnAnimation();

  // 并排卷轴模式下的快捷键
  if (isAbreastMode()) {
    switch (hotkey) {
      case 'scroll_up':
        return setAbreastScrollFill(abreastScrollFill() - 40);
      case 'scroll_down':
        return setAbreastScrollFill(abreastScrollFill() + 40);

      case 'scroll_left':
        if (e?.repeat)
          return constantScroll.start(store.option.dir === 'rtl' ? -1 : 1);
        return scrollBy(store.option.dir === 'rtl' ? -40 : 40);
      case 'scroll_right':
        if (e?.repeat)
          return constantScroll.start(store.option.dir === 'rtl' ? 1 : -1);
        return scrollBy(store.option.dir === 'rtl' ? 40 : -40);

      case 'page_up':
        return scrollBy(-store.rootSize.width * 0.8);
      case 'page_down':
        return scrollBy(store.rootSize.width * 0.8);

      case 'jump_to_home':
        return scrollTo(0);
      case 'jump_to_end':
        return scrollTo(scrollLength());
    }
  }

  // 普通卷轴模式下的快捷键
  if (isScrollMode()) {
    switch (hotkey) {
      case 'page_up':
        return scrollViewTurnPage(-store.rootSize.height * 0.8);
      case 'page_down':
        return scrollViewTurnPage(store.rootSize.height * 0.8);

      case 'scroll_up':
        if (e?.repeat) return constantScroll.start(-1);
        return scrollBy(-40, true);
      case 'scroll_down':
        if (e?.repeat) return constantScroll.start(1);
        return scrollBy(40, true);
    }
  }

  switch (hotkey) {
    case 'page_up':
    case 'scroll_up':
      return turnPageAnimation('prev');

    case 'page_down':
    case 'scroll_down':
      return turnPageAnimation('next');

    case 'scroll_left':
      return turnPageAnimation(
        handleSwapPageTurnKey(store.option.dir === 'rtl'),
      );
    case 'scroll_right':
      return turnPageAnimation(
        handleSwapPageTurnKey(store.option.dir !== 'rtl'),
      );

    case 'jump_to_home':
      return setState('activePageIndex', 0);
    case 'jump_to_end':
      return setState(
        'activePageIndex',
        Math.max(0, store.pageList.length - 1),
      );

    case 'switch_page_fill':
      return switchFillEffect();
    case 'switch_scroll_mode':
      return switchScrollMode();
    case 'switch_single_double_page_mode':
      return switchOnePageMode();
    case 'switch_dir':
      return switchDir();

    case 'translate_current_page':
      return translateCurrent();
    case 'translate_all':
      return translateAll();
    case 'translate_to_end':
      return translateToEnd();

    case 'auto_scroll':
      return switchAutoScroll();
    case 'fullscreen':
      return switchFullscreen();

    case 'jump_next':
      return store.prop.onNext?.();
    case 'jump_prev':
      return store.prop.onPrev?.();

    case 'switch_auto_enlarge':
      return setOption((draftOption) => {
        draftOption.disableZoom = !draftOption.disableZoom;
      });

    case 'reload_current_error_img':
      for (const i of showImgList()) reloadImg(getImg(i).src);
      return;

    case 'exit':
      return store.prop.onExit?.();

    // 阅读模式以外的快捷键转发到网页上去处理
    default:
      document.body.dispatchEvent(new KeyboardEvent('keydown', e));
      document.body.dispatchEvent(new KeyboardEvent('keyup', e));
  }
};
