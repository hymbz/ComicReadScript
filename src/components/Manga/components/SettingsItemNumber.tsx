import type { Component } from 'solid-js';

import { SettingsItem } from './SettingsItem';

export interface SSettingsItemNumberProps {
  name: string;
  value: number;
  class?: string;
  classList?: ClassList;

  maxLength: number;
  step?: number;
  suffix?: string;
  onChange: (val: number) => void;
}

/** 数值输入框菜单项 */
export const SettingsItemNumber: Component<SSettingsItemNumberProps> = (
  props,
) => {
  const handleInput: EventHandler['on:input'] = (e) => {
    if (e.currentTarget.textContent!.length > props.maxLength)
      e.currentTarget.blur();
  };

  const handleKeyDown: EventHandler['on:keydown'] = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        return props.onChange(+e.target.textContent! + (props.step ?? 1));
      case 'ArrowDown':
        return props.onChange(+e.target.textContent! - (props.step ?? 1));
    }
  };

  return (
    <SettingsItem
      name={props.name}
      class={props.class}
      classList={props.classList}
    >
      <div style={{ 'margin-right': props.suffix ? '.3em' : '.6em' }}>
        <span
          contenteditable
          data-only-number
          on:input={handleInput}
          on:keydown={handleKeyDown}
          onBlur={(e) => {
            try {
              props.onChange(+e.currentTarget.textContent!);
            } finally {
              // eslint-disable-next-line no-param-reassign
              e.currentTarget.textContent = `${props.value}`;
            }
          }}
        >
          {props.value}
        </span>
        <span style={{ 'margin-left': '.1em' }}>{props.suffix ?? ''}</span>
      </div>
    </SettingsItem>
  );
};
