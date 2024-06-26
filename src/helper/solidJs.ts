import { createScheduled } from '@solid-primitives/scheduled';
import {
  type Accessor,
  type EffectFunction,
  type MemoOptions,
  createEffect,
  createRoot,
  getOwner,
  on,
  createSignal,
  createMemo,
} from 'solid-js';

import { isEqual, throttle } from '.';

/** 会自动设置 equals 的 createSignal */
export const createEqualsSignal = ((init: any, options?: any) =>
  createSignal(init, { equals: isEqual, ...options })) as typeof createSignal;

/** 会自动设置 equals 和 createRoot 的 createMemo */
export const createRootMemo = ((fn: any, init?: any, options?: any) => {
  const _init = init ?? fn(undefined);
  // 自动为对象类型设置 equals
  const _options =
    options?.equals === undefined && typeof init === 'object'
      ? { ...options, equals: isEqual }
      : options;

  return getOwner()
    ? createMemo(fn, _init, _options)
    : createRoot(() => createMemo(fn, _init, _options));
}) as typeof createMemo;

/** 节流的 createMemo */
export const createThrottleMemo = <T>(
  fn: EffectFunction<T | undefined, T>,
  wait = 100,
  init = fn(undefined),
  options: MemoOptions<T> | undefined = undefined,
) => {
  const scheduled = createScheduled((_fn) => throttle(_fn, wait));
  return createRootMemo<T>(
    (prev) => (scheduled() ? fn(prev) : prev),
    init,
    options,
  );
};

export const createMemoMap = <Return extends Record<string, any>>(fnMap: {
  [P in keyof Return]: Accessor<Return[P]>;
}) => {
  const memoMap = Object.fromEntries(
    Object.entries(fnMap).map(([key, fn]) => {
      // 如果函数已经是 createMemo 创建的，就直接使用
      if (fn.name === 'bound readSignal') return [key, fn];
      return [key, createRootMemo(fn, undefined)];
    }),
  ) as typeof fnMap;

  const map = createRootMemo(() => {
    const obj = {} as Return;
    for (const key of Object.keys(memoMap))
      Reflect.set(obj, key, memoMap[key]());
    return obj;
  });
  return map;
};

export const createEffectOn = ((deps: any, fn: any, options?: any) =>
  getOwner()
    ? createEffect(on(deps, fn, options))
    : createRoot(() => createEffect(on(deps, fn, options)))) as typeof on;
