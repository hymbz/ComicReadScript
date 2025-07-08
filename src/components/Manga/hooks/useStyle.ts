import { onMount } from 'solid-js';

import { useStyle as _useStyle, useStyleMemo as _useStyleMemo } from 'helper';

import { refs } from '../store';

export const useStyle: typeof _useStyle = (css) =>
  onMount(() => _useStyle(css, refs.root));

export const useStyleMemo: typeof _useStyleMemo = (selector, styleMapArg) =>
  onMount(() => _useStyleMemo(selector, styleMapArg, refs.root));
