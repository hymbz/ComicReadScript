import { createSignal } from 'solid-js';
import { createRootMemo } from 'helper';

import { store } from '../store';

export const [defaultHotkeys, setDefaultHotkeys] = createSignal<
  Record<string, string[]>
>({
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
});

/** 快捷键配置 */
export const hotkeysMap = createRootMemo(() =>
  Object.fromEntries(
    Object.entries(store.hotkeys).flatMap(([name, key]) =>
      key.map((k) => [k, name]),
    ),
  ),
);
