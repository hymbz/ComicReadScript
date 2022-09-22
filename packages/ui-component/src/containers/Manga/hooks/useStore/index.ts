import type { KeyboardEventHandler, RefObject, WheelEventHandler } from 'react';
import type { StateCreator } from 'zustand';
import create from 'zustand';

import { setAutoFreeze, enableMapSet } from 'immer';
import { immer } from 'zustand/middleware/immer';

import type { OptionSlice } from './OptionSlice';
import { optionSlice } from './OptionSlice';
import type { ImageSLice } from './ImageSlice';
import { imageSlice } from './ImageSlice';
import type { SwiperSlice } from './SwiperSlice';
import { swiperSlice } from './SwiperSlice';
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
    SwiperSlice,
    OperateSlice,
    OtherSlice {}

declare global {
  /** 对 StateCreator 进行包装 */
  type SelfStateCreator<T> = StateCreator<
    SelfState,
    [['zustand/immer', never]],
    [],
    T
  >;

  interface SelfState extends SliceState {
    rootRef: RefObject<HTMLElement> | null;
    handleScroll: WheelEventHandler;
    handleKeyUp: KeyboardEventHandler;

    [key: string]: unknown;
  }
}

const store: SelfStateCreator<SelfState> = (...a) => ({
  ...optionSlice(...a),
  ...imageSlice(...a),
  ...swiperSlice(...a),
  ...operateSlice(...a),
  ...otherSlice(...a),

  rootRef: null,
});

export const useStore = create<SelfState>()(immer(store));
