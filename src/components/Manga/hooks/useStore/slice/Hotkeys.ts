import { createMemo, createRoot } from 'solid-js';
import { isEqualArray } from 'helper';
import { _setState, store } from '..';
import { defaultHotkeys } from '../OtherState';

export const setHotkeys = (...args: any[]) => {
  _setState.apply(this, ['hotkeys', ...args] as never);
  store.prop.HotkeysChange?.(
    Object.fromEntries(
      Object.entries(store.hotkeys).filter(
        ([name, keys]) =>
          !defaultHotkeys[name] || !isEqualArray(keys, defaultHotkeys[name]),
      ),
    ),
  );
};

export const { hotkeysMap } = createRoot(() => {
  const hotkeysMapMemo = createMemo(() =>
    Object.fromEntries(
      Object.entries(store.hotkeys).flatMap(([name, key]) =>
        key.map((k) => [k, name]),
      ),
    ),
  );

  return {
    /** 快捷键配置 */
    hotkeysMap: hotkeysMapMemo,
  };
});

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
