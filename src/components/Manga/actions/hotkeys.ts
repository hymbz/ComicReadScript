import { isEqual } from 'helper';
import { createRootMemo } from 'helper/solidJs';

import { _setState, store } from '../store';

export const defaultHotkeys: Readonly<Record<string, string[]>> = {
  scroll_up: ['w', 'Shift + W', 'ArrowUp'],
  scroll_down: ['s', 'Shift + S', 'ArrowDown', ' '],
  scroll_left: ['a', 'Shift + A', ',', 'ArrowLeft'],
  scroll_right: ['d', 'Shift + D', '.', 'ArrowRight'],
  page_up: ['PageUp'],
  page_down: [' ', 'PageDown'],
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
};

export const setHotkeys = (...args: any[]) => {
  _setState(...(['hotkeys', ...args] as [any]));
  store.prop.HotkeysChange?.(
    Object.fromEntries(
      Object.entries(store.hotkeys).filter(
        ([name, keys]) =>
          !defaultHotkeys[name] || !isEqual(keys, defaultHotkeys[name]),
      ),
    ),
  );
};

/** 快捷键配置 */
export const hotkeysMap = createRootMemo(() =>
  Object.fromEntries(
    Object.entries(store.hotkeys).flatMap(([name, key]) =>
      key.map((k) => [k, name]),
    ),
  ),
);

/** 删除指定快捷键 */
export const delHotkeys = (code: string) => {
  for (const [name, keys] of Object.entries(store.hotkeys)) {
    const i = keys.indexOf(code);
    if (i === -1) return;

    const newKeys = [...store.hotkeys[name]];
    newKeys.splice(i, 1);
    setHotkeys(name, newKeys);
  }
};
