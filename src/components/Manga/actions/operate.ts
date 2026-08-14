import { getKeyboardCode } from 'helper';

import classes from '../index.module.css';
import { setState, store } from '../store';
import { handleEndTurnPage } from './endPage';
import { handleHotkey } from './hotkeyAction';
import { hotkeysMap } from './hotkeys';
import { isScrollMode } from './memo';
import { constantScroll } from './scroll';
import { switchFillEffect } from './switch';

export const handleMouseDown: EventHandler['on:mousedown'] = (e) => {
  if (e.button !== 1 || store.option.scrollMode.enabled) return;
  e.stopPropagation();
  e.preventDefault();
  switchFillEffect();
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
