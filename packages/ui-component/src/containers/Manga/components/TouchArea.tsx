import { clsx } from 'clsx';
import type { MouseEventHandler } from 'react';
import { memo, useState, useEffect, useCallback } from 'react';
import { useDoubleClick } from '../hooks/useDoubleClick';
import type { SelfState } from '../hooks/useStore';
import { shallow, useStore } from '../hooks/useStore';

import classes from '../index.module.css';

const selector = ({
  showTouchArea,
  panzoom,
  turnPage,
  option: { clickPage, scrollMode, dir },
  isZoomed,
}: SelfState) => ({
  showTouchArea,
  panzoom,
  turnPage,
  clickPage,
  scrollMode,
  dir,
  isZoomed,
});

export const TouchArea: React.FC = memo(() => {
  const {
    showTouchArea,
    panzoom,
    turnPage,
    clickPage,
    scrollMode,
    dir,
    isZoomed,
  } = useStore(selector, shallow);

  /** 处理双击缩放 */
  const handleDoubleClickZoom: MouseEventHandler = useCallback(
    (e) => {
      if (!panzoom) {
        console.warn('panzoom 未加载');
        return;
      }

      const { scale } = panzoom.getTransform();

      setTimeout(() => {
        // 当缩放到一定程度时再双击会缩放回原尺寸，否则正常触发缩放
        if (scale > 2) panzoom.smoothZoomAbs(e.clientX, e.clientY, 1);
        else panzoom.smoothZoomAbs(e.clientX, e.clientY, scale + 1);
      });
    },
    [panzoom],
  );

  const handleClickNext = useDoubleClick(() => {
    if (clickPage.enabled) turnPage('next');
  }, handleDoubleClickZoom);
  const handleClickPrev = useDoubleClick(() => {
    if (clickPage.enabled) turnPage('prev');
  }, handleDoubleClickZoom);
  const handleClickMenu = useDoubleClick(() => {
    useStore.setState((state) => {
      // 处于放大模式时跳过不处理
      if (state.isZoomed) return;
      state.showScrollbar = !state.showScrollbar;
      state.showToolbar = !state.showToolbar;
    });
  }, handleDoubleClickZoom);

  // 在右键点击时使自身可穿透，使右键菜单为图片的右键菜单
  const [penetrate, setPenetrate] =
    useState<React.MouseEvent<HTMLDivElement> | null>(null);
  // 之后再立刻恢复回来
  useEffect(() => {
    setPenetrate(null);
  }, [penetrate]);

  return (
    <div
      className={classes.touchAreaRoot}
      style={{
        // 开启卷轴模式时隐藏自身
        pointerEvents: penetrate || scrollMode ? 'none' : 'auto',
        // 左右方向默认和漫画方向相同，如果开启了左右翻转则翻转
        flexDirection:
          (dir === 'rtl') === (clickPage.enabled && clickPage.overturn)
            ? undefined
            : 'row-reverse',
        cursor: isZoomed ? 'move' : undefined,
      }}
      onContextMenu={setPenetrate}
      data-show={showTouchArea}
    >
      <div
        className={clsx(classes.touchArea)}
        onClick={handleClickPrev}
        data-area="prev"
        role="button"
        tabIndex={-1}
      >
        <h6>上 一 页</h6>
      </div>
      <div
        className={clsx(classes.touchArea)}
        onClick={handleClickMenu}
        data-area="menu"
        role="button"
        tabIndex={-1}
      >
        <h6>菜 单</h6>
      </div>
      <div
        className={clsx(classes.touchArea)}
        onClick={handleClickNext}
        data-area="next"
        role="button"
        tabIndex={-1}
      >
        <h6>下 一 页</h6>
      </div>
    </div>
  );
});
