import shadow from 'react-shadow';
import { ToastContainer, toast } from 'react-toastify';
import ToastStyle from 'react-toastify/dist/ReactToastify.css';
import { useComponentsRoot } from '../helper';

export const useToast = () => {
  const [root] = useComponentsRoot('toast');

  return (text: string) => {
    root.render(
      <shadow.div>
        <ToastContainer theme="dark" />
        <style type="text/css">
          {ToastStyle.replace(':root', '.Toastify')}
        </style>
      </shadow.div>,
    );

    toast(text);
  };
};
