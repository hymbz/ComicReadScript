import { boolDataVal } from 'helper';
import { type Component } from 'solid-js';

import { scrollPosition } from '../actions';
import { css } from '../hooks/useStyle';
import { store } from '../store';
import classes from './WheelProgress.module.css';

/** 虚拟棘轮翻页进度指示线：滚动时显示，长度反映距翻页还差多少，方向与滚动方向一致 */
export const WheelProgress: Component = () => {
  css(`.${classes.wheelProgress}`, {
    opacity: () => {
      switch (store.scrollDeviceType) {
        case undefined:
        case 'a':
          return 0;

        default:
          return store.wheelProgress === 0 ? 0 : 1;
      }
    },
    '--wheel-progress': () => `${Math.abs(store.wheelProgress)}`,
  });

  return (
    <div
      class={classes.wheelProgress}
      data-position={scrollPosition()}
      data-dir={store.option.dir}
      data-down={boolDataVal(store.wheelProgress > 0)}
    />
  );
};
