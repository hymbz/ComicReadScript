import type { KeyboardEventHandler, RefObject, WheelEventHandler } from 'react';
import type { StateCreator } from 'zustand';
import create from 'zustand';

import { setAutoFreeze, enableMapSet } from 'immer';
import { immer } from 'zustand/middleware/immer';

import type { OptionSlice } from './OptionSlice';
import { optionSlice } from './OptionSlice';
import type { StylesSlice } from './StylesSlice';
import { stylesSlice } from './StylesSlice';
import type { ImageSLice } from './ImageSlice';
import { imageSlice } from './ImageSlice';
import type { SwiperSlice } from './SwiperSlice';
import { swiperSlice } from './SwiperSlice';

export { default as shallow } from 'zustand/shallow';

enableMapSet();
setAutoFreeze(false);

interface SliceState
  extends OptionSlice,
    StylesSlice,
    ImageSLice,
    SwiperSlice {}

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
  ...stylesSlice(...a),
  ...imageSlice(...a),
  ...swiperSlice(...a),

  rootRef: null,
  handleScroll: () => {},
  handleKeyUp: () => {},
});

export const useStore = create<SelfState>()(immer(store));
