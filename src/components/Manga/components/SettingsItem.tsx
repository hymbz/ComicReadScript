import type { Component, JSX } from 'solid-js';

import classes from '../index.module.css';

export interface SettingsItemProps {
  name: string;
  class?: string;
  classList?: ClassList;
  style?: JSX.CSSProperties;

  children: JSX.Element | JSX.Element[];
}

/** 设置菜单项 */
export const SettingsItem: Component<SettingsItemProps> = (props) => (
  <div
    class={
      props.class
        ? `${classes.SettingsItem} ${props.class}`
        : classes.SettingsItem
    }
    classList={{
      [props.class ?? '']: Boolean(props.class?.length),
      ...props.classList,
    }}
    style={props.style}
  >
    <div class={classes.SettingsItemName}> {props.name} </div>
    {props.children}
  </div>
);
