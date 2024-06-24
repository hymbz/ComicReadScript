import { createStore, produce } from 'solid-js/store';

import type { Toast } from '.';

export const [_state, _setState] = createStore({
  list: [] as Array<Toast['id']>,
  map: {} as Record<Toast['id'], Toast>,
});
export type State = typeof _state;

export const setState = (fn: (state: State) => void) => _setState(produce(fn));
export const store: Readonly<State> = _state;

export const creatId = (): string => {
  let id = `${Date.now()}`;
  while (Reflect.has(store.map, id)) id += '_';

  return id;
};
