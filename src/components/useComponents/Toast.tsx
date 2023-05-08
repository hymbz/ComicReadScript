import MdCheckCircle from '@material-design-icons/svg/round/check_circle.svg';
import MdWarning from '@material-design-icons/svg/round/warning.svg';
import MdError from '@material-design-icons/svg/round/error.svg';

import type { ToastOptions } from 'solid-toast';
import solidToast, { Toaster } from 'solid-toast';

import { mountComponents } from '../../helper';

let dom: HTMLDivElement;

export const toast = (message: string, opts?: ToastOptions) => {
  if (!dom) {
    dom = mountComponents('toast', () => (
      <Toaster
        position="bottom-right"
        containerStyle={{ 'z-index': '9999999999' }}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#f3f4f6',
          },
        }}
      />
    ));
  }

  solidToast(message, opts);
};

toast.success = (message: string, opts?: ToastOptions) =>
  toast(message, {
    icon: (
      <div style={{ color: '#23bb35', display: 'flex' }}>
        <MdCheckCircle />
      </div>
    ),
    ...opts,
  });
toast.warn = (message: string, opts?: ToastOptions) =>
  toast(message, {
    icon: (
      <div style={{ color: '#f0c53e', display: 'flex' }}>
        <MdWarning />
      </div>
    ),
    ...opts,
  });
toast.error = (message: string, opts?: ToastOptions) =>
  toast(message, {
    icon: (
      <div style={{ color: '#e45042', display: 'flex' }}>
        <MdError />
      </div>
    ),
    ...opts,
  });
