import { throttle } from 'throttle-debounce';
import createPanZoom from 'panzoom';
import type { State } from '..';

export const initPanzoom = (state: State) => {
  // 销毁之前可能创建过的实例
  state.panzoom?.dispose();

  const panzoom = createPanZoom(state.mangaFlowRef!, {
    // 边界限制
    bounds: true,
    boundsPadding: 1,
    // 禁止缩小
    minZoom: 1,
    // 禁用默认的双击缩放
    zoomDoubleClickSpeed: 1,

    // 忽略键盘事件
    filterKey: () => true,

    beforeWheel(e) {
      const { scale } = panzoom.getTransform();
      // 图片不处于放大状态时，必须按下 Alt 键才能通过滚轮缩放
      if (e.altKey && scale === 1) return false;
      // 图片处于放大状态时，可以直接通过滚轮缩放
      if (scale !== 1) return false;
      return true;
    },
    beforeMouseDown(e) {
      // 按下「alt 键」或「处于放大状态」时才允许拖动
      return !(e.altKey || panzoom.getTransform().scale !== 1);
    },
    onTouch() {
      // 未进行缩放时不捕捉 touch 事件
      return state.isZoomed;
    },
  });

  panzoom.on('transform', () => {
    if (!state.isZoomed) {
      // 防止在放大模式下通过滚轮缩小至原尺寸后立刻跳转至下一页
      if (state.scrollLock) {
        window.setTimeout(() => {
          state.scrollLock = false;
        }, 500);
      }
    } else if (!state.scrollLock) {
      state.scrollLock = true;
    }
  });

  panzoom.on(
    'zoom',
    throttle(200, () => {
      state.isZoomed = panzoom.getTransform().scale !== 1;
    }),
  );

  state.panzoom = panzoom;
};
