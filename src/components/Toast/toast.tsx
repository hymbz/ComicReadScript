import type { Message, Toast } from '.';
import { creatId, setState, store } from './helper';

export const toast = (msg: Message, options?: Partial<Toast>) => {
  if (!msg) return;

  const newToast: Toast = {
    id: (typeof msg === 'string' ? msg : options?.id) ?? creatId(),
    type: typeof msg === 'string' ? 'info' : 'custom',
    duration: 3000,
    msg,
    ...options,
  };
  const { id } = newToast;

  setState((state) => {
    if (Reflect.has(state.map, id)) {
      Object.assign(state.map[id], newToast, { update: true });
      return;
    }

    state.list.push(newToast.id);
    state.map[id] = newToast;
  });
};

toast.dismiss = (id: string) => {
  if (!Reflect.has(store.map, id)) return;

  setState((state) => {
    state.map[id].exit = true;
  });
};

toast.success = (msg: string, options?: Partial<Toast>) =>
  toast(msg, { ...options, type: 'success' });
toast.warn = (msg: string, options?: Partial<Toast>) =>
  toast(msg, { ...options, type: 'warn' });
toast.error = (msg: string, options?: Partial<Toast>) =>
  toast(msg, { ...options, type: 'error' });
