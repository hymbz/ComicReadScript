import type { Component } from 'solid-js';
import { on, createEffect, createSignal } from 'solid-js';

import { setState, store } from '../hooks/useStore';
import { useDoubleClick } from '../hooks/useDoubleClick';
import { turnPage } from '../hooks/useStore/slice';

import classes from '../index.module.css';

export const TouchArea: Component = () => {
  /** 处理双击缩放 */
  const handleDoubleClickZoom = (e: MouseEvent) => {
    if (!store.panzoom) {
      console.warn('panzoom 未加载');
      return;
    }

    const { scale } = store.panzoom.getTransform();

    // 当缩放到一定程度时再双击会缩放回原尺寸，否则正常触发缩放
    if (scale > 2) store.panzoom.smoothZoomAbs(e.clientX, e.clientY, 1);
    else store.panzoom.smoothZoomAbs(e.clientX, e.clientY, scale + 1);
  };

  const handleClickNext = useDoubleClick(() => {
    if (store.option.clickPage.enabled)
      setState((state) => turnPage(state, 'next'));
  }, handleDoubleClickZoom);
  const handleClickPrev = useDoubleClick(() => {
    if (store.option.clickPage.enabled)
      setState((state) => turnPage(state, 'prev'));
  }, handleDoubleClickZoom);
  const handleClickMenu = useDoubleClick(() => {
    // 处于放大模式时跳过不处理
    if (store.isZoomed) return;
    setState((state) => {
      state.showScrollbar = !state.showScrollbar;
      state.showToolbar = !state.showToolbar;
    });
  }, handleDoubleClickZoom);

  // 在右键点击时使自身可穿透，使右键菜单为图片的右键菜单
  const [penetrate, setPenetrate] = createSignal();
  // 之后再立刻恢复回来
  createEffect(on(penetrate, () => setPenetrate()));

  return (
    <div
      class={classes.touchAreaRoot}
      style={{
        'pointer-events':
          penetrate() || store.option.scrollMode || store.isZoomed
            ? 'none'
            : 'auto',
        // 左右方向默认和漫画方向相同，如果开启了左右翻转则翻转
        'flex-direction':
          (store.option.dir === 'rtl') ===
          (store.option.clickPage.enabled && store.option.clickPage.overturn)
            ? undefined
            : 'row-reverse',
        cursor: store.isZoomed ? 'move' : undefined,
      }}
      onContextMenu={setPenetrate}
      data-show={store.showTouchArea}
    >
      <div
        class={classes.touchArea}
        onClick={handleClickPrev}
        data-area="prev"
        role="button"
        tabIndex={-1}
      >
        <h6>上 一 页</h6>
      </div>
      <div
        class={classes.touchArea}
        onClick={handleClickMenu}
        data-area="menu"
        role="button"
        tabIndex={-1}
      >
        <h6>菜 单</h6>
      </div>
      <div
        class={classes.touchArea}
        onClick={handleClickNext}
        data-area="next"
        role="button"
        tabIndex={-1}
      >
        <h6>下 一 页</h6>
      </div>
    </div>
  );
};
