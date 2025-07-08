import type { Component } from 'solid-js';

import { createSignal, For, onCleanup, onMount } from 'solid-js';

import { mountComponents, useStyle } from 'helper';

import classes, { css as style } from './index.module.css';
import { setState, store } from './store';
import { ToastItem } from './ToastItem';

export const Toaster: Component = () => {
  const [visible, setVisible] = createSignal(
    document.visibilityState === 'visible',
  );

  onMount(() => {
    useStyle(style, store.ref!);

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
