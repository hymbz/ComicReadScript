import { onCleanup, onMount } from 'solid-js';

import { focus } from './useStore/slice';

export interface UseDragState {
  /** 事件类型 */
  type: 'start' | 'dragging' | 'end';
  /** 触发时的 xy 位置 */
  xy: [number, number];
  /** 手势开始时的 xy 位置 */
  initial: [number, number];
  /** 手势开始时间 */
  startTime: number;
}

export type UseDrag = (state: UseDragState, e: MouseEvent) => void;

const initStata = (): UseDragState => ({
  type: 'start',
  xy: [0, 0],
  initial: [0, 0],
  startTime: 0,
});

export const useDrag = (
  ref: HTMLElement,
  handleDrag: UseDrag,
  easyMode: () => boolean = () => false,
) => {
  let state = initStata();

  onMount(() => {
    const controller = new AbortController();

    if (ref) {
      // 在鼠标、手指按下后切换状态
      ref.addEventListener(
        'pointerdown',
        (e) => {
          e.stopPropagation();
          // 只处理左键按下触发的事件
          if (e.buttons !== 1) return;

          state.type = 'start';
          state.xy = [e.x, e.y];
          state.initial = [e.x, e.y];
          state.startTime = Date.now();
          handleDrag(state, e);
        },
        { capture: false, passive: true, signal: controller.signal },
      );

      // 在鼠标、手指移动时根据状态判断是否要触发函数
      ref.addEventListener(
        'pointermove',
        (e) => {
          e.stopPropagation();
          e.preventDefault();
          if (!easyMode() && (state.startTime === 0 || e.buttons !== 1)) return;

          state.type = 'dragging';
          state.xy = [e.x, e.y];
          handleDrag(state, e);
        },
        { capture: false, passive: false, signal: controller.signal },
      );

      // 在鼠标、手指松开后切换状态
      ref.addEventListener(
        'pointerup',
        (e) => {
          e.stopPropagation();
          if (state.startTime === 0) return;

          state.type = 'end';
          state.xy = [e.x, e.y];
          handleDrag(state, e);
          state = initStata();
          focus();
        },
        { capture: false, passive: true, signal: controller.signal },
      );
    }

    onCleanup(() => controller.abort());
  });
};
