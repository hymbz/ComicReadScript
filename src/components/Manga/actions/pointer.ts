import { isEqual } from 'helper';
import type { Area } from '../components/TouchArea';
import { useDoubleClick } from '../hooks/useDoubleClick';
import type { UseDrag } from '../hooks/useDrag';
import { store, setState, refs } from '../store';
import { resetUI } from './helper';
import { updateRenderPage } from './show';
import { turnPage, turnPageAnimation } from './operate';
import { zoom } from './zoom';

/** 根据坐标判断点击的元素 */
const findClickEle = (eleList: HTMLCollection, { x, y }: MouseEvent) =>
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
  setState(resetUI);
  turnPage(areaName.toLowerCase() as 'prev' | 'next');
};

/** 网格模式下点击图片跳到对应页 */
export const handleGridClick = (e: MouseEvent) => {
  const target = findClickEle(refs.root.getElementsByTagName('img'), e);
  if (!target) return;
  const pageNumText = target.parentElement?.getAttribute('data-index');
  if (!pageNumText) return;
  const pageNum = +pageNumText;
  if (!Reflect.has(store.pageList, pageNum)) return;
  setState((state) => {
    state.activePageIndex = pageNum;
    state.gridMode = false;
  });
  if (store.option.scrollMode)
    refs.mangaFlow.children[store.activePageIndex]?.scrollIntoView();
};

/** 双击放大 */
export const doubleClickZoom = (e?: MouseEvent) =>
  !store.gridMode && zoom(store.zoom.scale !== 100 ? 100 : 350, e, true);

export const handleClick = useDoubleClick(
  (e) => (store.gridMode ? handleGridClick(e) : handlePageClick(e)),
  doubleClickZoom,
);

/** 判断翻页方向 */
const getTurnPageDir = (startTime: number): undefined | 'prev' | 'next' => {
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
      if (Math.abs(dx) > 5 && isEqual(dy, 0, 5)) slideDir = 'horizontal';
      if (Math.abs(dy) > 5 && isEqual(dx, 0, 5)) slideDir = 'vertical';
      if (!slideDir) return;

      setState((state) => {
        // 根据滑动方向自动切换排列模式
        state.page.vertical = slideDir === 'vertical';
        state.isDragMode = true;
        updateRenderPage(state);
      });
      return;
    }
    case 'up': {
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
    }
  }
};
