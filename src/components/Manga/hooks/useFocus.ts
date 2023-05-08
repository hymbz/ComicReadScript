import { createSignal } from 'solid-js';

export const useFocus = () => {
  const [isFocus, setIsFocus] = createSignal(false);

  return {
    isFocus,
    /** 鼠标移入 */
    handleFocus: () => setIsFocus(true),
    /** 鼠标移出 */
    handleBlur: () => setIsFocus(false),
  } as const;
};
