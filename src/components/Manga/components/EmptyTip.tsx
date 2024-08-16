import { type Component, onMount, onCleanup } from 'solid-js';

export const EmptyTip: Component = () => {
  let ref: HTMLHeadingElement;

  onMount(() => {
    let timeoutId = window.setTimeout(() => {
      ref?.style.removeProperty('display');
      timeoutId = 0;
    }, 2000);
    onCleanup(() => timeoutId && clearTimeout(timeoutId));
  });

  return <h1 ref={ref!} style={{ display: 'none' }} textContent="NULL" />;
};
