import { getKeyboardCode } from 'helper';
import { store, refs, _setState } from '../store';
import { handleTrackpadWheel } from './pointer';
import { zoomScrollModeImg } from './image';
import { scrollTo, setOption } from './helper';
import { hotkeysMap } from './hotkeys';
import { zoom } from './zoom';
import { closeScrollLock, turnPage } from './turnPage';
import {
  switchFillEffect,
  switchScrollMode,
  switchOnePageMode,
  switchDir,
  switchGridMode,
} from './switch';

import classes from '../index.module.css';
import { activePage, rootSize, scrollTop } from './memo';
import { setImgTranslationEnbale } from './translation';

// 特意使用 requestAnimationFrame 和 .click() 是为了能和 Vimium 兼容
export const focus = () =>
  requestAnimationFrame(() => {
    refs.mangaBox?.click();
    refs.mangaBox?.focus();
  });

export const handleMouseDown: EventHandler['on:mousedown'] = (e) => {
  if (e.button !== 1 || store.option.scrollMode) return;
  e.stopPropagation();
  e.preventDefault();
  switchFillEffect();
};

/** 卷轴模式下的滚动 */
const scrollModeScroll = (dir: 'next' | 'prev') => {
  if (!store.show.endPage) {
    scrollTo(scrollTop() + rootSize().height * 0.8 * (dir === 'next' ? 1 : -1));
    _setState('flag', 'scrollLock', true);
  }
  closeScrollLock();
};

/** 根据是否开启了 左右翻页键交换 来切换翻页方向 */
const handleSwapPageTurnKey = (nextPage: boolean) => {
  const next = store.option.swapPageTurnKey ? !nextPage : nextPage;
  return next ? 'next' : 'prev';
};

/** 判断按键代码是否可以输入字母 */
const isAlphabetKey = /^(Shift \+ )?[a-zA-Z]$/;

export const handleKeyDown = (e: KeyboardEvent) => {
  if (
    (e.target as HTMLElement).tagName === 'INPUT' ||
    (e.target as HTMLElement).className === classes.hotkeysItem
  )
    return;

  const code = getKeyboardCode(e);

  // esc 在触发配置操作前，先用于退出一些界面
  if (e.key === 'Escape') {
    if (store.gridMode) {
      e.stopPropagation();
      e.preventDefault();
      return _setState('gridMode', false);
    }
    if (store.show.endPage) {
      e.stopPropagation();
      e.preventDefault();
      return _setState('show', 'endPage', undefined);
    }
  }

  // 处理标注了 data-only-number 的元素
  if ((e.target as HTMLElement).getAttribute('data-only-number') !== null) {
    // 拦截能输入数字外的按键
    if (isAlphabetKey.test(code)) {
      e.stopPropagation();
      e.preventDefault();
    } else if (code.includes('Enter')) (e.target as HTMLElement).blur();
    return;
  }

  // 卷轴、网格模式下跳过用于移动的按键
  if ((store.option.scrollMode || store.gridMode) && !store.show.endPage) {
    switch (e.key) {
      case 'Home':
      case 'End':
      case 'ArrowRight':
      case 'ArrowLeft':
        e.stopPropagation();
        return;

      case 'ArrowUp':
      case 'PageUp':
        e.stopPropagation();
        return store.gridMode || turnPage('prev');

      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        e.stopPropagation();
        return store.gridMode || turnPage('next');
    }
  }

  // 拦截已注册的快捷键
  if (Reflect.has(hotkeysMap(), code)) {
    e.stopPropagation();
    e.preventDefault();
  }

  switch (hotkeysMap()[code]) {
    case 'turn_page_up': {
      if (store.option.scrollMode) scrollModeScroll('prev');
      return turnPage('prev');
    }
    case 'turn_page_down': {
      if (store.option.scrollMode) scrollModeScroll('next');
      return turnPage('next');
    }

    case 'turn_page_right':
      return turnPage(handleSwapPageTurnKey(store.option.dir !== 'rtl'));
    case 'turn_page_left':
      return turnPage(handleSwapPageTurnKey(store.option.dir === 'rtl'));

    case 'jump_to_home':
      return _setState('activePageIndex', 0);
    case 'jump_to_end':
      return _setState('activePageIndex', store.pageList.length - 1);

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
      if (store.option.translation.server !== 'disable')
        return setImgTranslationEnbale(
          activePage(),
          !activePage().some(
            (i) =>
              store.imgList[i]?.translationType &&
              store.imgList[i].translationType !== 'hide',
          ),
        );
      break;

    case 'switch_auto_enlarge':
      return setOption((draftOption) => {
        draftOption.disableZoom = !draftOption.disableZoom;
      });

    case 'exit':
      return store.prop.Exit?.();
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
  e.stopPropagation();
  if (e.ctrlKey || e.altKey) e.preventDefault();
  if (store.flag.scrollLock || e.deltaY === 0) return closeScrollLock();
  const isWheelDown = e.deltaY > 0;

  if (store.show.endPage) return turnPage(isWheelDown ? 'next' : 'prev');

  // 卷轴模式下的图片缩放
  if (
    (e.ctrlKey || e.altKey) &&
    store.option.scrollMode &&
    store.zoom.scale === 100
  ) {
    e.preventDefault();
    if (store.option.scrollModeFitToWidth) return;
    return zoomScrollModeImg(isWheelDown ? -0.1 : 0.1);
  }

  if (e.ctrlKey || e.altKey || store.zoom.scale !== 100) {
    e.preventDefault();
    return zoom(store.zoom.scale + (isWheelDown ? -25 : 25), e);
  }

  const nowDeltaY = Math.abs(e.deltaY);

  // 通过判断`两次滚动距离是否成倍数`和`滚动距离是否过小`来判断是否是触摸板
  if (
    wheelType !== 'trackpad' &&
    (nowDeltaY < 2 ||
      (!Number.isInteger(lastDeltaY) &&
        !Number.isInteger(nowDeltaY) &&
        !isMultipleOf(lastDeltaY, nowDeltaY)))
  ) {
    wheelType = 'trackpad';
    if (timeoutId) clearTimeout(timeoutId);
    // 如果是触摸板滚动，且上次成功触发了翻页，就重新翻页回去
    if (lastPageNum !== -1) _setState('activePageIndex', lastPageNum);
  }

  // 为了避免因临时卡顿而误判为触摸板
  // 在连续几次滚动量均相同的情况下，将 wheelType 相关变量重置回初始状态
  if (diffNum < 10) {
    if (lastDeltaY === nowDeltaY && nowDeltaY > 5) equalNum += 1;
    else {
      diffNum += 1;
      equalNum = 0;
    }
    if (equalNum >= 3) {
      wheelType = undefined;
      lastPageNum = -1;
    }
  }

  lastDeltaY = nowDeltaY;

  switch (wheelType) {
    case undefined: {
      if (lastPageNum === -1) {
        // 第一次触发滚动没法判断类型，就当作滚轮来处理
        // 但为了避免触摸板前两次滚动事件间隔大于帧生成时间导致得重新翻页回去的闪烁，加个延迟等待下
        lastPageNum = store.activePageIndex;
        timeoutId = window.setTimeout(
          () => turnPage(isWheelDown ? 'next' : 'prev'),
          16,
        );
        return;
      }
      wheelType = 'mouse';
    }
    // falls through

    case 'mouse':
      return turnPage(isWheelDown ? 'next' : 'prev');

    case 'trackpad':
      return handleTrackpadWheel(e);
  }
};
