import { createSignal, onCleanup } from 'solid-js';

export const useDomSize = () => {
  const [domSize, setDomSize] = createSignal(
    { width: 0, height: 0 },
    // 宽高为零时不触发变更
    { equals: (_, { width, height }) => !width || !height },
  );

  const initResizeObserver = (dom: HTMLElement) => {
    setDomSize({ width: dom.scrollWidth, height: dom.scrollHeight });
    const resizeObserver = new ResizeObserver(([{ contentRect }]) =>
      setDomSize({ width: contentRect.width, height: contentRect.height }),
    );
    resizeObserver.disconnect();
    resizeObserver.observe(dom);
    onCleanup(() => resizeObserver.disconnect());
  };

  return [domSize, initResizeObserver] as const;
};
