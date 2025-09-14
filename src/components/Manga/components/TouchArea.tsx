import type { Component } from 'solid-js';

import { For } from 'solid-js';

import { boolDataVal, createRootMemo } from 'helper';

import { bindRef } from '../actions';
import classes from '../index.module.css';
import { store } from '../store';

// 用大写表示要在此区块上显示提示
export type Area = 'prev' | 'menu' | 'next' | 'PREV' | 'MENU' | 'NEXT';
type Rows = [Area, Area, Area];
type ArrayConfig = [Rows, Rows, Rows];

export const areaArrayMap = {
  left_right: [
    ['prev', 'menu', 'next'],
    ['PREV', 'MENU', 'NEXT'],
    ['prev', 'menu', 'next'],
  ] as ArrayConfig,
  up_down: [
    ['prev', 'PREV', 'prev'],
    ['menu', 'MENU', 'menu'],
    ['next', 'NEXT', 'next'],
  ] as ArrayConfig,
  edge: [
    ['next', 'menu', 'next'],
    ['NEXT', 'MENU', 'NEXT'],
    ['next', 'PREV', 'next'],
  ] as ArrayConfig,
  l: [
    ['PREV', 'prev', 'prev'],
    ['prev', 'MENU', 'next'],
    ['next', 'next', 'NEXT'],
  ] as ArrayConfig,
};

const areaType = createRootMemo(() =>
  Reflect.has(areaArrayMap, store.option.clickPageTurn.area)
    ? store.option.clickPageTurn.area
    : 'left_right',
);

export const dir = createRootMemo(() => {
  if (!store.option.clickPageTurn.reverse) return store.option.dir;
  return store.option.dir === 'rtl' ? 'ltr' : 'rtl';
});

const isShowArea = (area: Area) => {
  switch (area) {
    case 'PREV':
    case 'prev':
    case 'NEXT':
    case 'next':
      return store.option.clickPageTurn.enabled;

    case 'MENU':
    case 'menu':
      return store.option.clickPageTurn.enableMenu;
  }
};

export const TouchArea: Component = () => (
  <div
    ref={bindRef('touchArea')}
    class={classes.touchAreaRoot}
    dir={dir()}
    data-show={boolDataVal(store.show.touchArea)}
    data-area={areaType()}
  >
    <For each={areaArrayMap[areaType()]}>
      {(rows) => (
        <For each={rows}>
          {(area) => (
            <div
              class={classes.touchArea}
              style={{ visibility: isShowArea(area) ? undefined : 'hidden' }}
              data-area={area}
              role="button"
              tabIndex={-1}
            />
          )}
        </For>
      )}
    </For>
  </div>
);
