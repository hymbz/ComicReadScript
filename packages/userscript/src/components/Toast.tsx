import type { CSSProperties } from 'react';
import shadow from 'react-shadow';
import type { ToastContent, ToastOptions } from 'react-toastify';
import { ToastContainer, toast } from 'react-toastify';
import ToastStyle from 'react-toastify/dist/ReactToastify.min.css';
import { useComponentsRoot } from '../helper';

export const useToast = () => {
  const [root] = useComponentsRoot('toast');

  return (text: ToastContent, options?: ToastOptions) => {
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
};
