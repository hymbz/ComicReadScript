import type { Component, JSX } from 'solid-js';

export type RangeInputProps = {
  value: string;
  placeholder?: string;
  onChange?: (val: string) => void;

  class?: string;
  style?: JSX.CSSProperties;
};

/** 范围输入框 */
export const RangeInput: Component<RangeInputProps> = (props) => {
  let ref!: HTMLTextAreaElement; // oxlint-disable-line no-unassigned-vars

  /** 在保持光标位置不变的情况下修改文本 */
  const editText = (text: string) => {
    const offset = ref.selectionStart;
    ref.value = text;
    if (offset)
      requestAnimationFrame(() => {
        ref.selectionStart = offset;
        ref.selectionEnd = offset;
      });
  };

  /** 修改文本中的数字 */
  const replaceTextNumer = (
    text: string,
    offset: number,
    fn: (num: number) => number,
  ) => {
    const isNumber = (num: number) => /\d/.test(text[num]);

    let start = offset;
    if (!isNumber(offset)) {
      if (isNumber(start - 1)) start--;
      else if (isNumber(start + 1)) start++;
      else return text;
    }
    let end = start;

    while (isNumber(start - 1)) start--;
    while (isNumber(end + 1)) end++;
    return (
      text.slice(0, start) +
      fn(Number(text.slice(start, end + 1))) +
      text.slice(end + 1)
    );
  };

  const handleKeyDown: EventHandler['on:keydown'] = (e) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        editText(
          replaceTextNumer(ref.value, ref.selectionStart, (num) =>
            e.key === 'ArrowUp' ? num + 1 : num - 1,
          ),
        );
    }
  };

  return (
    <textarea
      ref={ref}
      style={props.style}
      value={props.value}
      placeholder={props.placeholder}
      autocomplete="off"
      rows={2}
      on:keydown={handleKeyDown}
      onBlur={() => {
        try {
          props.onChange?.(ref.value);
        } finally {
          ref.value = props.value;
        }
      }}
    />
  );
};
