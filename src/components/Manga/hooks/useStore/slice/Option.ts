import { setState } from '..';
import type { Option } from '../OptionState';

/** 通过重新解构赋值 option 以触发 onOptionChange */
export const setOption = (fn: (option: Option) => void) => {
  setState((state) => {
    fn(state.option);
    state.option = { ...state.option };
  });
};
