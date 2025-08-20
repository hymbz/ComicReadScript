import { getKeyboardCode } from 'helper';

import classes from '../index.module.css';
import { refs, setState, store } from '../store';
import { abreastScrollFill, setAbreastScrollFill } from './abreastScroll';
import { setOption } from './helper';
import { hotkeysMap } from './hotkeys';
import { isAbreastMode, isScrollMode, scrollTop } from './memo';
import { handleTrackpadWheel } from './pointer';
import {
  constantScroll,
  scrollLength,
  scrollProgress,
  scrollTo,
  zoomScrollModeImg,
} from './scroll';
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
import { closeScrollLock, turnPage } from './turnPage';
import { zoom } from './zoom';

// 特意使用 requestAnimationFrame 和 .click() 是为了能和 Vimium 兼容
// （虽然因为使用了 shadow dom 的缘故实际还是不能兼容，但说不定之后就改了呢
export const focus = () =>
  requestAnimationFrame(() => {
    refs.mangaBox?.click();
    refs.mangaBox?.focus();
  });

export const handleMouseDown: EventHandler['on:mousedown'] = (e) => {
  if (e.button !== 1 || store.option.scrollMode.enabled) return;
  e.stopPropagation();
  e.preventDefault();
  switchFillEffect();
};

/** 卷轴模式下的页面滚动 */
export const scrollModeScrollPage = (x: number) => {
  if (!store.show.endPage) {
    scrollTo(scrollTop() + x, true);
    setState('scrollLock', true);
  }
  turnPage(x > 0 ? 'next' : 'prev');
  closeScrollLock();
};

/** 根据是否开启了 左右翻页键交换 来切换翻页方向 */
const handleSwapPageTurnKey = (nextPage: boolean) => {
  const next = store.option.swapPageTurnKey ? !nextPage : nextPage;
  return next ? 'next' : 'prev';
};

/** 处理快捷键长按的情况 */
export const handleHoldKey = new (class {
  holdKeys = new Map<string, () => void>();

  linsten(code: string, holdFn: () => void, upFn: () => void) {
    if (this.holdKeys.has(code)) return;
    holdFn();
    this.holdKeys.set(code, upFn);
  }

  onKeyUp = (e: KeyboardEvent) => {
    const code = getKeyboardCode(e);
    if (!this.holdKeys.has(code)) return;
    this.holdKeys.get(code)!();
    this.holdKeys.delete(code);
  };
})();

/** 处理长按滚动 */
const handleHoldScroll = (code: string, speed: number) => {
  handleHoldKey.linsten(
    code,
    () => constantScroll.start(speed),
    () => constantScroll.cancel(),
  );
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

  // 卷轴、网格模式下跳过用于移动的按键
  if ((isScrollMode() || store.gridMode) && !store.show.endPage) {
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
  } else return;

  const hotkey = hotkeysMap()[code];

  // 并排卷轴模式下的快捷键
  if (isAbreastMode()) {
    switch (hotkey) {
      case 'scroll_up':
        return setAbreastScrollFill(abreastScrollFill() - 40);
      case 'scroll_down':
        return setAbreastScrollFill(abreastScrollFill() + 40);

      case 'scroll_left':
        return scrollTo(
          scrollProgress() - (store.option.dir === 'rtl' ? 40 : -40),
        );
      case 'scroll_right':
        return scrollTo(
          scrollProgress() + (store.option.dir === 'rtl' ? 40 : -40),
        );

      case 'page_up':
        return scrollTo(scrollProgress() - store.rootSize.width * 0.8);
      case 'page_down':
        return scrollTo(scrollProgress() + store.rootSize.width * 0.8);

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
        return scrollModeScrollPage(-store.rootSize.height * 0.8);
      case 'page_down':
        return scrollModeScrollPage(store.rootSize.height * 0.8);

      case 'scroll_up':
        if (e.repeat) return handleHoldScroll(code, -1);
        return scrollModeScrollPage(-40);
      case 'scroll_down':
        if (e.repeat) return handleHoldScroll(code, 1);
        return scrollModeScrollPage(40);
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

  if (store.show.endPage) return turnPage(isWheelDown ? 'next' : 'prev');

  // 卷轴模式下的图片缩放
  if (
    (e.ctrlKey || e.altKey) &&
    store.option.scrollMode.enabled &&
    store.option.zoom.ratio === 100
  ) {
    e.preventDefault();
    if (store.option.scrollMode.fitToWidth) return;
    return zoomScrollModeImg(isWheelDown ? -0.05 : 0.05);
  }

  if (e.ctrlKey || e.altKey) {
    e.preventDefault();
    return zoom(store.option.zoom.ratio + (isWheelDown ? -25 : 25), e);
  }

  const nowDeltaY = Math.abs(e.deltaY);

  // 并排卷轴模式下
  if (isAbreastMode() && store.option.zoom.ratio === 100) {
    e.preventDefault();
    // 先触发翻页判断再滚动，防止在滚动到底时立刻触发结束页
    turnPage(isWheelDown ? 'next' : 'prev');
    scrollTo(scrollTop() + e.deltaY);
  }

  // 防止滚动到网页
  if (!isScrollMode()) e.preventDefault();

  // 通过`两次滚动距离是否成倍数`和`滚动距离是否过小`来判断是否是触摸板
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
    if (lastPageNum !== -1) setState('activePageIndex', lastPageNum);
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
