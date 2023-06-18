import type { Component } from 'solid-js';

import { setState, store } from '../hooks/useStore';
import { bindRef, turnPage } from '../hooks/useStore/slice';

import classes from '../index.module.css';

const handleClick = {
  prev: () => {
    if (store.option.clickPage.enabled)
      setState((state) => turnPage(state, 'prev'));
  },
  next: () => {
    if (store.option.clickPage.enabled)
      setState((state) => turnPage(state, 'next'));
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
        'flex-direction':
          (store.option.dir === 'rtl') ===
          (store.option.clickPage.enabled && store.option.clickPage.overturn)
            ? undefined
            : 'row-reverse',
        cursor: store.isZoomed ? 'move' : undefined,
      }}
      data-show={store.showTouchArea}
    >
      <div
        ref={bindRef('prevAreaRef')}
        class={classes.touchArea}
        data-area="prev"
        role="button"
        tabIndex={-1}
      >
        <h6>上 一 页</h6>
      </div>
      <div
        ref={bindRef('menuAreaRef')}
        class={classes.touchArea}
        data-area="menu"
        role="button"
        tabIndex={-1}
      >
        <h6>菜 单</h6>
      </div>
      <div
        ref={bindRef('nextAreaRef')}
        class={classes.touchArea}
        data-area="next"
        role="button"
        tabIndex={-1}
      >
        <h6>下 一 页</h6>
      </div>
    </div>
  );
};
