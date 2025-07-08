import { createStore, produce, type SetStoreFunction } from 'solid-js/store';

export type SetStateFunction<State> = SetStoreFunction<State> &
  ((fn: (state: State) => void) => void);

export const useStore = <State extends object>(initState: State) => {
  const [store, _setState] = createStore(initState);

  const setState: SetStateFunction<State> = (...args) => {
    if (args.length === 1 && typeof args[0] === 'function')
      return _setState(produce(args[0]));
    return _setState(...(args as [any]));
  };

  return { store: store as Readonly<State>, setState };
};
