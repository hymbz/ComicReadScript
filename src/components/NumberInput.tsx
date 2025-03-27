import { Show, type Component } from 'solid-js';

export interface NumberInputProps {
  value: number;
  maxLength?: number;
  step?: number;
  suffix?: string;
  onChange: (val: number) => void;
}

/** 数值输入框 */
export const NumberInput: Component<NumberInputProps> = (props) => {
  const handleInput: EventHandler['onInput'] = (e) => {
    const target = e.currentTarget;
    if (
      props.maxLength === undefined ||
      target.textContent!.length <= props.maxLength
    )
      return;

    target.textContent = target.textContent!.slice(0, props.maxLength);
    target.blur();
  };

  const handleKeyDown: EventHandler['on:keydown'] = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        return props.onChange(
          (Number(e.target.textContent!) * 1000 + (props.step ?? 1) * 1000) /
            1000,
        );
      case 'ArrowDown':
        return props.onChange(
          (Number(e.target.textContent!) * 1000 - (props.step ?? 1) * 1000) /
            1000,
        );
      case 'Enter':
        return (e.target as HTMLElement).blur();
    }
  };

  return (
    <>
      <span
        contenteditable
        data-only-number
        on:input={handleInput}
        on:keydown={handleKeyDown}
        onBlur={(e) => {
          try {
            props.onChange(Number(e.currentTarget.textContent!) || 0);
          } finally {
            e.currentTarget.textContent = `${props.value}`;
          }
        }}
        children={`${props.value}`}
      />
      <Show when={props.suffix} children={props.suffix} />
    </>
  );
};
