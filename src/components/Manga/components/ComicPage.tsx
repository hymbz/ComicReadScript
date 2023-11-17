import { For, type Component, createMemo } from 'solid-js';
import { boolDataVal, isEqualArray } from '../../../helper';
import { store } from '../hooks/useStore';
import { getPageTip } from '../hooks/useStore/slice';
import type { ComicImgProps } from './ComicImg';
import { ComicImg } from './ComicImg';

import classes from '../index.module.css';

export interface ComicPageProps {
  page: [number] | [number, number];
  index: number;
}

export const ComicPage: Component<ComicPageProps> = (props) => {
  const show = createMemo(
    () =>
      store.gridMode ||
      store.option.scrollMode ||
      store.memo.renderPageList.some((page) => isEqualArray(page, props.page)),
  );

  const fill = createMemo<undefined | ComicImgProps['fill'][]>(() => {
    if (props.page.length === 1) return undefined;

    // 判断是否有填充页
    const fillIndex = props.page.indexOf(-1);
    if (fillIndex !== -1)
      return store.option.dir !== 'rtl' ? ['right', 'left'] : ['left', 'right'];

    return undefined;
  });

  const style = createMemo(() => {
    if (!store.gridMode) return {};
    const highlight = props.index === store.activePageIndex;
    const tip = getPageTip(props.index);
    return {
      '--tip': highlight ? `">    ${tip}    <"` : `"${tip}"`,
      'box-shadow': highlight ? 'var(--text_secondary) 0 0 1em' : undefined,
    };
  });

  return (
    <div
      class={classes.page}
      data-show={boolDataVal(show())}
      data-index={props.index}
      style={style()}
    >
      <For each={props.page} fallback={<h1>NULL</h1>}>
        {(imgIndex, i) => <ComicImg index={imgIndex} fill={fill()?.[i()]} />}
      </For>
    </div>
  );
};
