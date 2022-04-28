import type { WritableDraft } from 'immer/dist/internal';

export interface BearSlice {
  bears: number;
  addBear: () => void;
}
export const createBearSlice: SelfStateCreator<BearSlice> = (
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
