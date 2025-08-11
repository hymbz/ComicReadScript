import type { Component } from 'solid-js';

import { onAutoMount } from 'helper';

export const EmptyTip: Component = () => {
  let ref!: HTMLHeadingElement; // oxlint-disable-line no-unassigned-vars

  onAutoMount(() => {
    let timeoutId = 0;
    const observer = new IntersectionObserver(
      ([{ isIntersecting }]) => {
        if (!isIntersecting) return;
        timeoutId = window.setTimeout(() => {
          ref?.style.removeProperty('opacity');
          timeoutId = 0;
        }, 2000);
      },
      { threshold: 1 },
    );
    observer.observe(ref);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  });

  return <h1 ref={ref} style={{ opacity: 0 }} textContent="NULL" />;
};
