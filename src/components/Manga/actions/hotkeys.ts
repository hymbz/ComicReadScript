import { createSignal } from 'solid-js';
import { createRootMemo } from 'helper';

import { store } from '../store';

export const [defaultHotkeys, setDefaultHotkeys] = createSignal<
  Record<string, string[]>
>({
  scroll_up: ['w', 'ArrowUp'],
  scroll_down: ['s', 'ArrowDown', ' '],
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
  fullscreen: [''],
});

/** 快捷键配置 */
export const hotkeysMap = createRootMemo(() =>
  Object.fromEntries(
    Object.entries(store.hotkeys).flatMap(([name, key]) =>
      key.map((k) => [k, name]),
    ),
  ),
);
