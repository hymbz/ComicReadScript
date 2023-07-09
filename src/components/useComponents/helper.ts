import type { JSX } from 'solid-js';
import { render } from 'solid-js/web';

/** 挂载 solid-js 组件 */
export const mountComponents = (id: string, fc: () => JSX.Element) => {
  const dom = document.createElement('div');
  dom.id = id;
  // TODO:
  // 目前 solidjs 的所有事件都是在 document 上监听的
  // 所以现在没法阻止脚本元素上的事件触发原网页的快捷键
  // 需要等待 solidjs 更新
  // https://github.com/solidjs/solid/issues/1786
  //
  // ['click', 'keydown', 'keypress', 'keyup'].forEach((eventName) =>
  //   dom.addEventListener(eventName, (e: Event) => e?.stopPropagation()),
  // );
  document.body.appendChild(dom);
  const shadowDom = dom.attachShadow({ mode: 'open' });
  render(fc, shadowDom);
  return dom;
};
