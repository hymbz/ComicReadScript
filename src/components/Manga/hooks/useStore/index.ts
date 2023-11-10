import { useStore } from 'helper/useStore';
import { imgState } from './ImageState';
import { ScrollbarState } from './ScrollbarState';
import { OptionState } from './OptionState';
import { OtherState } from './OtherState';

export const { store, setState, _state, _setState } = useStore({
  ...imgState,
  ...ScrollbarState,
  ...OptionState,
  ...OtherState,

  ref: {
    root: undefined as unknown as HTMLElement,
    mangaFlow: undefined as unknown as HTMLElement,
    touchArea: undefined as unknown as HTMLElement,

    // 结束页上的按钮
    prev: undefined as unknown as HTMLButtonElement,
    next: undefined as unknown as HTMLButtonElement,
    exit: undefined as unknown as HTMLButtonElement,
  },
});

export type State = typeof _state;
