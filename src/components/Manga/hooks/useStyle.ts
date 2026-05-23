import { type StyleMap, css as _css } from 'helper';
import { type Accessor, type JSX, onMount } from 'solid-js';

import { refs } from '../store';

export function css(styles: TemplateStringsArray, ...values: unknown[]): void;
export function css(cssText: string | Accessor<string>): void;
export function css(
  selector: string | Accessor<string>,
  // oxlint-disable-next-line typescript/unified-signatures
  styleMap:
    | StyleMap
    | Accessor<JSX.CSSProperties>
    | (StyleMap | Accessor<JSX.CSSProperties>)[],
): void;
export function css(
  arg1: TemplateStringsArray | string | Accessor<string>,
  arg2?: any,
  ...rest: unknown[]
): void {
  onMount(() => {
    if (typeof arg1 !== 'object' || !('raw' in arg1)) {
      if (arg2 === undefined) _css(arg1, refs.root);
      else _css(arg1, arg2, refs.root);
    } else {
      _css(
        ['', ...arg1] as unknown as TemplateStringsArray,
        refs.root,
        ...rest,
      );
    }
  });
}
