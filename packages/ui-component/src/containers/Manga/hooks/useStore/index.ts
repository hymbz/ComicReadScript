import type { WritableDraft } from 'immer/dist/internal';
import type { StateCreator, StoreApi, UseBoundStore, State } from 'zustand';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
// import { devtools, persist } from 'zustand/middleware';

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

interface BearSlice {
  bears: number;
  addBear: () => void;
}
const createBearSlice: SelfStateCreator<BearSlice> = (
  set: (
    nextStateOrUpdater:
      | BearSlice
      | Partial<BearSlice>
      | ((state: WritableDraft<BearSlice>) => void),
    shouldReplace?: boolean | undefined,
  ) => void,
) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
});

const store: SelfStateCreator<BearSlice> = (...a) => ({
  ...createBearSlice(...a),
});
export const useStore: UseBoundStore<StoreApi<BearSlice>> = create<BearSlice>()(
  immer(store),
);
