import { createScheduled } from '@solid-primitives/scheduled';
import type { Accessor, EffectFunction, MemoOptions } from 'solid-js';
import { createEffect, createMemo, createRoot, getOwner, on } from 'solid-js';
import { isEqual, throttle } from 'helper';

/** 阻止事件冒泡 */
export const stopPropagation = (e: Event) => {
  e.stopPropagation();
};

/** 从头开始播放元素的动画 */
export const playAnimation = (e?: HTMLElement) =>
  e?.getAnimations().forEach((animation) => {
    animation.cancel();
    animation.play();
  });
/** 带有上下文的 createMemo */
export const createRootMemo = ((fn: any, init?: any, options?: any) => {
  const _init = init ?? fn(undefined);
  // 自动为对象类型设置 equals
  const _options =
    options?.equals === undefined && typeof init === 'object'
      ? { ...options, equals: isEqual }
      : options;

  return getOwner()
    ? // eslint-disable-next-line solid/reactivity
      createMemo(fn, _init, _options)
    : // eslint-disable-next-line solid/reactivity
      createRoot(() => createMemo(fn, _init, _options));
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
      // eslint-disable-next-line solid/reactivity
      return [key, createMemo(fn, undefined)];
    }),
  ) as typeof fnMap;

  const map = createMemo(() => {
    const obj = {} as Return;
    Object.keys(memoMap).forEach((key) =>
      Reflect.set(obj, key, memoMap[key]()),
    );
    return obj;
  });
  return map;
};

export const createEffectOn = ((deps: any, fn: any, options?: any) =>
  createEffect(on(deps, fn, options))) as typeof on;
