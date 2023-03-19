import type { CSSProperties } from 'react';
import shadow from 'react-shadow';
import type { ToastContent, ToastOptions } from 'react-toastify';
import { ToastContainer, toast } from 'react-toastify';
import ToastStyle from 'react-toastify/dist/ReactToastify.min.css';
// eslint-disable-next-line import/no-cycle
import { useComponentsRoot } from '../helper/utils';

type ToastFunc = (text: ToastContent, options?: ToastOptions) => void;

let selfToast: ToastFunc & {
  info: ToastFunc;
  error: ToastFunc;
  warn: ToastFunc;
  success: ToastFunc;
};

export const useToast = () => {
  if (selfToast) return selfToast;

  const [root] = useComponentsRoot('toast');

  const _selfToast = (text: ToastContent, options?: ToastOptions) => {
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
          {`
            h2 {
              font-size: 1.1em;
              margin: 0;
              margin-bottom: 1em;
            }
            .md {
              text-align: left;
            }
            .md ul, .md h2 {
              margin:0;
              margin-bottom: .5em;
              font-size: 1em;
            }
          `}
        </style>
      </shadow.div>,
    );

    toast(text, { ...options });
  };

  _selfToast.info = (text: ToastContent, options?: ToastOptions) =>
    _selfToast(text, { ...options, type: 'info' });
  _selfToast.error = (text: ToastContent, options?: ToastOptions) =>
    _selfToast(text, { ...options, type: 'error' });
  _selfToast.warn = (text: ToastContent, options?: ToastOptions) =>
    _selfToast(text, { ...options, type: 'warning' });
  _selfToast.success = (text: ToastContent, options?: ToastOptions) =>
    _selfToast(text, { ...options, type: 'success' });

  selfToast = _selfToast;

  return selfToast;
};
