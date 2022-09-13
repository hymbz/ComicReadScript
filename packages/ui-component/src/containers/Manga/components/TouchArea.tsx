import { clsx } from 'clsx';
import type { MouseEventHandler } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useDoubleClick } from '../hooks/useDoubleClick';
import { useStore } from '../hooks/useStore';

import classes from '../index.module.css';

const selector = ({
  //
  showTouchArea,
  swiper,
  panzoom,
  option,
}: SelfState) => ({
  showTouchArea,
  swiper,
  panzoom,
  option,
});

export const TouchArea: React.FC = () => {
  const { showTouchArea, swiper, option, panzoom } = useStore(selector);

  /** 处理双击缩放 */
  const handleDoubleClickZoom: MouseEventHandler = useCallback(
    (e) => {
      if (!panzoom) return;

      const { scale } = panzoom.getTransform();

      setTimeout(() => {
        // 当缩放到一定程度时再双击会缩放回原尺寸，否则正常触发缩放
        if (scale > 4) panzoom.smoothZoomAbs(e.clientX, e.clientY, 1);
        else panzoom.smoothZoomAbs(e.clientX, e.clientY, scale + 2);
      });
    },
    [panzoom],
  );

  const handleClickNext = useDoubleClick(() => {
    if (option.clickPage.enabled) swiper?.slideNext(0);
  }, handleDoubleClickZoom);
  const handleClickPrev = useDoubleClick(() => {
    if (option.clickPage.enabled) swiper?.slidePrev(0);
  }, handleDoubleClickZoom);
  const handleClickMenu = useDoubleClick(() => {
    useStore.setState((draftState) => {
      draftState.showScrollbar = !draftState.showScrollbar;
      draftState.showToolbar = !draftState.showToolbar;
    });
  }, handleDoubleClickZoom);

  // 在右键点击时隐藏自身，使右键菜单为图片的右键菜单
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
        pointerEvents: penetrate || option.scrollMode ? 'none' : 'auto',
        // 左右方向默认和漫画方向相同，如果开启了左右翻转则翻转
        flexDirection:
          (option.dir === 'rtl') === option.clickPage.overturn
            ? 'row-reverse'
            : undefined,
      }}
      onContextMenu={setPenetrate}
      data-show={showTouchArea}
    >
      <div
        className={clsx(classes.touchArea)}
        onClick={handleClickNext}
        data-area="next"
        role="button"
        tabIndex={-1}
      >
        <h6>下 一 页</h6>
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
        onClick={handleClickPrev}
        data-area="prev"
        role="button"
        tabIndex={-1}
      >
        <h6>上 一 页</h6>
      </div>
    </div>
  );
};
