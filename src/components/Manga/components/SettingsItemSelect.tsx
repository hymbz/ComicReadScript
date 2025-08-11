import { createEffect, For } from 'solid-js';

import type { SettingsItemProps } from './SettingsItem';

import classes from '../index.module.css';
import { SettingsItem } from './SettingsItem';

export type SettingsItemSelectProps<T extends string> = {
  options: ([string, string] | [string])[];
  value: T;
  onChange: (val: T) => void;
  onClick?: () => void;
} & SettingsItemProps;

/** 选择器式菜单项 */
export const SettingsItemSelect = <T extends string = string>(
  props: SettingsItemSelectProps<T>,
) => {
  let ref!: HTMLSelectElement; // oxlint-disable-line no-unassigned-vars

  createEffect(() => {
    ref.value = props.options?.some(([val]) => val === props.value)
      ? props.value
      : '';
  });

  return (
    <SettingsItem
      name={props.name}
      class={props.class}
      classList={props.classList}
    >
      <select
        ref={ref}
        class={classes.SettingsItemSelect}
        onChange={(e) => props.onChange(e.target.value as T)}
        on:click={() => props.onClick?.()}
      >
        <For each={props.options}>
          {([val, label]) => <option value={val}>{label ?? val}</option>}
        </For>
      </select>
    </SettingsItem>
  );
};
