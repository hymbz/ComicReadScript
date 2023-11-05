import type { Component } from 'solid-js';

import { t } from 'helper/i18n';
import { ifNot } from 'helper';
import { store } from '../hooks/useStore';
import { bindRef } from '../hooks/useStore/slice';

import classes from '../index.module.css';

export const TouchArea: Component = () => (
  <div
    class={classes.touchAreaRoot}
    style={{
      // 左右方向默认和漫画方向相同，如果开启了左右翻转则翻转
      'flex-direction': ifNot(
        store.option.clickPageTurn.enabled &&
          store.option.clickPageTurn.reverse,
        store.option.dir !== 'rtl',
      )
        ? undefined
        : 'row-reverse',
      cursor: store.isZoomed ? 'move' : undefined,
    }}
    data-show={store.showTouchArea}
    data-vert={store.option.clickPageTurn.vertical}
    data-scroll-mode={store.option.scrollMode}
  >
    <div
      ref={bindRef('prevArea')}
      class={classes.touchArea}
      data-area="prev"
      role="button"
      tabIndex={-1}
    >
      <h6>{t('touch_area.prev')}</h6>
    </div>
    <div
      ref={bindRef('menuArea')}
      class={classes.touchArea}
      data-area="menu"
      role="button"
      tabIndex={-1}
    >
      <h6>{t('touch_area.menu')}</h6>
    </div>
    <div
      ref={bindRef('nextArea')}
      class={classes.touchArea}
      data-area="next"
      role="button"
      tabIndex={-1}
    >
      <h6>{t('touch_area.next')}</h6>
    </div>
  </div>
);
