import { onCleanup, onMount } from 'solid-js';

import { approx } from 'helper';
import { focus } from '../actions';

export interface PointerState {
  id: number;
  /** 事件类型 */
  type: 'down' | 'move' | 'up' | 'cancel';
  /** 触发时的 xy 位置 */
  xy: [number, number];
  /** 手势开始时的 xy 位置 */
  initial: [number, number];
  /** 上次触发时的 xy 位置 */
  last: [number, number];
  /** 手势开始时间 */
  startTime: number;
}

const createPointerState = (
  e: PointerEvent,
  type: PointerState['type'] = 'down',
): PointerState => {
  const xy = [e.clientX, e.clientY] as [number, number];
  return {
    id: e.pointerId,
    type,
    xy,
    initial: xy,
    last: xy,
    startTime: performance.now(),
  };
};

type UseDragOptions = {
  ref: HTMLElement;
  handleDrag: UseDrag;
  easyMode?: () => boolean;
  handleClick?: (e: PointerEvent) => boolean | void;
  touches?: Map<number, PointerState>;
};

export type UseDrag = (state: PointerState, e: PointerEvent) => void;

export const useDrag = ({
  ref,
  handleDrag,
  easyMode,
  handleClick,
  touches = new Map(),
}: UseDragOptions) => {
  onMount(() => {
    const controller = new AbortController();
    const options = {
      capture: false,
      passive: true,
      signal: controller.signal,
    };

    const handleDown = (e: PointerEvent) => {
      e.stopPropagation();
      ref.setPointerCapture(e.pointerId);
      if (!easyMode?.() && e.buttons !== 1) return;

      const state = createPointerState(e);
      touches.set(e.pointerId, state);
      handleDrag(state, e);
    };

    const handleMove = (e: PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();

      if (!easyMode?.() && e.buttons !== 1) return;

      const state = touches.get(e.pointerId);
      if (!state) return;

      state.type = 'move';
      state.xy = [e.clientX, e.clientY];

      handleDrag(state, e);

      state.last = state.xy;
    };

    const handleUp = (e: PointerEvent) => {
      e.stopPropagation();
      ref.releasePointerCapture(e.pointerId);
      const state = touches.get(e.pointerId);
      if (!state) return;
      touches.delete(e.pointerId);

      state.type = 'up';
      state.xy = [e.clientX, e.clientY];

      // 判断单击
      if (
        handleClick &&
        touches.size === 0 &&
        approx(state.xy[0] - state.initial[0], 0, 5) &&
        approx(state.xy[1] - state.initial[1], 0, 5) &&
        performance.now() - state.startTime < 200
      )
        handleClick(e);

      handleDrag(state, e);
      focus();
    };

    ref.addEventListener('pointerdown', handleDown, options);

    ref.addEventListener('pointermove', handleMove, {
      ...options,
      passive: false,
    });

    ref.addEventListener('pointerup', handleUp, options);

    ref.addEventListener(
      'pointercancel',
      (e) => {
        e.stopPropagation();
        const state = touches.get(e.pointerId);
        if (!state) return;

        state.type = 'cancel';
        handleDrag(state, e);
        touches.clear();
        focus();
      },
      { capture: false, passive: true, signal: controller.signal },
    );

    if (easyMode) {
      ref.addEventListener('pointerover', handleDown, options);
      ref.addEventListener('pointerout', handleUp, options);
    }

    onCleanup(() => controller.abort());
  });
};
