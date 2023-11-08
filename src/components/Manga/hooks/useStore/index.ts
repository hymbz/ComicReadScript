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
    prev: undefined as unknown as HTMLButtonElement,
    next: undefined as unknown as HTMLButtonElement,
    exit: undefined as unknown as HTMLButtonElement,

    root: undefined as unknown as HTMLElement,
    mangaFlow: undefined as unknown as HTMLElement,
    prevArea: undefined as unknown as HTMLElement,
    nextArea: undefined as unknown as HTMLElement,
    menuArea: undefined as unknown as HTMLElement,
  },
});

export type State = typeof _state;
