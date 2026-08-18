import { debounce } from 'helper';
import { createSignal } from 'solid-js';

import { useEventListener } from './useEventListener';

/** 在鼠标静止一段时间后自动隐藏 */
export const useHiddenMouse = (ref: () => HTMLElement | undefined) => {
  const [hiddenMouse, setHiddenMouse] = createSignal(true);
  const on = useEventListener(ref);

  const hidden = debounce(() => setHiddenMouse(true), 1000);

  on('mousemove', () => {
    setHiddenMouse(false);
    hidden();
  });

  // 鼠标离开元素时恢复原样
  on('mouseleave', () => {
    hidden.clear();
    setHiddenMouse(false);
  });

  return hiddenMouse;
};
