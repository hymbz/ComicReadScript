import type { State } from '..';
import { setState } from '..';
import type { Option } from '../OptionState';

/** 通过重新解构赋值 option 以触发 onOptionChange */
export const setOption = (fn: (option: Option) => void) => {
  setState((state) => {
    fn(state.option);
    state.option = { ...state.option };
  });
};

/** 切换指定 option 的布尔值 */
export const switchOption = (name: string) => {
  const path = name.split('.');
  setOption((draftOption) => {
    let target = draftOption;
    while (path.length > 1) {
      const key = path.shift();
      if (!key) break;
      target = target[key];
    }
    if (typeof target[path[0]] !== 'boolean') return;
    target[path[0]] = !target[path[0]];
  });
};

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
