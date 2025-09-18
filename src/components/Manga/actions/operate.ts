import { approx, getKeyboardCode } from 'helper';

import classes from '../index.module.css';
import { setState, store } from '../store';
import { openScrollLock, setOption } from './helper';
import { hotkeysMap } from './hotkeys';
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
import { handleTrackpadWheel } from './pointer';
import { constantScroll, scrollBy, scrollTo } from './scroll';
import { handleScrollModeZoom } from './scrollMode';
import {
  switchAutoScroll,
  switchDir,
  switchFillEffect,
  switchFullscreen,
  switchGridMode,
  switchOnePageMode,
  switchScrollMode,
} from './switch';
import { translateAll, translateCurrent, translateToEnd } from './translation';
import { handleEndTurnPage, turnPage } from './turnPage';
import { zoom } from './zoom';

export const handleMouseDown: EventHandler['on:mousedown'] = (e) => {
  if (e.button !== 1 || store.option.scrollMode.enabled) return;
  e.stopPropagation();
  e.preventDefault();
  switchFillEffect();
};

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
      return turnPage('prev');

    case 'page_down':
    case 'scroll_down':
      return turnPage('next');

    case 'scroll_left':
      return turnPage(handleSwapPageTurnKey(store.option.dir === 'rtl'));
    case 'scroll_right':
      return turnPage(handleSwapPageTurnKey(store.option.dir !== 'rtl'));

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
    case 'switch_grid_mode':
      return switchGridMode();

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

    case 'switch_auto_enlarge':
      return setOption((draftOption) => {
        draftOption.disableZoom = !draftOption.disableZoom;
      });

    case 'exit':
      return store.prop.onExit?.();

    // 阅读模式以外的快捷键转发到网页上去处理
    default:
      document.body.dispatchEvent(new KeyboardEvent('keydown', e));
      document.body.dispatchEvent(new KeyboardEvent('keyup', e));
  }
};

export const handleKeyDown = (e: KeyboardEvent) => {
  switch ((e.target as HTMLElement).tagName) {
    case 'INPUT':
    case 'TEXTAREA':
      return;
  }
  if ((e.target as HTMLElement).className === classes.hotkeysItem) return;

  const code = getKeyboardCode(e);

  // esc 在触发配置操作前，先用于退出一些界面
  if (e.key === 'Escape') {
    if (store.gridMode) {
      e.stopPropagation();
      e.preventDefault();
      return setState('gridMode', false);
    }

    if (store.show.endPage) {
      e.stopPropagation();
      e.preventDefault();
      return setState('show', 'endPage', undefined);
    }
  }

  // 处理标注了 data-only-number 的元素
  if ((e.target as HTMLElement).dataset.onlyNumber !== undefined) {
    // 拦截能输入数字外的按键
    if (/^(?:Shift \+ )?[a-zA-Z]$/.test(code)) {
      e.stopPropagation();
      e.preventDefault();
    }
    return;
  }

  // 卷轴、网格模式下跳过用于移动的原生按键
  if ((isScrollMode() || store.gridMode) && !store.show.endPage) {
    switch (e.key) {
      case 'Home':
      case 'End':
      case 'ArrowRight':
      case 'ArrowLeft':
        return e.stopPropagation();

      case 'ArrowUp':
      case 'PageUp':
        e.stopPropagation();
        if (isScrollMode()) return handleEndTurnPage('prev');
        return;

      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        e.stopPropagation();
        if (isScrollMode()) return handleEndTurnPage('next');
        return;
    }
  }

  // 拦截已注册的快捷键
  if (Reflect.has(hotkeysMap(), code)) {
    e.stopPropagation();
    e.preventDefault();
  } else return;

  handleHotkey(hotkeysMap()[code], e);
};

export const handleKeyUp = (e: KeyboardEvent) => {
  switch (hotkeysMap()[getKeyboardCode(e)]) {
    // 停止长按滚动
    case 'scroll_left':
    case 'scroll_right':
    case 'scroll_up':
    case 'scroll_down':
      return constantScroll.cancel();
  }
};

/** 判断两个数值是否是整数倍的关系 */
const isMultipleOf = (a: number, b: number) => {
  const decimal = `${a < b ? b / a : a / b}`.split('.')?.[1];
  return !decimal || decimal.startsWith('0000') || decimal.startsWith('9999');
};

let lastDeltaY = -1;
let timeoutId = 0;
let lastPageNum = -1;
let wheelType: undefined | 'trackpad' | 'mouse';
let equalNum = 0;
let diffNum = 0;

export const handleWheel = (e: WheelEvent) => {
  if (store.gridMode) return;
  e.stopPropagation();
  if (e.ctrlKey || e.altKey) e.preventDefault();

  const isWheelDown = e.deltaY > 0;
  const dir = isWheelDown ? 'next' : 'prev';
  const absDeltaY = Math.abs(e.deltaY);

  // 通过`两次滚动距离是否成倍数`和`滚动距离是否过小`来判断是否是触摸板
  if (
    wheelType !== 'trackpad' &&
    (absDeltaY < 5 ||
      (!Number.isInteger(lastDeltaY) &&
        !Number.isInteger(absDeltaY) &&
        !isMultipleOf(lastDeltaY, absDeltaY)))
  ) {
    wheelType = 'trackpad';
    if (timeoutId) clearTimeout(timeoutId);
    // 如果是触摸板滚动，且上次成功触发了翻页，就重新翻页回去
    if (lastPageNum !== -1) setState('activePageIndex', lastPageNum);
  }
  if (absDeltaY < 5) return;

  // 卷轴模式下的图片缩放
  if (
    (e.ctrlKey || e.altKey) &&
    isScrollMode() &&
    store.option.zoom.ratio === 100
  ) {
    e.preventDefault();
    return handleScrollModeZoom(isWheelDown ? 'sub' : 'add');
  }

  if (e.ctrlKey || e.altKey) {
    e.preventDefault();
    return zoom(store.option.zoom.ratio + (isWheelDown ? -25 : 25), e);
  }

  if (handleEndTurnPage(dir)) {
    openScrollLock();
    return e.preventDefault();
  }

  // 并排卷轴模式下
  if (isAbreastMode() && store.option.zoom.ratio === 100) {
    e.preventDefault();
    scrollBy(e.deltaY, true);
  }

  // 防止滚动到网页
  if (!isScrollMode()) e.preventDefault();

  // 为了避免因临时卡顿而误判为触摸板
  // 在连续几次滚动量均相同的情况下，将 wheelType 相关变量重置回初始状态
  if (diffNum < 10) {
    if (lastDeltaY === absDeltaY && absDeltaY > 5) equalNum += 1;
    else {
      diffNum += 1;
      equalNum = 0;
    }

    if (equalNum >= 3) {
      wheelType = undefined;
      lastPageNum = -1;
    }
  }

  lastDeltaY = absDeltaY;

  switch (wheelType) {
    case undefined: {
      if (lastPageNum === -1) {
        // 第一次触发滚动没法判断类型，就当作滚轮来处理
        // 但为了避免触摸板前两次滚动事件间隔大于帧生成时间导致得重新翻页回去的闪烁，加个延迟等待下
        lastPageNum = store.activePageIndex;
        timeoutId = window.setTimeout(turnPage, 16, dir);
        return;
      }
      wheelType = 'mouse';
    }
    // falls through

    case 'mouse':
      return turnPage(dir);

    case 'trackpad':
      return handleTrackpadWheel(e);
  }
};
