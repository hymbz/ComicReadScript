import { useState, useCallback } from 'react';

export const useHover = (): [boolean, () => void, () => void] => {
  const [isHover, setIsHover] = useState(false);

  /** 鼠标移入 */
  const handleMouseEnter = useCallback(() => {
    setIsHover(true);
  }, []);

  /** 鼠标移出 */
  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
  }, []);

  return [isHover, handleMouseEnter, handleMouseLeave];
};
