import { onMount, type Accessor } from 'solid-js';
import {
  useStyle as _useStyle,
  useStyleMemo as _useStyleMemo,
} from 'helper/useStyleSheet';

import { refs } from '../store';

export const useStyle = (css: Accessor<string>) =>
  onMount(() => _useStyle(css, refs.root.getRootNode() as Document));

export const useStyleMemo = (
  selector: string,
  styleMapList: Parameters<typeof _useStyleMemo>[1],
) =>
  onMount(() =>
    _useStyleMemo(selector, styleMapList, refs.root.getRootNode() as Document),
  );
