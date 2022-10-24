import type { Draft } from 'immer/dist/internal';
import type { PanZoom } from 'panzoom';
import createPanZoom from 'panzoom';
import classes from '../../index.module.css';
import type { SelfStateCreator } from '.';

export interface ExternalLibSlice {
  panzoom?: Draft<PanZoom>;

  initPanzoom: () => void;
}

export const externalLibSlice: SelfStateCreator<ExternalLibSlice> = (set, get) => ({
  panzoom: undefined as unknown as Draft<PanZoom>,

  initPanzoom: (): void => {
    const { rootRef } = get();

    const mangaFlowDom = rootRef?.current?.querySelector<HTMLElement>(
      `.${classes.mangaFlow}`,
    );
    if (!mangaFlowDom) {
      console.error('Dom 未渲染');
      return;
    }

    set((state) => {
      // 销毁之前可能创建过的实例
      state.panzoom?.dispose();

      const panzoom = createPanZoom(mangaFlowDom, {
        // 禁用键盘
        disableKeyboardInteraction: true,
        // 边界限制
        bounds: true,
        boundsPadding: 1,
        // 禁止缩小
        minZoom: 1,
        // 禁用默认的双击缩放
        zoomDoubleClickSpeed: 1,

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
      });

      panzoom.on('transform', (e: PanZoom) => {
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

      // // TODO: 防止移动端上的滑动页面操作被 panzoom 捕捉处理
      // swiper.on('touchStart', (_, event) => {
      //   if (
      //     'touches' in event &&
      //     event.touches.length === 1 &&
      //     panzoom.getTransform().scale === 1
      //   )
      //     event.stopPropagation();
      // });

      state.panzoom = panzoom;
    });
  },
});
