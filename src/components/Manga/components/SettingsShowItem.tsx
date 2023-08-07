import type { Component, JSX } from 'solid-js';

import classes from '../index.module.css';

/** 带有动画过渡的切换显示设置项 */
export const SettingsShowItem: Component<{
  when: boolean;
  children: JSX.Element | JSX.Element[];
}> = (props) => (
  <div
    class={classes.SettingsShowItem}
    style={{ 'grid-template-rows': props.when ? '1fr' : '0fr' }}
  >
    <div class={classes.SettingsShowItemBody}>{props.children}</div>
  </div>
);
