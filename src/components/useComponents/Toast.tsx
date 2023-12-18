import { mountComponents } from './helper';
import { ToastStyle, Toaster, toast as _toast } from '../Toast';

let dom: HTMLDivElement;

const init = () => {
  if (dom) return;

  // 提前挂载漫画节点，防止 toast 没法显示在漫画上层
  if (!document.getElementById('comicRead')) {
    const _dom = document.createElement('div');
    _dom.id = 'comicRead';
    document.body.appendChild(_dom);
  }

  dom = mountComponents('toast', () => (
    <>
      <Toaster />
      <style type="text/css">{ToastStyle}</style>
    </>
  ));
  dom.style.setProperty('z-index', '2147483647', 'important');
};

export const toast = new Proxy(_toast, {
  get(target, propKey: keyof typeof _toast) {
    init();
    return target[propKey];
  },
  apply(target, propKey: keyof typeof _toast, args) {
    init();
    const fn: any = propKey in target ? target[propKey] : target;
    return fn(...args) as unknown;
  },
});

unsafeWindow.toast = toast;
