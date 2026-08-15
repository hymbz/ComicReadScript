// oxlint-disable consistent-type-definitions
import { type JSX } from 'solid-js';

declare global {
  const isDevMode: boolean;

  const scriptVersion: string;

  const __LATEST_CHANGES__: Record<
    string,
    { date: string; feat?: string[]; fix?: string[]; perf?: string[] }
  >;

  type EventHandler<T = HTMLElement> = JSX.DOMAttributes<T>;

  type TrueValue<T> = Exclude<T, void | false | undefined | null>;

  type AsyncReturnType<T extends (...args: any[]) => Promise<any>> = Awaited<
    ReturnType<T>
  >;

  function selfImport(name: string): void;

  /** 将指定的 i18n 字段在打包时单独提取为一个函数，避免导入 main */
  const extractI18n: (key: string) => (lang: string) => string;

  interface Window {
    crsLib?: {
      [k: string]: any;
      GM_xmlhttpRequest: GM_xmlhttpRequest;
    };
  }

  interface String {
    // 接口声明合并时仅方法签名能覆盖内置重载，使 groups 变为必填
    // oxlint-disable-next-line typescript/method-signature-style
    matchAll(
      regexp: RegExp,
    ): IterableIterator<
      Omit<RegExpMatchArray, 'groups'> & { groups: Record<string, string> }
    >;
    // oxlint-disable-next-line typescript/method-signature-style
    match(regexp: string | RegExp):
      | (Omit<RegExpMatchArray, 'groups'> & {
          groups: Record<string, string>;
        })
      | null;
  }

  interface RegExp {
    // oxlint-disable-next-line typescript/method-signature-style
    exec(string: string):
      | (Omit<RegExpExecArray, 'groups'> & {
          groups: Record<string, string>;
        })
      | null;
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
