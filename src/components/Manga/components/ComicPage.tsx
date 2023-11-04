import { For, type Component, createMemo } from 'solid-js';
import { boolDataVal, ifNot, isEqualArray } from '../../../helper';
import { store } from '../hooks/useStore';
import type { ComicImgProps } from './ComicImg';
import { ComicImg } from './ComicImg';

import classes from '../index.module.css';

export interface ComicPageProps {
  page: [number] | [number, number];
}

export const ComicPage: Component<ComicPageProps> = (props) => {
  const show = createMemo(
    () =>
      store.option.scrollMode ||
      store.renderPageList.some((page) => isEqualArray(page, props.page)),
  );

  const fill = createMemo<undefined | ComicImgProps['fill'][]>(() => {
    if (props.page.length === 1) return undefined;

    // 判断是否有填充页
    const fillIndex = props.page.indexOf(-1);
    if (fillIndex !== -1)
      return ifNot(fillIndex, store.option.dir !== 'rtl')
        ? ['right', 'left']
        : ['left', 'right'];

    return undefined;
  });

  return (
    <div class={classes.page} data-show={boolDataVal(show())}>
      <For each={props.page} fallback={<h1>NULL</h1>}>
        {(imgIndex, i) => <ComicImg index={imgIndex} fill={fill()?.[i()]} />}
      </For>
    </div>
  );
};
