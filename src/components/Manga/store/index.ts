import { useStore } from 'helper/useStore';

import { imgState } from './image';
import { OptionState } from './option';
import { OtherState } from './other';
import { PropState } from './prop';
import { ShowState } from './show';

export const { store, setState, _state, _setState } = useStore({
  ...imgState,
  ...ShowState,
  ...PropState,
  ...OptionState,
  ...OtherState,
});

if (isDevMode)
  Object.assign((window as any).unsafeWindow ?? window, { store, _setState });

export type State = typeof _state;

export const refs = {
  root: undefined as unknown as HTMLElement,
  mangaBox: undefined as unknown as HTMLElement,
  mangaFlow: undefined as unknown as HTMLElement,
  touchArea: undefined as unknown as HTMLElement,
  scrollbar: undefined as unknown as HTMLElement,

  // 结束页上的按钮
  prev: undefined as unknown as HTMLButtonElement,
  next: undefined as unknown as HTMLButtonElement,
  exit: undefined as unknown as HTMLButtonElement,
};
