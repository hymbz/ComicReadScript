import { createSignal } from 'solid-js';

export const useHover = () => {
  const [isHover, setIsHover] = createSignal(false);

  return {
    isHover,
    /** 鼠标移入 */
    handleMouseEnter: () => setIsHover(true),
    /** 鼠标移出 */
    handleMouseLeave: () => setIsHover(false),
  } as const;
};
