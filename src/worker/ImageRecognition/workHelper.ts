import { type MainFn } from './types';

export type { MainFn } from './types';

export const mainFn = {} as MainFn;
export const setMainFn = (helper: Partial<MainFn>, keys: string[]) => {
  for (const name of keys) {
    const fn = helper[name];
    if (!fn) continue;
    Reflect.set(mainFn, name, (...args: any[]) =>
      Reflect.apply(fn, helper, args),
    );
  }
};
