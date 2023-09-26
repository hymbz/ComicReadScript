import type { Component } from 'solid-js';

import { t } from 'helper/i18n';
import { ifNot } from 'helper';
import { setState, store } from '../hooks/useStore';
import { bindRef, turnPage } from '../hooks/useStore/slice';

import classes from '../index.module.css';

const handleClick = {
  prev: () => {
    if (store.option.clickPageTurn.enabled) turnPage('prev');
  },
  next: () => {
    if (store.option.clickPageTurn.enabled) turnPage('next');
  },
  menu: () => {
    // 处于放大模式时跳过不处理
    if (store.isZoomed) return;
    setState((state) => {
      state.showScrollbar = !state.showScrollbar;
      state.showToolbar = !state.showToolbar;
    });
  },
};

/** 根据点击坐标触发指定的操作 */
export const handlePageClick = ({
  clientX: x,
  clientY: y,
}: {
  clientX: number;
  clientY: number;
}) => {
  if (store.isZoomed) return;

  // 找到当前
  const targetArea = [
    store.nextAreaRef,
    store.menuAreaRef,
    store.prevAreaRef,
  ].find((e) => {
    if (!e) return false;
    const rect = e.getBoundingClientRect();
    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  });
  if (!targetArea) return;
  handleClick[
    targetArea.getAttribute('data-area') as keyof typeof handleClick
  ]();
};

export const TouchArea: Component = () => {
  return (
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
    >
      <div
        ref={bindRef('prevAreaRef')}
        class={classes.touchArea}
        data-area="prev"
        role="button"
        tabIndex={-1}
      >
        <h6>{t('touch_area.prev')}</h6>
      </div>
      <div
        ref={bindRef('menuAreaRef')}
        class={classes.touchArea}
        data-area="menu"
        role="button"
        tabIndex={-1}
      >
        <h6>{t('touch_area.menu')}</h6>
      </div>
      <div
        ref={bindRef('nextAreaRef')}
        class={classes.touchArea}
        data-area="next"
        role="button"
        tabIndex={-1}
      >
        <h6>{t('touch_area.next')}</h6>
      </div>
    </div>
  );
};
