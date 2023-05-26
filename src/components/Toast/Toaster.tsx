import type { Component } from 'solid-js';
import { For, createSignal, onCleanup, onMount } from 'solid-js';
import { store } from './helper';
import { ToastItem } from './ToastItem';

import classes from './index.module.css';

export const Toaster: Component = () => {
  const [visible, setVisible] = createSignal(
    document.visibilityState === 'visible',
  );

  onMount(() => {
    const handleVisibilityChange = () => {
      console.log(document.visibilityState);
      setVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    onCleanup(() =>
      document.removeEventListener('visibilitychange', handleVisibilityChange),
    );
  });

  return (
    <div class={classes.root} data-paused={visible() ? undefined : ''}>
      <For each={store.list}>{(id) => <ToastItem {...store.map[id]} />}</For>
    </div>
  );
};
