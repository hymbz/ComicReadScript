declare module '*.css';

declare module 'rollup-plugin-watch-assets';

declare const DEV_PORT: number;
declare const isDevMode: boolean;

declare module '*.svg' {
  // import type { Component, ComponentProps } from 'solid-js';

  // const c: Component<ComponentProps<'svg'>>;
  // export default c;

  const src: string;
  export default src;
}
