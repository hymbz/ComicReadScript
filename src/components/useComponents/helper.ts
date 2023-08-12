import type { JSX } from 'solid-js';
import { render } from 'solid-js/web';

/** 挂载 solid-js 组件 */
export const mountComponents = (id: string, fc: () => JSX.Element) => {
  const dom = document.createElement('div');
  dom.id = id;
  dom.style.setProperty('display', 'unset', 'important');
  document.body.appendChild(dom);
  const shadowDom = dom.attachShadow({ mode: 'closed' });
  render(fc, shadowDom);
  return dom;
};
