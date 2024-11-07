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
  const handleInput: EventHandler['on:input'] = (e) =>
    props.maxLength !== undefined &&
    e.currentTarget.textContent!.length > props.maxLength &&
    e.currentTarget.blur();

  const handleKeyDown: EventHandler['on:keydown'] = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        return props.onChange(
          Number(e.target.textContent!) + (props.step ?? 1),
        );
      case 'ArrowDown':
        return props.onChange(
          Number(e.target.textContent!) - (props.step ?? 1),
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
            props.onChange(Number(e.currentTarget.textContent!));
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
