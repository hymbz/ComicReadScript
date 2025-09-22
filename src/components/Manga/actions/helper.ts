import { onCleanup } from 'solid-js';

import { byPath, debounce, difference, throttle } from 'helper';

import type { State } from '../store';
import type { FillEffect } from '../store/image';
import type { Option } from '../store/option';

import { refs, setState, store } from '../store';

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
export const getImgEle = (target: string | number) => {
  const index =
    typeof target === 'number' ? target : store.imgList.indexOf(target);
  if (index === -1) return;
  return refs.mangaFlow.querySelector<HTMLImageElement>(`#_${index}_0 img`);
};

/** 找到指定页面所处的图片流 */
export const findFillIndex = (pageIndex: number, fillEffect: FillEffect) => {
  let nowFillIndex = pageIndex;
  while (!Reflect.has(fillEffect, nowFillIndex)) nowFillIndex -= 1;
  return nowFillIndex;
};

/** 触发 onOptionChange */
const triggerOnOptionChange = throttle(
  () =>
    store.prop.onOptionChange?.(difference(store.option, store.defaultOption)),
  1000,
);

/** 在 option 后手动触发 onOptionChange */
export const setOption = (fn: (option: Option, state: State) => void) => {
  setState((state) => fn(state.option, state));
  triggerOnOptionChange();
};

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

// 特意使用 requestAnimationFrame 和 .click() 是为了能和 Vimium 兼容
// （虽然因为使用了 shadow dom 的缘故实际还是不能兼容，但说不定之后就改了呢
export const focus = () =>
  requestAnimationFrame(() => {
    refs.mangaBox?.click();
    refs.mangaBox?.focus();
  });

/** 将函数的 state 参数变为可选 */
export const withOptionalState =
  <T, Args extends unknown[] = []>(fn: (...args: [...Args, State]) => T) =>
  (...args: [...Args, State?]) => {
    // 检查是否传入了 state 参数，没有的话自动调用 setState
    if (args.length < fn.length) {
      let result: T;
      setState((state: State) => {
        result = fn(...([...(args as [...Args]), state] as [...Args, State]));
      });
      return result!;
    }
    // 如果传入了 state，直接调用原函数
    return fn(...(args as [...Args, State]));
  };

const closeScrollLock = debounce(() => setState('scrollLock', false), 100);
/** 打开滚动锁，并在之后自动关闭 */
export const openScrollLock = withOptionalState((state: State) => {
  state.scrollLock = true;
  closeScrollLock();
});

type SetOptionsFunctionReturn<T> = {
  value: T;
  onChange: (val: T) => void;
};

export type SetOptionsFunction<T> = {
  <
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
  >(
    k1: K1,
    k2: K2,
    k3: K3,
    k4: K4,
    k5: K5,
  ): SetOptionsFunctionReturn<T[K1][K2][K3][K4][K5]>;

  <
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
  >(
    k1: K1,
    k2: K2,
    k3: K3,
    k4: K4,
  ): SetOptionsFunctionReturn<T[K1][K2][K3][K4]>;

  <K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(
    k1: K1,
    k2: K2,
    k3: K3,
  ): SetOptionsFunctionReturn<T[K1][K2][K3]>;

  <K1 extends keyof T, K2 extends keyof T[K1]>(
    k1: K1,
    k2: K2,
  ): SetOptionsFunctionReturn<T[K1][K2]>;

  <K1 extends keyof T>(k1: K1): SetOptionsFunctionReturn<T[K1]>;
};
export const bindOption: SetOptionsFunction<Option> = (...path: string[]) => ({
  value: byPath(store.option, path),
  onChange: (val: unknown) =>
    setOption((draftOption) => byPath(draftOption, path, () => val)),
});
