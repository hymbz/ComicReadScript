import { For, createEffect } from 'solid-js';
import type { JSX } from 'solid-js';

import { SettingsItem } from './SettingsItem';

import classes from '../index.module.css';

export interface SettingsItemSelectProps<T> {
  options: ([string, string] | [string])[];
  name: string;
  value: T;
  class?: string;
  classList?: ClassList;

  onChange: (val: T) => void;
  onClick?: () => void;
}

/** 选择器式菜单项 */
export const SettingsItemSelect = <T extends string = string>(
  props: SettingsItemSelectProps<T>,
): JSX.Element => {
  let ref: HTMLSelectElement;

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
        ref={ref!}
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
