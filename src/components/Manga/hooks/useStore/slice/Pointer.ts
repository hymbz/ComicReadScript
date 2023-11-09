import { isEqual } from 'helper';
import { store, setState } from '..';
import { useDoubleClick } from '../../useDoubleClick';
import type { UseDrag } from '../../useDrag';
import { turnPage, turnPageAnimation } from './Operate';
import { zoom } from './Zoom';
import { updateRenderPage } from './Image';

const pageClick = {
  prev: () => store.option.clickPageTurn.enabled && turnPage('prev'),
  next: () => store.option.clickPageTurn.enabled && turnPage('next'),
  menu: () => {
    // 处于放大模式时跳过不处理
    if (store.zoom.scale !== 100) return;
    setState((state) => {
      state.show.scrollbar = !state.show.scrollbar;
      state.show.toolbar = !state.show.toolbar;
    });
  },
};

/** 根据点击坐标触发指定的操作 */
export const handlePageClick = ({ x, y }: MouseEvent) => {
  if (store.zoom.scale !== 100) return;

  // 找到当前
  const targetArea = [
    store.ref.nextArea,
    store.ref.menuArea,
    store.ref.prevArea,
  ].find((e) => {
    if (!e) return false;
    const rect = e.getBoundingClientRect();
    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  });
  if (!targetArea) return;
  pageClick[targetArea.getAttribute('data-area') as keyof typeof pageClick]();
};

/** 网格模式下点击图片跳到对应页 */
export const handleGridClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.tagName !== 'IMG') return;
  const pageNumText = target.parentElement?.getAttribute('data-index');
  if (!pageNumText) return;
  const pageNum = +pageNumText;
  if (!Reflect.has(store.pageList, pageNum)) return;
  setState((state) => {
    state.activePageIndex = pageNum;
    state.gridMode = false;
  });
};

/** 双击放大 */
export const doubleClickZoom = (e?: MouseEvent) => {
  if (store.option.scrollMode || store.gridMode) return;
  requestAnimationFrame(() => {
    setState((state) => {
      // 当缩放到一定程度时再双击会缩放回原尺寸，否则正常触发缩放
      const newScale = state.zoom.scale >= 300 ? 100 : state.zoom.scale + 100;
      zoom(newScale, e, true);
    });
  });
};
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
    total = store.ref.root.clientHeight;
  } else {
    move = store.page.offset.x.px;
    total = store.ref.root.clientWidth;
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

export const handleMangaFlowDrag: UseDrag = ({
  type,
  xy: [x, y],
  initial: [ix, iy],
  startTime,
}) => {
  switch (type) {
    case 'move': {
      if (store.dragMode) {
        setState((state) => {
          if (state.page.vertical) state.page.offset.y.px = y - iy;
          else
            state.page.offset.x.px =
              state.option.dir === 'rtl' ? x - ix : ix - x;
        });
        return;
      }

      const dx = x - ix;
      const dy = y - iy;
      let slideDir: 'vertical' | 'horizontal' | undefined;
      if (Math.abs(dx) > 5 && isEqual(dy, 0, 3)) slideDir = 'horizontal';
      if (Math.abs(dy) > 5 && isEqual(dx, 0, 3)) slideDir = 'vertical';
      if (!slideDir) return;

      setState((state) => {
        state.page.vertical = slideDir === 'vertical';
        state.dragMode = true;
        updateRenderPage(state);
      });
      return;
    }
    case 'up': {
      // 将拖动的页面移回正常位置
      const dir = getTurnPageDir(startTime);
      if (dir) return turnPageAnimation(dir);
      setState((state) => {
        state.page.offset.x.px = 0;
        state.page.offset.y.px = 0;
        state.page.anima = 'page';
        state.dragMode = false;
      });
    }
  }
};
