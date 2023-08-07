import type { JSX, Component } from 'solid-js';

import 'solid-js';

declare global {
  type EventHandler<T = HTMLElement> = JSX.DOMAttributes<T>;

  type ClassList = {
    [k: string]: boolean | undefined;
  };

  /** 在打包时将此函数调用替换为 dist 文件夹下的指定文件内容 */
  declare const inject: <T = string>(name: string) => T;

  declare const DEV_PORT: number;

  declare module '*.module.css' {
    export const css: string;
    const classes: CSSModuleClasses;
    export default classes;
  }

  declare module '*.svg' {
    const fc: Component<JSX.HTMLAttributes<HTMLElement>>;
    export default fc;
  }

  declare module '*.md' {
    const md: {
      html: string;
    };
    export default md;
  }

  interface Window {
    crsLib?: {
      GM_xmlhttpRequest: GM_xmlhttpRequest;
    };
  }
}

declare module 'solid-js' {
  namespace JSX {
    type KeyboardEventSelf = KeyboardEvent & {
      currentTarget: HTMLElement;
      target: Element;
    };

    interface CustomCaptureEvents {
      keydown: KeyboardEventSelf;
      keyup: KeyboardEventSelf;
      keypress: KeyboardEventSelf;
    }
  }
}
