import { type Component, For, createMemo } from 'solid-js';
import { boolDataVal } from 'helper';
import { createThrottleMemo } from 'helper/solidJs';

import { store } from '../store';
import { contentHeight, imgHeightList } from '../actions';
import classes from '../index.module.css';

interface ScrollbarPageItem {
  /** 图片数量 */
  num: number;
  /** 图片长度之和 */
  length: number;
  loadType: ComicImg['loadType'];
  isNull: boolean;
  translationType: ComicImg['translationType'];
}

const getScrollbarPage = (img: ComicImg, i: number): ScrollbarPageItem => ({
  num: 1,
  length: imgHeightList()[i],
  loadType: img.loadType,
  isNull: !img.src,
  translationType: img.translationType,
});

const ScrollbarPage: Component<ScrollbarPageItem> = (props) => {
  const flexBasis = createMemo(() =>
    store.option.scrollMode
      ? props.length / contentHeight()
      : props.num / store.imgList.length,
  );

  return (
    <div
      class={classes.scrollbarPage}
      style={{ 'flex-basis': `${flexBasis() * 100}%` }}
      data-type={props.loadType}
      data-null={boolDataVal(props.isNull)}
      data-translation-type={props.translationType}
    />
  );
};

/** 显示对应图片加载情况的元素 */
export const ScrollbarPageStatus = () => {
  // 将相同类型的页面合并显示
  const scrollbarPageList = createThrottleMemo(() => {
    if (store.pageList.length === 0) return [];

    const list: ScrollbarPageItem[] = [];
    let item: ScrollbarPageItem | undefined;

    const handleImg = (i: number) => {
      const img = store.imgList[i];

      if (!item) {
        item = getScrollbarPage(img, i);
        return;
      }

      if (
        img.loadType === item.loadType &&
        !img.src === item.isNull &&
        img.translationType === item.translationType
      ) {
        item.num += 1;
        item.length += imgHeightList()[i];
      } else {
        list.push(item);
        item = getScrollbarPage(img, i);
      }
    };

    for (let i = 0; i < store.pageList.length; i++) {
      const [a, b] = store.pageList[i];
      if (b === undefined) handleImg(a);
      else if (a === -1) {
        handleImg(b);
        handleImg(b);
      } else if (b === -1) {
        handleImg(a);
        handleImg(a);
      } else {
        handleImg(a);
        handleImg(b);
      }
    }

    if (item) list.push(item);

    return list;
  }, 100);

  return (
    <For each={scrollbarPageList()}>
      {(page) => <ScrollbarPage {...page} />}
    </For>
  );
};
