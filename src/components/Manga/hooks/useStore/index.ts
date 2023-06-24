import { useStore } from '../../../../helper/useStore';
import { imgState } from './ImageState';
import { ScrollbarState } from './ScrollbarState';
import { OptionState } from './OptionState';
import { OtherState } from './OtherState';

export const { store, setState, _state } = useStore({
  ...imgState,
  ...ScrollbarState,
  ...OptionState,
  ...OtherState,

  rootRef: undefined as HTMLElement | undefined,
  mangaFlowRef: undefined as HTMLElement | undefined,
  prevAreaRef: undefined as HTMLElement | undefined,
  nextAreaRef: undefined as HTMLElement | undefined,
  menuAreaRef: undefined as HTMLElement | undefined,
});

export type State = typeof _state;
