import { type JSX, createEffect, createRoot, on } from 'solid-js';
import { render } from 'solid-js/web';

const getDom = (id: string) => {
  let dom = document.getElementById(id) as HTMLDivElement | null;
  if (dom) {
    dom.innerHTML = '';
    return dom;
  }

  dom = document.createElement('div');
  dom.id = id;
  document.body.appendChild(dom);
  return dom;
};

/** 挂载 solid-js 组件 */
export const mountComponents = (id: string, fc: () => JSX.Element) => {
  const dom = getDom(id);
  dom.style.setProperty('display', 'unset', 'important');
  const shadowDom = dom.attachShadow({ mode: 'closed' });
  render(fc, shadowDom);
  return dom;
};

export const watchStore = ((deps: any, fn: any, options = { defer: true }) =>
  createRoot(() => createEffect(on(deps, fn, options)))) as typeof on;
