import type { Component } from 'solid-js';

import { For } from 'solid-js';

import { boolDataVal, createThrottleMemo } from 'helper';

import type { ComicImg } from '../store/image';

import { getImg, isOnePageMode, isUpscale, scrollLength } from '../actions';
import classes from '../index.module.css';
import { store } from '../store';

type ScrollbarPageItem = {
  /** 翻页模式下是图片数量，卷轴模式下是图片长度之和 */
  num: number;
  loadType: ComicImg['loadType'];
  isNull: boolean;
  translationType: ComicImg['translationType'];
  upscale?: 'loading' | true;
};

const getScrollbarPage = (
  img: ComicImg,
  i: number,
  double = false,
): ScrollbarPageItem => {
  let num: number;
  if (store.option.scrollMode.enabled) num = getImg(i).size.height;
  else num = double ? 2 : 1;

  let upscale: ScrollbarPageItem['upscale'];
  if (isUpscale() && img.upscaleUrl !== undefined)
    upscale = img.upscaleUrl === '' ? 'loading' : true;

  return {
    num,
    loadType: img.loadType,
    isNull: !img.src,
    translationType: img.translationType,
    upscale,
  };
};

const ScrollbarPage: Component<ScrollbarPageItem> = (props) => (
  <div
    class={classes.scrollbarPage}
    style={{ 'flex-basis': `${(props.num / scrollLength()) * 100}%` }}
    data-type={props.loadType}
    data-null={boolDataVal(props.isNull)}
    data-translation-type={props.translationType}
    data-upscale={props.upscale}
  />
);

const isSameItem = (a: ScrollbarPageItem, b: ScrollbarPageItem) =>
  a.loadType === b.loadType &&
  a.isNull === b.isNull &&
  a.translationType === b.translationType &&
  a.upscale === b.upscale;

/** 显示对应图片加载情况的元素 */
export const ScrollbarPageStatus = () => {
  // 将相同类型的页面合并显示
  const scrollbarPageList = createThrottleMemo(() => {
    if (store.pageList.length === 0) return [];

    const list: ScrollbarPageItem[] = [];
    let item: ScrollbarPageItem | undefined;

    const handleImg = (i: number, double = false) => {
      const img = getImg(i);
      const imgItem = getScrollbarPage(img, i, double);

      if (!item) {
        item = imgItem;
        return;
      }

      if (isSameItem(item, imgItem)) {
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
