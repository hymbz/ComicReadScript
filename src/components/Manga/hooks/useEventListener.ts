import { createEffect, onCleanup } from 'solid-js';

type ListenerItem = {
  listener: EventListener;
  options?: AddEventListenerOptions;
};

export const useEventListener = (ref: () => HTMLElement | undefined) => {
  const listeners = new Map<string, ListenerItem[]>();

  createEffect(() => {
    const el = ref();
    if (!el) return;

    for (const [type, list] of listeners)
      for (const { listener, options } of list)
        el.addEventListener(type, listener, options);

    onCleanup(() => {
      for (const [type, list] of listeners)
        for (const { listener, options } of list)
          el.removeEventListener(type, listener, options);
    });
  });

  return <K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void,
    options?: AddEventListenerOptions,
  ) => {
    const list = listeners.get(type) ?? [];
    list.push({ listener: listener as EventListener, options });
    listeners.set(type, list);
  };
};
