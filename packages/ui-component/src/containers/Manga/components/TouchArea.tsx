import { clsx } from 'clsx';
import { useState, useMemo, useEffect } from 'react';
import { useStore } from '../hooks/useStore';

import classes from '../index.module.css';

const selector = ({
  //
  showTouchArea,
  swiper,
  handleScroll,
}: SelfState) => ({
  showTouchArea,
  swiper,
  handleScroll,
});

export const TouchArea: React.FC = () => {
  const { showTouchArea, swiper, handleScroll } = useStore(selector);

  const handleClick = useMemo(
    () => ({
      next: () => {
        swiper?.slideNext(0);
      },
      prev: () => {
        swiper?.slidePrev(0);
      },
      menu: () => {
        useStore.setState((draftState) => {
          draftState.showScrollbar = !draftState.showScrollbar;
          draftState.showToolbar = !draftState.showToolbar;
        });
      },
    }),
    [swiper],
  );

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
      style={{ pointerEvents: penetrate ? 'none' : 'auto' }}
      onContextMenu={setPenetrate}
      onWheel={handleScroll}
      data-show={showTouchArea}
    >
      <div
        className={clsx(classes.touchArea)}
        onClick={handleClick.prev}
        data-area="prev"
        role="button"
        tabIndex={-1}
      >
        <h6>上 一 页</h6>
      </div>
      <div
        className={clsx(classes.touchArea)}
        onClick={handleClick.menu}
        data-area="menu"
        role="button"
        tabIndex={-1}
      >
        <h6>菜 单</h6>
      </div>
      <div
        className={clsx(classes.touchArea)}
        onClick={handleClick.next}
        data-area="next"
        role="button"
        tabIndex={-1}
      >
        <h6>下 一 页</h6>
      </div>
    </div>
  );
};
