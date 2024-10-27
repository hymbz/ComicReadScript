import { type Component } from 'solid-js';

import { NumberInput, type NumberInputProps } from '../../NumberInput';

import { SettingsItem } from './SettingsItem';

interface SettingsItemNumberProps extends NumberInputProps {
  name: string;
  class?: string;
  classList?: ClassList;
}

/** 数值输入框菜单项 */
export const SettingsItemNumber: Component<SettingsItemNumberProps> = (
  props,
) => (
  <SettingsItem
    name={props.name}
    class={props.class}
    classList={props.classList}
  >
    <div style={{ 'margin-right': props.suffix ? '.3em' : '.6em' }}>
      <NumberInput {...props} />
    </div>
  </SettingsItem>
);
