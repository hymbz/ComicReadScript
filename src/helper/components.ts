import type { JSX } from 'solid-js';

import { render } from 'solid-js/web';

const getDom = (id: string) => {
  let dom = document.getElementById(id) as HTMLDivElement | undefined;
  if (dom) {
    dom.innerHTML = '';
    return dom;
  }

  dom = document.createElement('div');
  dom.id = id;
  document.body.append(dom);
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
