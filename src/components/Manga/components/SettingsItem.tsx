import type { Component, JSX } from 'solid-js';

import { boolDataVal } from 'helper';

import classes from '../index.module.css';

export type SettingsItemProps = {
  name: string;
  disabled?: boolean;

  children?: JSX.Element | JSX.Element[];
  class?: string;
  classList?: ClassList;
  style?: JSX.CSSProperties;
};

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
    data-disabled={boolDataVal(props.disabled)}
  >
    <div class={classes.SettingsItemName}> {props.name} </div>
    {props.children}
  </div>
);
