import { difference, byPath } from 'helper';
import type { State } from '..';
import { setState, store } from '..';
import { defaultOption, type Option } from '../OptionState';

/** 通过重新解构赋值 option 以触发 onOptionChange */
export const setOption = (fn: (option: Option) => void) => {
  setState((state) => fn(state.option));

  store.onOptionChange?.(difference(store.option, defaultOption));
};

/** 创建一个专门用于修改指定配置项的函数 */
export const createStateSetFn =
  <T = unknown>(name: string) =>
  (val: T) =>
    setOption((draftOption) => byPath(draftOption, name, () => val));

/** 创建用于将 ref 绑定到对应 state 上的工具函数 */
export const bindRef =
  <T extends HTMLElement = HTMLElement>(
    name: keyof State,
    fn?: (state: State) => void,
  ) =>
  (e: T) => {
    setState((state) => {
      Reflect.set(state, name, e);
      fn?.(state);
    });
  };
