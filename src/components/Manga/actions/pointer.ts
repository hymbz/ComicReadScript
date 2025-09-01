import type { UseDrag } from 'helper';

import { debounce, inRange } from 'helper';

import type { Area } from '../components/TouchArea';

import { useDoubleClick } from '../hooks/useDoubleClick';
import classes from '../index.module.css';
import { refs, setState, store } from '../store';
import { getImg, getImgEle, resetUI } from './helper';
import { reloadImg } from './imageLoad';
import { showImgList } from './renderPage';
import { isBottom, isTop, jumpToImg } from './scroll';
import { resetPage } from './show';
import {
  getTurnPageDir,
  turnPage,
  turnPageAnimation,
  turnPageFn,
} from './turnPage';
import { zoom } from './zoom';

/** 根据坐标找出被点击到的元素 */
const findClickEle = (
  eleList: Iterable<Element>,
  { x, y }: { x: number; y: number },
) => {
  for (const e of eleList) {
    const rect = e.getBoundingClientRect();
    if (inRange(rect.left, x, rect.right) && inRange(rect.top, y, rect.bottom))
      return e;
  }
};

/** 触发点击区域操作 */
const handlePageClick = (e: MouseEvent) => {
  // 点击出错的图片可以立刻重新加载
  for (const i of showImgList()) {
    const img = getImg(i);
    if (img.loadType !== 'error') continue;
    const imgEle = getImgEle(img.src);
    if (!imgEle || !findClickEle([imgEle], e)) continue;
    return reloadImg(img.src);
  }

  const targetArea = findClickEle(refs.touchArea.children, e);
  if (!targetArea) return;
  const areaName = (targetArea as HTMLElement).dataset.area as Area | undefined;
  if (!areaName) return;

  if (areaName === 'menu' || areaName === 'MENU')
    return setState((state) => {
      state.show.scrollbar = !state.show.scrollbar;
      state.show.toolbar = !state.show.toolbar;
    });

  if (!store.option.clickPageTurn.enabled || store.option.zoom.ratio !== 100)
    return;
  setState((state) => {
    resetUI(state);
    turnPageFn(state, areaName.toLowerCase() as 'prev' | 'next');
  });
};

/** 网格模式下点击图片跳到对应页 */
const handleGridClick = (e: MouseEvent) => {
  const target = findClickEle(refs.root.getElementsByClassName(classes.img), e);
  if (target) jumpToImg(Number(/_(\d+)_/.exec(target.id)?.[1]));
};

/** 双击放大 */
export const doubleClickZoom = (e?: MouseEvent) =>
  !store.gridMode && zoom(store.option.zoom.ratio === 100 ? 350 : 100, e, true);

export const handleClick = useDoubleClick(
  (e) => (store.gridMode ? handleGridClick(e) : handlePageClick(e)),
  doubleClickZoom,
);

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
  const dir = store.page.vertical
    ? getTurnPageDir(-store.page.offset.y.px, store.rootSize.height, startTime)
    : getTurnPageDir(store.page.offset.x.px, store.rootSize.width, startTime);
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
        animationId ||= requestAnimationFrame(handleDragAnima);
        return;
      }

      // 判断滑动方向
      let slideDir: 'vertical' | 'horizontal' | undefined;
      const dxAbs = Math.abs(dx);
      const dyAbs = Math.abs(dy);
      if (dxAbs > 5 && dyAbs < 5) slideDir = 'horizontal';
      if (dyAbs > 5 && dxAbs < 5) slideDir = 'vertical';
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

  if (store.option.scrollMode.enabled) {
    if (
      time > 200 &&
      ((isTop() && e.deltaY < 0) || (isBottom() && e.deltaY > 0))
    )
      turnPage(e.deltaY > 0 ? 'next' : 'prev');
    return;
  }

  // 加速度小于指定值后逐渐缩小滚动距离，实现减速效果
  if (Math.abs(absDeltaY - lastDeltaY) <= 6) {
    retardStartTime ||= Date.now();
    deltaY *= 1 - Math.min(1, ((Date.now() - retardStartTime) / 10) * 0.002);
    absDeltaY = Math.abs(deltaY);
    if (absDeltaY < 2) return;
  } else retardStartTime = 0;
  lastDeltaY = absDeltaY;

  dy += deltaY;

  setState((state) => {
    // 滚动至漫画头尾尽头时
    if ((isTop() && dy > 0) || (isBottom() && dy < 0)) {
      if (time > 200) turnPageFn(state, dy < 0 ? 'next' : 'prev');
      dy = 0;
    }

    // 滚动过一页时
    if (dy <= -state.rootSize.height) {
      if (turnPageFn(state, 'next')) dy += state.rootSize.height;
    } else if (dy >= state.rootSize.height && turnPageFn(state, 'prev'))
      dy -= state.rootSize.height;

    state.page.vertical = true;
    state.isDragMode = true;
    resetPage(state);
  });
  animationId ||= requestAnimationFrame(handleDragAnima);

  handleDragEnd.debounce();
};
