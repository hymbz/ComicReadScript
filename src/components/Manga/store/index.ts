import { useStore } from 'helper';

import { imgState } from './image';
import { optionState } from './option';
import { otherState } from './other';
import { propState } from './prop';
import { showState } from './show';

export const initStore = {
  ...imgState,
  ...showState,
  ...propState,
  ...optionState,
  ...otherState,
};

export const { store, setState, _state, _setState } = useStore({
  ...initStore,
});

export type State = typeof imgState &
  typeof showState &
  typeof propState &
  typeof optionState &
  typeof otherState;

export const refs = {
  root: undefined as unknown as HTMLElement,
  mangaBox: undefined as unknown as HTMLElement,
  mangaFlow: undefined as unknown as HTMLElement,
  touchArea: undefined as unknown as HTMLElement,
  scrollbar: undefined as unknown as HTMLElement,
  settingPanel: undefined as unknown as HTMLElement,

  // 结束页上的按钮
  prev: undefined as unknown as HTMLButtonElement,
  next: undefined as unknown as HTMLButtonElement,
  exit: undefined as unknown as HTMLButtonElement,
};

if (isDevMode)
  Object.assign((window as any).unsafeWindow ?? window, {
    store,
    setState,
    _setState,
    refs,
  });
