import { useState, useCallback } from 'react';

export const useFocus = (): [boolean, () => void, () => void] => {
  const [isFocus, setIsFocus] = useState(false);

  /** 鼠标移入 */
  const handleFocus = useCallback(() => {
    setIsFocus(true);
  }, []);

  /** 鼠标移出 */
  const handleBlur = useCallback(() => {
    setIsFocus(false);
  }, []);

  return [isFocus, handleFocus, handleBlur];
};
