import { createStore, produce } from 'solid-js/store';

export const useStore = <State extends object>(initState: State) => {
  const [_state, _setState] = createStore(initState);

  return {
    _state,
    _setState,
    setState: (fn: (state: State) => void) => _setState(produce(fn)),
    store: _state as Readonly<State>,
  };
};
