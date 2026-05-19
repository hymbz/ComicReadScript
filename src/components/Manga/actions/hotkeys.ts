import { createRootMemo, getKeyboardCode } from 'helper';
import { createSignal } from 'solid-js';

import { store } from '../store';

export const [defaultHotkeys, setDefaultHotkeys] = createSignal<
  Record<string, string[]>
>({
  scroll_up: ['w', 'ArrowUp'],
  scroll_down: ['s', 'ArrowDown'],
  scroll_left: ['a', 'Shift + a', ',', 'ArrowLeft'],
  scroll_right: ['d', 'Shift + d', '.', 'ArrowRight'],
  page_up: ['PageUp', 'Shift + w'],
  page_down: [' ', 'PageDown', 'Shift + s'],
  jump_to_home: ['Home'],
  jump_to_end: ['End'],
  exit: ['Escape'],
  switch_page_fill: ['/', 'm', 'z'],
  switch_scroll_mode: [],
  switch_grid_mode: [],
  switch_single_double_page_mode: [],
  switch_dir: [],
  switch_auto_enlarge: [],
  translate_current_page: [],
  translate_all: [],
  translate_to_end: [],
  fullscreen: [],
  auto_scroll: [],
  jump_next: [],
  jump_prev: [],
  reload_current_error_img: ['r'],
});

/** 快捷键配置 */
export const hotkeysMap = createRootMemo(() =>
  Object.fromEntries(
    Object.entries(store.hotkeys).flatMap(([name, key]) =>
      key.map((k) => [k, name]),
    ),
  ),
);

type ActionsMap = Record<string, (e: KeyboardEvent) => unknown>;
const actionsMap: Record<'bubble' | 'capture', ActionsMap | null> = {
  bubble: null,
  capture: null,
};

const createKeydownHandler =
  (type: 'bubble' | 'capture') => (e: KeyboardEvent) => {
    const actions = actionsMap[type];
    if (!actions) return;

    // 跳过输入框的键盘事件
    switch ((e.target as HTMLElement).tagName) {
      case 'INPUT':
      case 'TEXTAREA':
        return;
    }
    if ((e.target as HTMLElement).isContentEditable) return;

    if (Reflect.has(actions, e.key)) {
      if (actions[e.key](e) === 'SKIP') return;
      e.stopPropagation();
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }

    const hotkeyName = hotkeysMap()[getKeyboardCode(e)];
    if (Reflect.has(actions, hotkeyName)) {
      if (actions[hotkeyName](e) === 'SKIP') return;
      e.stopPropagation();
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  };

const handlers = {
  bubble: createKeydownHandler('bubble'),
  capture: createKeydownHandler('capture'),
};

/** 监听快捷键 */
export const listenHotkey = (
  actions: ActionsMap,
  capture?: boolean,
): (() => void) => {
  const type = capture ? 'capture' : 'bubble';

  if (actionsMap[type]) Object.assign(actionsMap[type], actions);
  else {
    actionsMap[type] = { ...actions };
    window.addEventListener('keydown', handlers[type], { capture });
  }

  return () => {
    window.removeEventListener('keydown', handlers[type], { capture });
    actionsMap[type] = null;
  };
};
