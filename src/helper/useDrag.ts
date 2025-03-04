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
  skip?: (e: PointerEvent | MouseEvent) => boolean;
  setCapture?: boolean;
};

export type UseDrag = (state: PointerState, e: PointerEvent) => void;

export const useDrag = ({
  ref,
  handleDrag,
  easyMode,
  handleClick,
  skip,
  setCapture,
  touches = new Map(),
}: UseDragOptions) => {
  onAutoMount(() => {
    const controller = new AbortController();
    const options = {
      capture: false,
      passive: true,
      signal: controller.signal,
    };

    let allowClick = -1;

    const handleDown = (e: PointerEvent) => {
      if (skip?.(e)) return;

      e.stopPropagation();
      if (!easyMode?.() && e.buttons !== 1) return;
      if (setCapture) ref.setPointerCapture(e.pointerId);

      const state = createPointerState(e);
      touches.set(e.pointerId, state);
      handleDrag(state, e);

      // 在时限内松手才触发 click 事件
      allowClick = window.setTimeout(() => {
        allowClick = 0;
      }, 300);
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

      // 拖拽一段距离后就不触发 click 了
      if (
        allowClick > 0 &&
        (Math.abs(e.clientX - state.initial[0]) > 5 ||
          Math.abs(e.clientY - state.initial[1]) > 5)
      ) {
        window.clearTimeout(allowClick);
        allowClick = -2;
      }
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
        allowClick &&
        touches.size === 0 &&
        approx(state.xy[0] - state.initial[0], 0, 5) &&
        approx(state.xy[1] - state.initial[1], 0, 5)
      )
        handleClick(e, state.target);
      window.clearTimeout(allowClick);

      handleDrag(state, e);
    };

    const handleCancel = (e: PointerEvent) => {
      e.stopPropagation();
      ref.releasePointerCapture(e.pointerId);
      const state = touches.get(e.pointerId);
      if (!state) return;

      state.type = 'cancel';
      handleDrag(state, e);
      touches.clear();
    };

    ref.addEventListener('pointerdown', handleDown, options);
    ref.addEventListener('pointermove', handleMove, {
      ...options,
      passive: false,
    });
    ref.addEventListener('pointerup', handleUp, options);
    ref.addEventListener('pointercancel', handleCancel, options);

    if (easyMode) {
      ref.addEventListener('pointerover', handleDown, options);
      ref.addEventListener('pointerout', handleUp, options);
    }

    ref.addEventListener(
      'click',
      (e) => {
        if ((allowClick > 0 && touches.size === 0) || skip?.(e)) return;
        e.stopPropagation();
        e.preventDefault();
      },
      { capture: true },
    );

    return () => controller.abort();
  });
};
