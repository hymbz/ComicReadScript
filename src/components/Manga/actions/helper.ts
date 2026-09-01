import {
  type SetStateFunction,
  byPath,
  debounce,
  difference,
  throttle,
} from 'helper';
import { onCleanup } from 'solid-js';

import { type State, refs, setState, store } from '../store';
import { type Option } from '../store/option';
import { imgIndexMap } from './memo/img';

export const getImg = (i: number, state = store) =>
  state.imgMap[state.imgList[i]];

/** 找到指定 url 图片在 imgList 里的 index */
export const getImgIndexs = (url: string) => imgIndexMap().get(url) ?? [];

/** 找到指定 url 图片的 dom */
export const getImgEle = (target: string | number, loaded = false) => {
  const url = typeof target === 'number' ? store.imgList[target] : target;
  for (const element of refs.imgEleMap[url] ?? [])
    if (!loaded || element.complete) return element;
};

/** 触发 onOptionChange */
const triggerOnOptionChange = throttle(
  () =>
    store.prop.onOptionChange?.(difference(store.option, store.defaultOption)),
  1000,
);

type SetOptionFunction = ((
  fn: (option: Option, state: State) => void,
) => void) &
  SetStateFunction<Option>;

/** 在 option 后手动触发 onOptionChange */
export const setOption: SetOptionFunction = (...args) => {
  if (args.length === 1 && typeof args[0] === 'function')
    setState((state) => args[0](state.option, state));
  else setState('option', ...(args as [any]));
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
  state.show.pageTip = false;
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

type PathValue<T, P extends readonly unknown[]> = P extends readonly [
  infer K extends keyof T,
  ...infer R,
]
  ? PathValue<T[K], R>
  : T;

export type SetOptionsFunction<T> = {
  <
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
  >(
    ...path: [K1, K2, K3, K4, K5]
  ): SetOptionsFunctionReturn<PathValue<T, [K1, K2, K3, K4, K5]>>;

  <
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
  >(
    ...path: [K1, K2, K3, K4]
  ): SetOptionsFunctionReturn<PathValue<T, [K1, K2, K3, K4]>>;

  <K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(
    ...path: [K1, K2, K3]
  ): SetOptionsFunctionReturn<PathValue<T, [K1, K2, K3]>>;

  <K1 extends keyof T, K2 extends keyof T[K1]>(
    ...path: [K1, K2]
  ): SetOptionsFunctionReturn<PathValue<T, [K1, K2]>>;

  <K1 extends keyof T>(
    ...path: [K1]
  ): SetOptionsFunctionReturn<PathValue<T, [K1]>>;
};
export const bindOption: SetOptionsFunction<Option> = (...path: string[]) => ({
  value: byPath(store.option, path),
  onChange: (val: unknown) => setOption(...(path as [any]), val),
});
