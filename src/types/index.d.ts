// oxlint-disable consistent-type-definitions
import type { Component, JSX } from 'solid-js';

declare global {
  declare const isDevMode: boolean;

  declare const scriptVersion: string;

  type EventHandler<T = HTMLElement> = JSX.DOMAttributes<T>;

  type TrueValue<T> = Exclude<T, void | false | undefined | null>;

  type AsyncReturnType<T extends (...args: any[]) => Promise<any>> = Awaited<
    ReturnType<T>
  >;

  /** 在打包时将此函数调用替换为 dist 文件夹下的指定文件内容 */
  declare const inject: <T = string>(name: string) => T;

  /** 将指定的 i18n 字段在打包时单独提取为一个函数，避免导入 main */
  declare const extractI18n: (key: string) => (lang: string) => string;

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
      [k: string]: any;
      GM_xmlhttpRequest: GM_xmlhttpRequest;
    };
  }
}

declare module 'solid-js' {
  namespace JSX {
    interface ExplicitAttributes {
      // attr:___
      [k: string]: string; // oxlint-disable-line consistent-indexed-object-style
    }

    type KeyboardEventSelf = KeyboardEvent & {
      currentTarget: HTMLElement;
      target: Element;
    };
    type MouseEventSelf = MouseEvent & {
      currentTarget: HTMLButtonElement;
      target: Element;
    };

    type InputEventSelf = InputEvent & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    };

    interface CustomEvents {
      keydown: KeyboardEventSelf;
      keyup: KeyboardEventSelf;
      keypress: KeyboardEventSelf;
      click: MouseEventSelf;
      mousedown: MouseEventSelf;
      mousemove: MouseEventSelf;
      input: InputEventSelf;
      wheel: WheelEvent;
    }

    interface CustomCaptureEvents {
      keydown: KeyboardEventSelf;
      keyup: KeyboardEventSelf;
      keypress: KeyboardEventSelf;
      click: MouseEventSelf;
      mousedown: MouseEventSelf;
      mousemove: MouseEventSelf;
      input: InputEventSelf;
      wheel: WheelEvent;
    }
  }
}
