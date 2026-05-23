import { css, mountComponents } from 'helper';
import {
  type Component,
  For,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';

import classes from './index.module.css';
import style from './index.module.css?inline';
import { setState, store } from './store';
import { ToastItem } from './ToastItem';

export const Toaster: Component = () => {
  const [visible, setVisible] = createSignal(
    document.visibilityState === 'visible',
  );

  onMount(() => {
    css(style, store.ref);

    const handleVisibilityChange = () => {
      setVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    onCleanup(() =>
      document.removeEventListener('visibilitychange', handleVisibilityChange),
    );
  });

  return (
    <div
      ref={(ref) => setState('ref', ref)}
      class={classes.root}
      data-paused={visible() ? undefined : ''}
    >
      <For each={store.list}>{(id) => <ToastItem {...store.map[id]} />}</For>
    </div>
  );
};

let dom: HTMLDivElement;
export const init = () => {
  if (dom || store.ref) return;
  dom = mountComponents('toast', () => <Toaster />);
  dom.style.setProperty('z-index', '2147483647', 'important');
};
