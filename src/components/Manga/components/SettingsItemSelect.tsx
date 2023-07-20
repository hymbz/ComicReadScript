import { For, type Component, createEffect } from 'solid-js';

import { SettingsItem } from './SettingsItem';

import classes from '../index.module.css';

export interface SettingsItemSelectProps {
  options: ([string, string] | [string])[];
  name: string;
  value: string;
  class?: string;
  classList?: ClassList;

  onChange: (val: string) => void;
}

/** 选择器式菜单项 */
export const SettingsItemSelect: Component<SettingsItemSelectProps> = (
  props,
) => {
  let ref: HTMLSelectElement;

  createEffect(() => {
    ref.value = props.options.some(([val]) => val === props.value)
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
        onChange={(e) => props.onChange(e.target.value)}
      >
        <For each={props.options}>
          {([val, label]) => <option value={val}>{label ?? val}</option>}
        </For>
      </select>
    </SettingsItem>
  );
};
