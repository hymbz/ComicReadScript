import type { StateCreator, StoreApi, UseBoundStore, State } from 'zustand';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

import type { BearSlice } from './BearSlice';
import { createBearSlice } from './BearSlice';

declare global {
  /** 对 StateCreator 进行包装 */
  type SelfStateCreator<T extends State> = StateCreator<
    T,
    [
      // ['zustand/devtools', never],
      // ['zustand/persist', unknown],
      ['zustand/immer', never],
    ],
    []
  >;
}

export const buildStore = () => {
  const store: SelfStateCreator<BearSlice> = (...a) => ({
    ...createBearSlice(...a),
  });

  const useStore: UseBoundStore<StoreApi<BearSlice>> = create<BearSlice>()(
    immer(store),
  );

  return { useStore };
};
