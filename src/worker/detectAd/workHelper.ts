export type MainFn = {
  log: typeof import('helper').log;
  showCanvas?: typeof import('worker/helper').showCanvas;
  showGrayList?: typeof import('worker/helper').showGrayList;
};
export const mainFn = {} as MainFn;
export const setMainFn = (helper: MainFn, keys: string[]) => {
  for (const name of keys)
    Reflect.set(mainFn, name, (...args: any[]) =>
      Reflect.apply(helper[name], helper, args),
    );
};

/** 计算 rgb 的灰度 */
export const toGray = (r: number, g: number, b: number) =>
  Math.round(0.299 * r + 0.587 * g + 0.114 * b);
