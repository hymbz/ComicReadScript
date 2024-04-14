import { createSignal } from 'solid-js';
import { debounce } from 'helper';

/** 在鼠标静止一段时间后自动隐藏 */
export const useHiddenMouse = () => {
  const [hiddenMouse, setHiddenMouse] = createSignal(true);

  const hidden = debounce(() => setHiddenMouse(true), 1000);

  return {
    hiddenMouse,
    /** 鼠标移动 */
    onMouseMove() {
      setHiddenMouse(false);
      hidden();
    },
  } as const;
};
