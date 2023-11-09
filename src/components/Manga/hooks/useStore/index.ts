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
  },
});

export type State = typeof _state;
