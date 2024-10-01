import { onAutoMount } from './solidJs';
import { approx } from './other';

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

  // 受 setPointerCapture 影响，除 down 外其他事件拿不到正确的 target，需要手动存一下
  /** 触发元素 */
  target: HTMLElement;
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
    target: e.target as HTMLElement,
  };
};

type UseDragOptions = {
  ref: HTMLElement;
  handleDrag: UseDrag;
  easyMode?: () => boolean;
  handleClick?: (e: PointerEvent, target: HTMLElement) => boolean | void;
  touches?: Map<number, PointerState>;
  skip?: (e: PointerEvent) => boolean;
};

export type UseDrag = (state: PointerState, e: PointerEvent) => void;

export const useDrag = ({
  ref,
  handleDrag,
  easyMode,
  handleClick,
  skip,
  touches = new Map(),
}: UseDragOptions) => {
  onAutoMount(() => {
    const controller = new AbortController();
    const options = {
      capture: false,
      passive: true,
      signal: controller.signal,
    };

    const handleDown = (e: PointerEvent) => {
      if (skip?.(e)) return;

      e.stopPropagation();
      if (!easyMode?.() && e.buttons !== 1) return;
      ref.setPointerCapture(e.pointerId);

      const state = createPointerState(e);
      touches.set(e.pointerId, state);
      handleDrag(state, e);
    };

    const handleMove = (e: PointerEvent) => {
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
        performance.now() - state.startTime < 300
      )
        handleClick(e, state.target);

      handleDrag(state, e);
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
      },
      { capture: false, passive: true, signal: controller.signal },
    );

    if (easyMode) {
      ref.addEventListener('pointerover', handleDown, options);
      ref.addEventListener('pointerout', handleUp, options);
    }

    return () => controller.abort();
  });
};
