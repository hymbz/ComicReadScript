import type { Component } from 'solid-js';

import { css as style } from './index.module.css';

export const ToastStyle = style;

export { Toaster } from './Toaster';
export { toast } from './toast';

export interface Toast {
  id: string;
  duration: number;
  type: 'info' | 'success' | 'warn' | 'error' | 'custom';
  msg: Message;
  schedule?: number;
  onDismiss?: (t: Toast) => void;
  exit?: true;
  update?: true;
}

export type Options = Omit<Toast, 'msg' | 'exit' | 'update'>;

export type Message = string | Component;
