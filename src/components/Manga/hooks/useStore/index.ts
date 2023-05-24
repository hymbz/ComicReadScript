import { createStore, produce } from 'solid-js/store';

import { imgState } from './ImageState';
import { ScrollbarState } from './ScrollbarState';
import { OperateState } from './OperateState';
import { ExternalLibState } from './ExternalLibState';
import { OptionState } from './OptionState';
import { OtherState } from './OtherState';

const [_state, _setState] = createStore({
  ...imgState,
  ...ScrollbarState,
  ...OperateState,
  ...ExternalLibState,
  ...OptionState,
  ...OtherState,

  rootRef: undefined as HTMLElement | undefined,
  mangaFlowRef: undefined as HTMLElement | undefined,
  prevAreaRef: undefined as HTMLElement | undefined,
  nextAreaRef: undefined as HTMLElement | undefined,
  menuAreaRef: undefined as HTMLElement | undefined,
});
export type State = typeof _state;

export const setState = (fn: (state: State) => void) => _setState(produce(fn));

// eslint-disable-next-line solid/reactivity
export const store: Readonly<State> = _state;
