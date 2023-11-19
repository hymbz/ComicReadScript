import type { Component } from 'solid-js';
import { createMemo } from 'solid-js';

import { store } from '../store';
import { contentHeight, windowHeight } from '../actions';

import classes from '../index.module.css';

/** 显示对应图片加载情况的元素 */
const ScrollbarImg: Component<{ index: number }> = (props) => {
  const img = () => store.imgList[props.index];

  return (
    <div
      class={classes.scrollbarPage}
      data-index={props.index}
      data-type={img()?.loadType}
      data-null={img()?.width && img()?.height ? undefined : ''}
      data-translation-type={img()?.translationType}
    />
  );
};

/** 滚动条上用于显示对应页面下图片加载情况的元素 */
export const ScrollbarPage: Component<{ a: number; b?: number }> = (props) => {
  const flexBasis = createMemo(() => {
    if (!store.option.scrollMode) return undefined;
    return `${
      ((store.imgList[props.a]?.height || windowHeight()) / contentHeight()) *
      100
    }%`;
  });

  return (
    <div style={{ 'flex-basis': flexBasis() }}>
      <ScrollbarImg index={props.a !== -1 ? props.a : props.b!} />
      {props.b ? (
        <ScrollbarImg index={props.b !== -1 ? props.b : props.a} />
      ) : null}
    </div>
  );
};
