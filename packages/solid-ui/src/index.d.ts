import type { JSX } from 'solid-js';

declare global {
  type EventHandler<T = HTMLElement> = JSX.CustomEventHandlersCamelCase<T>;

  type ClassList = {
    [k: string]: boolean | undefined;
  };
}
