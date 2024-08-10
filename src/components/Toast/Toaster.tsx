import {
  type Component,
  For,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';
import { useStyle } from 'helper';

import { store } from './store';
import { ToastItem } from './ToastItem';
import classes, { css as style } from './index.module.css';

export const [ref, setRef] = createSignal<HTMLElement>();

export const Toaster: Component = () => {
  const [visible, setVisible] = createSignal(
    document.visibilityState === 'visible',
  );

  onMount(() => {
    useStyle(style);

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
      ref={setRef}
      class={classes.root}
      data-paused={visible() ? undefined : ''}
    >
      <For each={store.list}>{(id) => <ToastItem {...store.map[id]} />}</For>
    </div>
  );
};
