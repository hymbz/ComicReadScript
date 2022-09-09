import { clsx } from 'clsx';
import { useState, useMemo, useEffect } from 'react';
import { useDoubleClick } from '../hooks/useDoubleClick';
import { useStore } from '../hooks/useStore';

import classes from '../index.module.css';

const selector = ({
  //
  showTouchArea,
  swiper,
  option,
  handleScroll,
}: SelfState) => ({
  showTouchArea,
  swiper,
  option,
  handleScroll,
});

export const TouchArea: React.FC = () => {
  const { showTouchArea, swiper, option, handleScroll } = useStore(selector);

  const handleClickNext = useDoubleClick(() => {
    swiper?.slideNext(0);
  });
  const handleClickPrev = useDoubleClick(() => {
    swiper?.slidePrev(0);
  });
  const handleClickMenu = useDoubleClick(() => {
    useStore.setState((draftState) => {
      draftState.showScrollbar = !draftState.showScrollbar;
      draftState.showToolbar = !draftState.showToolbar;
    });
  });

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
      }}
      onContextMenu={setPenetrate}
      onWheel={handleScroll}
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
};
