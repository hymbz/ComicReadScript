import { splitProps, type Component } from 'solid-js';

import type { SettingsItemProps } from './SettingsItem';

import classes from '../index.module.css';
import { SettingsItem } from './SettingsItem';

export type SettingsItemSwitchProps = {
  onClick: () => void;
} & SettingsItemProps;

/** 按钮式菜单项 */
export const SettingsItemButton: Component<SettingsItemSwitchProps> = (
  props,
) => {
  const [, others] = splitProps(props, ['children', 'onClick']);

  return (
    <SettingsItem {...others}>
      <button
        class={classes.SettingsItemIconButton}
        type="button"
        on:click={props.onClick}
        children={props.children}
      />
    </SettingsItem>
  );
};
