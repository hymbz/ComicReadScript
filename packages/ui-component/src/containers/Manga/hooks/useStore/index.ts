import type { RefObject } from 'react';
import type { StateCreator, State as ZState } from 'zustand';
import create from 'zustand';

import type { Draft } from 'immer';
import { setAutoFreeze, enableMapSet } from 'immer';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

import type { OptionSlice } from './OptionSlice';
import { optionSlice } from './OptionSlice';
import type { SettingsSlice } from './SettingsSlice';
import { settingsSlice } from './SettingsSlice';
import type { StylesSlice } from './StylesSlice';
import { stylesSlice } from './StylesSlice';
import type { ToolbarSlice } from './ToolbarSlice';
import { toolbarSlice } from './ToolbarSlice';
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
    ToolbarSlice,
    SettingsSlice,
    ImageSLice,
    SwiperSlice {}

declare global {
  /** 对 StateCreator 进行包装 */
  type SelfStateCreator<T extends ZState> = StateCreator<
    SelfState,
    [
      ['zustand/devtools', never],
      // ['zustand/persist', unknown],
      ['zustand/immer', never],
    ],
    [],
    T
  >;
  // 提取出 set 和 get 函数的定义
  type SelfStateSet = Parameters<SelfStateCreator<SelfState>>[0];
  type SelfStateGet = Parameters<SelfStateCreator<SelfState>>[1];

  interface SelfState extends SliceState {
    mainRef: RefObject<HTMLDivElement> | null;

    [key: string]: unknown;
  }

  type DraftSelfState = Draft<SelfState>;
}

const store: SelfStateCreator<SelfState> = (...a) => ({
  ...optionSlice(...a),
  ...stylesSlice(...a),
  ...toolbarSlice(...a),
  ...settingsSlice(...a),
  ...imageSlice(...a),
  ...swiperSlice(...a),

  mainRef: null,
});

// : UseBoundStore<StoreApi<SelfState>>
export const useStore = create<SelfState>()(devtools(immer(store)));
