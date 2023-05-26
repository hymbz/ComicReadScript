import { mountComponents } from './helper';
import { ToastStyle, Toaster, toast as _toast } from '../Toast';

let dom: HTMLDivElement;

const init = () => {
  if (!dom)
    dom = mountComponents('toast', () => (
      <>
        <Toaster />
        <style type="text/css">{ToastStyle}</style>
      </>
    ));
};

export const toast = new Proxy(_toast, {
  get(target, propKey: keyof typeof _toast) {
    init();
    return target[propKey];
  },
  apply(target, propKey: keyof typeof _toast, args) {
    init();
    const fn: any = propKey ? target[propKey] : target;
    return fn(...args) as unknown;
  },
});
