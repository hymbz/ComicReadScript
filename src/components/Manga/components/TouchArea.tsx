import { For, type Component, createMemo } from 'solid-js';

import { boolDataVal } from 'helper';
import { store } from '../store';

import classes from '../index.module.css';
import { bindRef } from '../actions';

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

export const TouchArea: Component = () => {
  const areaType = createMemo(() => {
    if (
      !store.option.clickPageTurn.enabled ||
      !Reflect.has(areaArrayMap, store.option.clickPageTurn.area)
    )
      return store.isMobile ? 'up_down' : 'left_right';
    return store.option.clickPageTurn.area as keyof typeof areaArrayMap;
  });

  const dir = () => {
    if (!store.option.clickPageTurn.reverse) return store.option.dir;
    return store.option.dir === 'rtl' ? 'ltr' : 'rtl';
  };

  return (
    <div
      ref={bindRef('touchArea')}
      class={classes.touchAreaRoot}
      dir={dir()}
      data-show={store.show.touchArea}
      data-area={areaType()}
      data-turn-page={boolDataVal(
        store.option.clickPageTurn.enabled && !store.option.scrollMode,
      )}
    >
      <For each={areaArrayMap[areaType()]}>
        {(rows) => (
          <For each={rows}>
            {(area) => (
              <div
                class={classes.touchArea}
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
};
