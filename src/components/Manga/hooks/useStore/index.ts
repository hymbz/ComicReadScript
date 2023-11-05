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
    prev: undefined as HTMLButtonElement | undefined,
    next: undefined as HTMLButtonElement | undefined,
    exit: undefined as HTMLButtonElement | undefined,

    root: undefined as HTMLElement | undefined,
    mangaFlow: undefined as HTMLElement | undefined,
    prevArea: undefined as HTMLElement | undefined,
    nextArea: undefined as HTMLElement | undefined,
    menuArea: undefined as HTMLElement | undefined,
  },
});

export type State = typeof _state;
