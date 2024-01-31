import { approx, debounce } from 'helper';
import type { Area } from '../components/TouchArea';
import { useDoubleClick } from '../hooks/useDoubleClick';
import type { UseDrag } from '../hooks/useDrag';
import { store, setState, refs } from '../store';
import { resetUI, scrollTo } from './helper';
import { imgPageMap, imgTopList, rootSize } from './memo';
import { resetPage } from './show';
import { zoom } from './zoom';
import {
  turnPageFn,
  turnPageAnimation,
  turnPage,
  isBottom,
  isTop,
} from './turnPage';

/** 根据坐标判断点击的元素 */
const findClickEle = <T extends Element>(
  eleList: HTMLCollectionOf<T>,
  { x, y }: MouseEvent,
) =>
  [...eleList].find((e) => {
    const rect = e.getBoundingClientRect();
    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  });

/** 触发 touchArea 操作 */
export const handlePageClick = (e: MouseEvent) => {
  const targetArea = findClickEle(refs.touchArea.children, e);
  if (!targetArea) return;
  const areaName = targetArea.getAttribute('data-area') as Area | undefined;
  if (!areaName) return;

  if (areaName === 'menu' || areaName === 'MENU')
    return setState((state) => {
      state.show.scrollbar = !state.show.scrollbar;
      state.show.toolbar = !state.show.toolbar;
    });

  if (!store.option.clickPageTurn.enabled || store.zoom.scale !== 100) return;
  setState((state) => {
    resetUI(state);
    turnPageFn(state, areaName.toLowerCase() as 'prev' | 'next');
  });
};

/** 网格模式下点击图片跳到对应页 */
export const handleGridClick = (e: MouseEvent) => {
  const target = findClickEle(refs.root.getElementsByTagName('img'), e);
  if (!target) return;
  const pageNum = imgPageMap()[+target.alt];
  if (pageNum === undefined) return;
  setState((state) => {
    state.activePageIndex = pageNum;
    state.gridMode = false;
  });
  if (store.option.scrollMode) scrollTo(imgTopList()[pageNum]);
};

/** 双击放大 */
export const doubleClickZoom = (e?: MouseEvent) =>
  !store.gridMode && zoom(store.zoom.scale !== 100 ? 100 : 350, e, true);

export const handleClick = useDoubleClick(
  (e) => (store.gridMode ? handleGridClick(e) : handlePageClick(e)),
  doubleClickZoom,
);

/** 判断翻页方向 */
const getTurnPageDir = (startTime?: number): undefined | 'prev' | 'next' => {
  let dir: undefined | 'prev' | 'next';
  let move: number;
  let total: number;

  if (store.page.vertical) {
    move = -store.page.offset.y.px;
    total = refs.root.clientHeight;
  } else {
    move = store.page.offset.x.px;
    total = refs.root.clientWidth;
  }

  // 处理无关速度不考虑时间单纯根据当前滚动距离来判断的情况
  if (!startTime) {
    if (Math.abs(move) > total / 2) dir = move > 0 ? 'next' : 'prev';
    return dir;
  }

  // 滑动距离超过总长度三分之一判定翻页
  if (Math.abs(move) > total / 3) dir = move > 0 ? 'next' : 'prev';
  if (dir) return dir;

  // 滑动速度超过 0.4 判定翻页
  const velocity = move / (performance.now() - startTime);
  if (velocity < -0.4) dir = 'prev';
  if (velocity > 0.4) dir = 'next';

  return dir;
};

let dx = 0;
let dy = 0;
let animationId: number | null = null;
const handleDragAnima = () => {
  // 当停着不动时退出循环
  if (dx === store.page.offset.x.px && dy === store.page.offset.y.px) {
    animationId = null;
    return;
  }

  setState((state) => {
    if (state.page.vertical) state.page.offset.y.px = dy;
    else state.page.offset.x.px = dx;
  });

  animationId = requestAnimationFrame(handleDragAnima);
};

const handleDragEnd = (startTime?: number) => {
  dx = 0;
  dy = 0;

  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  // 将拖动的页面移回正常位置
  const dir = getTurnPageDir(startTime);
  if (dir) return turnPageAnimation(dir);
  setState((state) => {
    state.page.offset.x.px = 0;
    state.page.offset.y.px = 0;
    state.page.anima = 'page';
    state.isDragMode = false;
  });
};
handleDragEnd.debounce = debounce(handleDragEnd, 200);

export const handleMangaFlowDrag: UseDrag = ({
  type,
  xy: [x, y],
  initial: [ix, iy],
  startTime,
}) => {
  switch (type) {
    case 'move': {
      dx = store.option.dir === 'rtl' ? x - ix : ix - x;
      dy = y - iy;

      if (store.isDragMode) {
        if (!animationId) animationId = requestAnimationFrame(handleDragAnima);
        return;
      }

      // 判断滑动方向
      let slideDir: 'vertical' | 'horizontal' | undefined;
      if (Math.abs(dx) > 5 && approx(dy, 0, 5)) slideDir = 'horizontal';
      if (Math.abs(dy) > 5 && approx(dx, 0, 5)) slideDir = 'vertical';
      if (!slideDir) return;

      setState((state) => {
        // 根据滑动方向自动切换排列模式
        state.page.vertical = slideDir === 'vertical';
        state.isDragMode = true;
        resetPage(state);
      });
      return;
    }
    case 'up':
      return handleDragEnd(startTime);
  }
};

let lastDeltaY = 0;
let retardStartTime = 0;

let lastWheel = 0;

export const handleTrackpadWheel = (e: WheelEvent) => {
  let deltaY = Math.floor(-e.deltaY);
  let absDeltaY = Math.abs(deltaY);
  if (absDeltaY < 2) return;

  let time = 0;
  let now = 0;
  // 为了避免被触摸板的滚动惯性触发，限定一下滚动距离
  if (absDeltaY > 50) {
    now = performance.now();
    time = now - lastWheel;
    lastWheel = now;
  }

  if (store.option.scrollMode) {
    if (
      time > 200 &&
      ((isTop(store) && e.deltaY < 0) || (isBottom(store) && e.deltaY > 0))
    )
      turnPage(e.deltaY > 0 ? 'next' : 'prev');
    return;
  }

  // 加速度小于指定值后逐渐缩小滚动距离，实现减速效果
  if (Math.abs(absDeltaY - lastDeltaY) <= 6) {
    if (!retardStartTime) retardStartTime = Date.now();
    deltaY *= 1 - Math.min(1, ((Date.now() - retardStartTime) / 10) * 0.002);
    absDeltaY = Math.abs(deltaY);
    if (absDeltaY < 2) return;
  } else retardStartTime = 0;
  lastDeltaY = absDeltaY;

  dy += deltaY;

  setState((state) => {
    // 滚动至漫画头尾尽头时
    if ((isTop(state) && dy > 0) || (isBottom(state) && dy < 0)) {
      if (time > 200) turnPageFn(state, dy < 0 ? 'next' : 'prev');
      dy = 0;
    }

    // 滚动过一页时
    if (dy <= -rootSize().height) {
      if (turnPageFn(state, 'next')) dy += rootSize().height;
    } else if (dy >= rootSize().height) {
      if (turnPageFn(state, 'prev')) dy -= rootSize().height;
    }

    state.page.vertical = true;
    state.isDragMode = true;
    resetPage(state);
  });
  if (!animationId) animationId = requestAnimationFrame(handleDragAnima);

  handleDragEnd.debounce();
};
