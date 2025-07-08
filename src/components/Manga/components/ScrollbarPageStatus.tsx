import type { Component } from 'solid-js';

import { createMemo, For } from 'solid-js';

import { boolDataVal, createThrottleMemo } from 'helper';

import type { ComicImg } from '../store/image';

import { contentHeight, getImg, isOnePageMode } from '../actions';
import classes from '../index.module.css';
import { store } from '../store';

type ScrollbarPageItem = {
  /** 翻页模式下是图片数量，卷轴模式下是图片长度之和 */
  num: number;
  loadType: ComicImg['loadType'];
  isNull: boolean;
  translationType: ComicImg['translationType'];
};

const getScrollbarPage = (
  img: ComicImg,
  i: number,
  double = false,
): ScrollbarPageItem => {
  let num: number;
  if (store.option.scrollMode.enabled) num = getImg(i).size.height;
  else num = double ? 2 : 1;

  return {
    num,
    loadType: img.loadType,
    isNull: !img.src,
    translationType: img.translationType,
  };
};

const ScrollbarPage: Component<ScrollbarPageItem> = (props) => {
  const flexBasis = createMemo(
    () =>
      props.num /
      (store.option.scrollMode.enabled
        ? contentHeight()
        : store.imgList.length),
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

    const handleImg = (i: number, double = false) => {
      const img = getImg(i);

      if (!item) {
        item = getScrollbarPage(img, i, double);
        return;
      }

      if (
        img.loadType === item.loadType &&
        !img.src === item.isNull &&
        img.translationType === item.translationType
      ) {
        if (store.option.scrollMode.enabled) item.num += img.size.height;
        else item.num += double ? 2 : 1;
      } else {
        list.push(item);
        item = getScrollbarPage(img, i, double);
      }
    };

    for (const [a, b] of store.pageList) {
      if (b === undefined) handleImg(a, !isOnePageMode());
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
  }, 200);

  return (
    <For each={scrollbarPageList()}>
      {(page) => <ScrollbarPage {...page} />}
    </For>
  );
};
