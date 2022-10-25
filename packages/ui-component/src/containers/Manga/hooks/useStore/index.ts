import type { RefObject } from 'react';
import type { StateCreator } from 'zustand';
import create from 'zustand';

import { setAutoFreeze, enableMapSet } from 'immer';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';

import type { OptionSlice } from './OptionSlice';
import { optionSlice } from './OptionSlice';
import type { ImageSLice } from './ImageSlice';
import { imageSlice } from './ImageSlice';
import type { ExternalLibSlice } from './ExternalLibSlice';
import { externalLibSlice } from './ExternalLibSlice';
import type { OperateSlice } from './OperateSlice';
import { operateSlice } from './OperateSlice';
import type { OtherSlice } from './OtherSlice';
import { otherSlice } from './OtherSlice';

export { default as shallow } from 'zustand/shallow';

enableMapSet();
setAutoFreeze(false);

interface SliceState
  extends OptionSlice,
    ImageSLice,
    ExternalLibSlice,
    OperateSlice,
    OtherSlice {}

/** 对 StateCreator 进行包装 */
export type SelfStateCreator<T> = StateCreator<
  SelfState,
  [['zustand/subscribeWithSelector', never], ['zustand/immer', never]],
  [],
  T
>;

export interface SelfState extends SliceState {
  rootRef: RefObject<HTMLElement>;
  mangaFlowRef: RefObject<HTMLElement>;
}

const store: SelfStateCreator<SelfState> = (...a) => ({
  ...optionSlice(...a),
  ...imageSlice(...a),
  ...externalLibSlice(...a),
  ...operateSlice(...a),
  ...otherSlice(...a),

  rootRef: { current: null },
  mangaFlowRef: { current: null },
});

export const useStore = create<SelfState>()(
  subscribeWithSelector(immer(store)),
);
