import { onCleanup } from 'solid-js';
import { difference, byPath, throttle } from 'helper';

import { type State, store, setState, refs } from '../store';
import { type Option } from '../store/option';
import { type FillEffect } from '../store/image';

export const getImg = (i: number, state = store) =>
  state.imgMap[state.imgList[i]];

/** 找到指定 url 图片在 imgList 里的 index */
export const getImgIndexs = (url: string) => {
  const indexList: number[] = [];
  for (const [i, imgUrl] of store.imgList.entries())
    if (imgUrl === url) indexList.push(i);
  return indexList;
};

/** 找到指定 url 图片的 dom */
export const getImgEle = (url: string) =>
  refs.mangaFlow.querySelector<HTMLImageElement>(`img[data-src="${url}"]`);

/** 找到指定页面所处的图片流 */
export const findFillIndex = (pageIndex: number, fillEffect: FillEffect) => {
  let nowFillIndex = pageIndex;
  while (!Reflect.has(fillEffect, nowFillIndex)) nowFillIndex -= 1;
  return nowFillIndex;
};

/** 触发 onOptionChange */
const triggerOnOptionChange = throttle(
  () =>
    store.prop.OptionChange?.(difference(store.option, store.defaultOption)),
  1000,
);

/** 在 option 后手动触发 onOptionChange */
export const setOption = (fn: (option: Option, state: State) => void) => {
  setState((state) => fn(state.option, state));
  triggerOnOptionChange();
};

/** 创建一个专门用于修改指定配置项的函数 */
export const createStateSetFn =
  <T = unknown>(name: string) =>
  (val: T) =>
    setOption((draftOption) => byPath(draftOption, name, () => val));

/** 创建用于将 ref 绑定到对应 state 上的工具函数 */
export const bindRef =
  <T extends HTMLElement = HTMLElement>(name: keyof typeof refs) =>
  (e: T) =>
    Reflect.set(refs, name, e);

export const watchDomSize = <T extends HTMLElement = HTMLElement>(
  name: keyof State,
  e: T,
) => {
  const resizeObserver = new ResizeObserver(([{ contentRect }]) => {
    if (!contentRect.width || !contentRect.height) return;
    setState((state) => {
      (state[name] as any) = {
        width: contentRect.width,
        height: contentRect.height,
      };
    });
  });
  resizeObserver.disconnect();
  resizeObserver.observe(e);
  onCleanup(() => resizeObserver.disconnect());
};

/** 将界面恢复到正常状态 */
export const resetUI = (state: State) => {
  state.show.toolbar = false;
  state.show.scrollbar = false;
  state.show.touchArea = false;
};
