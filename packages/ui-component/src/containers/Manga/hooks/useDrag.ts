import type { RefObject } from 'react';
import { useRef, useEffect, useState } from 'react';

export const useDrag = (
  ref: RefObject<HTMLElement>,
  handle: (x: number, y: number) => void,
) => {
  const down = useRef(false);
  useEffect(() => {
    if (ref.current) {
      // 在鼠标、手指按下后切换状态
      ref.current.addEventListener('mousedown', (e) => {
        down.current = true;
        handle(e.x, e.y);
      });
      // ref.current.addEventListener('touchstart', () => {
      //   down.current = true;
      // });

      // 在鼠标、手指移动时根据状态判断是否要触发函数
      ref.current.addEventListener('mousemove', (e) => {
        if (!down.current) return;
        handle(e.x, e.y);
      });

      // 在鼠标、手指松开后切换状态
      ref.current.addEventListener('mouseup', (e) => {
        down.current = false;
      });
    }

    // TODO: 卸载处理
  }, [handle, ref]);
};
