import type { Draft } from 'immer/dist/internal';
import type { PanZoom } from 'panzoom';
import createPanZoom from 'panzoom';
import type { SelfStateCreator } from '.';

export interface ExternalLibSlice {
  panzoom?: Draft<PanZoom>;

  initPanzoom: () => void;
}

export const externalLibSlice: SelfStateCreator<ExternalLibSlice> = (
  set,
  get,
) => ({
  panzoom: undefined as unknown as Draft<PanZoom>,

  initPanzoom: (): void => {
    const { mangaFlowRef } = get();

    set((state) => {
      // 销毁之前可能创建过的实例
      state.panzoom?.dispose();

      const panzoom = createPanZoom(mangaFlowRef.current!, {
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
          const { scale } = panzoom.getTransform();
          return scale !== 1;
        },
      });

      panzoom.on('transform', () => {
        if (panzoom.getTransform().scale === 1) {
          const { scrollLock } = get();
          // 防止在放大模式下通过滚轮缩小至原尺寸后立刻跳转至下一页
          if (scrollLock)
            setTimeout(() => {
              set((draftState) => {
                draftState.scrollLock = false;
              });
            }, 500);
        } else {
          const { scrollLock } = get();
          if (!scrollLock)
            set((draftState) => {
              draftState.scrollLock = true;
            });
        }
      });

      state.panzoom = panzoom;
    });
  },
});
