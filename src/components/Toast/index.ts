import type { Component } from 'solid-js';

export { toast } from './toast';
export { Toaster } from './Toaster';

export type Toast = {
  id: string;
  duration: number;
  type: 'info' | 'success' | 'warn' | 'error' | 'custom';
  msg: Message;
  /** 显示的进度 */
  schedule?: number;
  /** 弹窗完报错 */
  throw?: true | Error;
  onDismiss?: (t: Toast) => void;
  onClick?: () => void;
  exit?: true;
  update?: true;
};

export type Options = Omit<Toast, 'msg' | 'exit' | 'update'>;

export type Message = string | Component;
