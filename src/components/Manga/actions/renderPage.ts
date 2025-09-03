import { clamp, createEffectOn, createRootMemo, throttle } from 'helper';

import type { State } from '../store';

import { setState, store } from '../store';
import {
  abreastArea,
  abreastShowColumn,
  findTopPage,
  imgList,
  scrollLength,
  scrollTop,
} from './memo';

/** 获取并排卷轴模式下指定列的指定图片 */
const getAbreastColumnImg = (column: number, img: number) => {
  const { columns } = abreastArea();
  return columns[clamp(0, column, columns.length - 1)]?.at(img) ?? 0;
};

/** 计算显示页面 */
export const updateShowRange = (state: State) => {
  if (scrollLength() === 0) {
    state.showRange = [0, 0];
    state.renderRange = state.showRange;
  } else if (!state.option.scrollMode.enabled) {
    // 翻页模式
    state.showRange = [state.activePageIndex, state.activePageIndex];
    state.renderRange = [
      clamp(0, state.activePageIndex - 1, state.pageList.length - 1),
      clamp(0, state.activePageIndex + 1, state.pageList.length - 1),
    ];
  } else if (state.option.scrollMode.abreastMode) {
    // 并排卷轴模式
    const { start, end } = abreastShowColumn();

    state.showRange = [
      getAbreastColumnImg(start, 0),
      getAbreastColumnImg(end, -1),
    ];

    state.renderRange = [
      getAbreastColumnImg(start - 2, 0),
      getAbreastColumnImg(end + 2, -1),
    ];
  } else {
    // 普通卷轴模式
    const top = scrollTop();
    const bottom = scrollTop() + state.rootSize.height;
    const renderTop = top - state.rootSize.height;
    const rednerBottom = bottom + state.rootSize.height;

    const renderTopImg = findTopPage(renderTop);
    const topImg = findTopPage(top, renderTopImg);
    const bottomImg = findTopPage(bottom, topImg);
    const renderBottomImg = findTopPage(rednerBottom, bottomImg);

    state.showRange = [topImg, bottomImg];
    state.renderRange = [renderTopImg, renderBottomImg];
  }
};

createEffectOn(
  [
    scrollLength,
    () => store.gridMode,
    () => store.option.scrollMode.enabled,
    () => store.activePageIndex,
    () => store.option.scrollMode.abreastMode,
    () => store.rootSize,
    abreastShowColumn,
    scrollTop,
  ],
  throttle(() => setState(updateShowRange)),
  // 两种卷轴模式下都可以通过在每次滚动后记录
  // 当前 `显示的第一张图片的 bottom` 和 `最后一张图片的 top` 作为忽略范围，
  // 在每次滚动后检查是否超出了这个范围，没超出就说明本次滚动不会显示或消失任何图片
  // 以此进行性能优化
  // 不过两个卷轴模式都要这么处理挺麻烦的，姑且先用 throttle 顶上，后面有需要再优化
);

/** 获取指定范围内页面所包含的图片 */
const getRangeImgList = (range: [number, number]) => {
  let list: Set<number>;
  if (range[0] === range[1]) list = new Set(store.pageList[range[0]]);
  else {
    list = new Set<number>();
    for (const [a, b] of store.pageList.slice(range[0], range[1] + 1)) {
      list.add(a);
      if (b !== undefined) list.add(b);
    }
  }
  list.delete(-1);
  return list;
};

export const renderImgList = createRootMemo(() =>
  getRangeImgList(store.renderRange),
);

export const showImgList = createRootMemo(() =>
  getRangeImgList(store.showRange),
);

/**
 * 图片显示状态
 *
 * 0 - 页面中的第一张图片
 * 1 - 页面中的最后一张图片
 * '' - 页面中的唯一一张图片
 */
export const imgShowState = createRootMemo<Map<number, 0 | 1 | ''>>(() => {
  if (store.pageList.length === 0) return new Map();

  const showRange = store.gridMode
    ? [0, store.pageList.length - 1]
    : store.renderRange;

  const stateList = new Map<number, 0 | 1 | ''>();
  for (let [i] = showRange; i <= showRange[1]; i++) {
    const page = store.pageList[i];
    if (!page) continue;
    const [a, b] = page;

    if (b === undefined) {
      stateList.set(a, '');
    } else {
      stateList.set(a, 0);
      stateList.set(b, 1);
    }
  }
  return stateList;
});

// 卷轴模式下，将当前显示的第一页作为当前页
createEffectOn(
  () => store.showRange,
  ([firstPage]) => {
    if (!store.gridMode && store.option.scrollMode.enabled)
      setState('activePageIndex', firstPage ?? 0);
  },
);

// 图片发生变化时触发回调
createEffectOn(
  showImgList,
  (showImgs) => {
    if (showImgs.size === 0) return;
    store.prop.onShowImgsChange?.(showImgs, imgList());
  },
  { defer: true },
);
