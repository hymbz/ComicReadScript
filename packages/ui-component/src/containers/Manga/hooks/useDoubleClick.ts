import type { MouseEventHandler } from 'react';
import { useCallback, useRef } from 'react';

export const useDoubleClick = (
  click: MouseEventHandler,
  doubleClick?: MouseEventHandler,
  timeout = 200,
): MouseEventHandler => {
  const clickTimeout = useRef<number | null>(null);

  return useCallback<MouseEventHandler>(
    (event) => {
      // 如果点击触发时还有上次计时器的记录，说明这次是双击
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
        clickTimeout.current = null;
        doubleClick?.(event);
        return;
      }

      // 单击事件延迟触发
      clickTimeout.current = window.setTimeout(() => {
        click(event);
        clickTimeout.current = null;
      }, timeout);
    },
    [click, doubleClick, timeout],
  );
};
