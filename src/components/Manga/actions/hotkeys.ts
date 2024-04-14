import { isEqual } from 'helper';
import { createRootMemo } from 'helper/solidJs';

import { _setState, store } from '../store';

export const defaultHotkeys: Readonly<Record<string, string[]>> = {
  turn_page_up: ['w', 'ArrowUp', 'PageUp', 'Shift + W'],
  turn_page_down: [' ', 's', 'ArrowDown', 'PageDown', 'Shift + S'],
  turn_page_right: ['d', '.', 'ArrowRight'],
  turn_page_left: ['a', ',', 'ArrowLeft'],
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
  Object.entries(store.hotkeys).forEach(([name, keys]) => {
    const i = keys.indexOf(code);
    if (i === -1) return;

    const newKeys = [...store.hotkeys[name]];
    newKeys.splice(i, 1);
    setHotkeys(name, newKeys);
  });
};
