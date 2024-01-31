import {
  Show,
  type Component,
  createSignal,
  onMount,
  onCleanup,
} from 'solid-js';

export const EmptyTip: Component = () => {
  const [show, setShow] = createSignal(false);

  onMount(() => {
    let timeoutId = window.setTimeout(() => {
      setShow(true);
      timeoutId = 0;
    }, 2000);
    onCleanup(() => timeoutId && clearTimeout(timeoutId));
  });

  return (
    <Show when={show()}>
      <h1>NULL</h1>
    </Show>
  );
};
