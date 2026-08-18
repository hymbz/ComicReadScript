import { AnimationFrame, type UseDrag, debounce, inRange } from 'helper';

import { type Area } from '../components/TouchArea';
import { useDoubleClick } from '../hooks/useDoubleClick';
import { refs, setState, store } from '../store';
import { getImg, getImgEle, resetUI } from './helper';
import { handleHotkey } from './hotkeyAction';
import { reloadImg } from './imageLoad';
import { showImgList } from './renderPage';
import { resetPage } from './show';
import { getTurnPageDir, turnPageAnimation } from './turnPage';
import { zoom } from './zoom';

/** 根据坐标找出被点击到的元素 */
const findClickEle = (
  eleList: Iterable<Element>,
  { x, y }: { x: number; y: number },
) => {
  for (const e of eleList) {
    const rect = e.getBoundingClientRect();
    if (inRange(rect.left, x, rect.right) && inRange(rect.top, y, rect.bottom))
      return e as HTMLElement;
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
  if (!targetArea || getComputedStyle(targetArea).visibility === 'hidden')
    return;
  const areaName = targetArea.dataset.area as Area | undefined;
  if (!areaName) return;

  if (areaName === 'menu' || areaName === 'MENU')
    return setState((state) => {
      state.show.scrollbar = !state.show.scrollbar;
      state.show.toolbar = !state.show.toolbar;
      state.show.pageTip = !state.show.pageTip;
    });

  setState((state) => {
    resetUI(state);

    switch (areaName) {
      case 'NEXT':
      case 'next':
        return handleHotkey('page_down');

      case 'PREV':
      case 'prev':
        return handleHotkey('page_up');
    }
  });
};

/** 双击放大 */
export const doubleClickZoom = (e?: MouseEvent) =>
  zoom(store.option.zoom.ratio === 100 ? 350 : 100, e, true);

export const handleClick = useDoubleClick(handlePageClick, doubleClickZoom);

/** 拖动页面的动画控制器 */
const dragAnim = new (class extends AnimationFrame {
  dx = 0;
  dy = 0;

  frame = () => {
    // 当停着不动时退出循环
    if (
      this.dx === store.page.offset.x.px &&
      this.dy === store.page.offset.y.px
    )
      return this.cancel();

    setState((state) => {
      if (state.page.vertical) state.page.offset.y.px = this.dy;
      else state.page.offset.x.px = this.dx;
    });

    this.call(true);
  };
})();

const handleDragEnd = (startTime?: number) => {
  dragAnim.dx = 0;
  dragAnim.dy = 0;

  dragAnim.cancel();

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
      dragAnim.dx = store.option.dir === 'rtl' ? x - ix : ix - x;
      dragAnim.dy = y - iy;

      if (store.isDragMode) return dragAnim.call();

      // 判断滑动方向
      let slideDir: 'vertical' | 'horizontal' | undefined;
      const dxAbs = Math.abs(dragAnim.dx);
      const dyAbs = Math.abs(dragAnim.dy);
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
