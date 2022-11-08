import type { CSSProperties } from 'react';
import shadow from 'react-shadow';
import type { ToastContent, ToastOptions } from 'react-toastify';
import { ToastContainer, toast } from 'react-toastify';
import ToastStyle from 'react-toastify/dist/ReactToastify.min.css';
import { useComponentsRoot } from '../helper';

export const useToast = () => {
  const [root] = useComponentsRoot('toast');

  const toastFunc = (text: ToastContent, options?: ToastOptions) => {
    root.render(
      <shadow.div style={{ fontSize: 16 }}>
        <ToastContainer
          autoClose={1000 * 3}
          style={
            {
              // 进度条颜色
              '--toastify-color-progress-light': '#7A909A',
              // 背景色
              '--toastify-color-light': 'white',
            } as CSSProperties
          }
        />
        <style type="text/css">
          {ToastStyle.replace(':root', '.Toastify')}
        </style>
      </shadow.div>,
    );

    toast(text, { ...options });
  };

  toastFunc.info = (text: ToastContent, options?: ToastOptions) =>
    toastFunc(text, { ...options, type: 'info' });
  toastFunc.error = (text: ToastContent, options?: ToastOptions) =>
    toastFunc(text, { ...options, type: 'error' });
  toastFunc.warn = (text: ToastContent, options?: ToastOptions) =>
    toastFunc(text, { ...options, type: 'warning' });
  toastFunc.success = (text: ToastContent, options?: ToastOptions) =>
    toastFunc(text, { ...options, type: 'success' });

  return toastFunc;
};
