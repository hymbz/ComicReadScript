import type { JSX } from 'solid-js';

import 'solid-js';

declare global {
  type EventHandler<T = HTMLElement> = JSX.CustomEventHandlersCamelCase<T>;

  type ClassList = {
    [k: string]: boolean | undefined;
  };

  /** 在打包时将此函数调用替换为 dist 文件夹下的指定文件内容 */
  declare const inject: (name: string) => void;

  declare const DEV_PORT: number;

  declare module '*.module.css' {
    export const css: string;
    const classes: CSSModuleClasses;
    export default classes;
  }
}

declare module 'solid-js' {
  namespace JSX {
    type ElementProps<T> = {
      // Add both the element's prefixed properties and the attributes
      [K in keyof T]: Props<T[K]> & HTMLAttributes<T[K]>;
    };
    // Prefixes all properties with `prop:` to match Solid's property setting syntax
    type Props<T> = {
      [K in keyof T as `prop:${string & K}`]?: T[K];
    };
    interface IntrinsicElements extends ElementProps<HTMLElementTagNameMap> {
      'crs-fab': any;
    }
  }
}

declare module '*.css';

declare module 'rollup-plugin-watch-assets';

declare module '*.svg' {
  const src: string;
  export default src;
}
declare module '*?inline' {
  const src: string;
  export default src;
}
