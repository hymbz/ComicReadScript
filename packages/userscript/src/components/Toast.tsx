import toast, { Toaster } from 'solid-toast';
// eslint-disable-next-line import/no-cycle
import { useComponentsRoot } from '../helper/utils';

let mounted = false;

export const useToast = () => {
  if (!mounted) {
    const [render] = useComponentsRoot('toast');
    render(() => <Toaster />);
    mounted = true;
  }

  return toast;
};
