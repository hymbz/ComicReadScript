import type { Component } from 'solid-js';

import type { NumberInputProps } from '../../NumberInput';
import type { SettingsItemProps } from './SettingsItem';

import { NumberInput } from '../../NumberInput';
import { SettingsItem } from './SettingsItem';

/** 数值输入框菜单项 */
export const SettingsItemNumber: Component<
  SettingsItemProps & NumberInputProps
> = (props) => (
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
