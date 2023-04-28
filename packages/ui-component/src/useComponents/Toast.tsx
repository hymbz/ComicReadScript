import toast, { Toaster } from 'solid-toast';
import { useComponentsRoot } from '../helper';

let mounted = false;

export const useToast = () => {
  if (!mounted) {
    const [render] = useComponentsRoot('toast');
    render(() => <Toaster />);
    mounted = true;
  }

  return toast;
};
