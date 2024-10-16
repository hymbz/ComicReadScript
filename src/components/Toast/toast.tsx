import { log } from 'helper';

import { creatId, setState, store, dismiss } from './store';
import { init } from './Toaster';

import type { Message, Toast } from '.';

export const toast = (msg: Message, options?: Partial<Toast>) => {
  if (!msg) return;

  init();
  const id = options?.id ?? (typeof msg === 'string' ? msg : creatId());

  setState((state) => {
    if (Reflect.has(state.map, id)) {
      Object.assign(state.map[id], { msg, ...options, update: true });
      return;
    }

    state.map[id] = {
      id,
      type: 'info',
      duration: 3000,
      msg,
      ...options,
    };
    state.list.push(id);
  });

  /** 弹窗后记录一下 */
  let fn: (...args: unknown[]) => void = log;
  switch (options?.type) {
    case 'warn':
      fn = log.warn;
      break;
    case 'error':
      fn = log.error;
      break;
  }

  fn('Toast:', msg);

  if (options?.throw && typeof msg === 'string') throw new Error(msg);
};

toast.dismiss = dismiss;

toast.set = (id: string, options: Partial<Toast>) => {
  if (!Reflect.has(store.map, id)) return;
  setState((state) => Object.assign(state.map[id], options));
};

toast.success = (msg: string, options?: Partial<Toast>) =>
  toast(msg, { ...options, exit: undefined, type: 'success' });
toast.warn = (msg: string, options?: Partial<Toast>) =>
  toast(msg, { ...options, exit: undefined, type: 'warn' });
toast.error = (msg: string, options?: Partial<Toast>) =>
  toast(msg, { ...options, exit: undefined, type: 'error' });
