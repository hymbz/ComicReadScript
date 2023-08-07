import { createMemo, createRoot } from 'solid-js';
import { _setState, store } from '..';
import { defaultHoeKeys } from '../OtherState';
import { isEqualArray } from '../../../../../helper';

export const setHotKeys = (...args: any[]) => {
  _setState.apply(this, ['hotKeys', ...args] as never);
  store.onHotKeysChange?.(
    Object.fromEntries(
      Object.entries(store.hotKeys).filter(
        ([name, keys]) =>
          !defaultHoeKeys[name] || !isEqualArray(keys, defaultHoeKeys[name]),
      ),
    ),
  );
};

export const { hotKeysMap } = createRoot(() => {
  const hotKeysMapMemo = createMemo(() =>
    Object.fromEntries(
      Object.entries(store.hotKeys).flatMap(([name, key]) =>
        key.map((k) => [k, name]),
      ),
    ),
  );

  return {
    /** 快捷键配置 */
    hotKeysMap: hotKeysMapMemo,
  };
});

/** 删除指定快捷键 */
export const delHotKeys = (code: string) => {
  Object.entries(store.hotKeys).forEach(([name, keys]) => {
    const i = keys.indexOf(code);
    if (i === -1) return;

    const newKeys = [...store.hotKeys[name]];
    newKeys.splice(i, 1);
    setHotKeys(name, newKeys);
  });
};
