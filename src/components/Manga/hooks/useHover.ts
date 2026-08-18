import { inRange } from 'helper';
import { createSignal } from 'solid-js';

import { useEventListener } from './useEventListener';

export const useHover = (ref: () => HTMLElement | undefined) => {
  const [isHover, setIsHover] = createSignal(false);
  const on = useEventListener(ref);

  on('mouseenter', () => setIsHover(true));
  on('mouseleave', (e) => {
    const el = ref();
    if (!el) return;

    // 当元素 pointer-events: none 时，mouseleave 事件会误触发
    // 因此要再判断一下鼠标位置
    const rect = el.getBoundingClientRect();
    const stillInside =
      inRange(rect.left, e.clientX, rect.right) &&
      inRange(rect.top, e.clientY, rect.bottom);
    if (!stillInside) setIsHover(false);
  });

  return isHover;
};
