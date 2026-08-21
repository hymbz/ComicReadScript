import { exposeToGlobal, useStore } from 'helper';

import { imgState } from './image';
import { optionState } from './option';
import { otherState } from './other';
import { propState } from './prop';
import { showState } from './show';

export const initStore = {
  ...imgState,
  ...showState,
  ...propState,
  ...optionState,
  ...otherState,
};

export const { store, setState } = useStore({
  ...initStore,
});

export type State = typeof imgState &
  typeof showState &
  typeof propState &
  typeof optionState &
  typeof otherState;

export const refs = {
  root: undefined as unknown as HTMLElement,
  mangaBox: undefined as unknown as HTMLElement,
  mangaFlow: undefined as unknown as HTMLElement,
  touchArea: undefined as unknown as HTMLElement,
  scrollbar: undefined as unknown as HTMLElement,
  settingPanel: undefined as unknown as HTMLElement,

  // 结束页上的按钮
  prev: undefined as unknown as HTMLButtonElement,
  next: undefined as unknown as HTMLButtonElement,
  exit: undefined as unknown as HTMLButtonElement,

  /** 以图片原始 URL 为 key 的 img 元素集合，用于绕过 DOM 查询直接获取图片元素 */
  imgEleMap: {} as Record<string, Set<HTMLImageElement>>,
};

if (isDevMode)
  exposeToGlobal({
    mangeRefs: refs,
    mangaStore: store,
    setMangaStore: setState,
  });
