import { isEqual } from 'helper';
import { store, setState } from '..';
import { useDoubleClick } from '../../useDoubleClick';
import type { UseDrag } from '../../useDrag';
import { turnPage, turnPageAnimation } from './Operate';
import { zoom } from './Zoom';

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

/** 滑动方向 */
let slideDir: 'up' | 'down' | 'left' | 'right' | undefined;

const PI2 = Math.PI / 2;

/** 根据传入的角度判断滑动方向 */
const getSlideDir = (angle: number): typeof slideDir => {
  if (isEqual(angle, -PI2, 1.3)) return 'up';
  if (isEqual(angle, 0, 1)) return 'right';
  if (isEqual(angle, PI2, 1.3)) return 'down';
  if (isEqual(angle, Math.PI, 1)) return 'left';
  if (isEqual(angle, -Math.PI, 1)) return 'left';
  return undefined;
};

/** 判断翻页方向 */
const getTurnPageDir = (
  startTime: number,
  distance: number,
): undefined | 'prev' | 'next' => {
  // 滑动距离超过 1/3 判定翻页
  if (Math.abs(distance) > store.ref.root.scrollWidth / 3)
    return distance > 0 ? 'next' : 'prev';

  // 滑动速度超过 0.4 判定翻页
  const velocity = distance / (performance.now() - startTime);
  if (velocity > 0.4) return 'next';
  if (velocity < -0.4) return 'prev';

  return undefined;
};

export const handleMangaFlowDrag: UseDrag = ({
  type,
  xy: [x, y],
  initial: [ix, iy],
  startTime,
}) => {
  switch (type) {
    case 'move': {
      if (store.dragMode)
        setState((state) => {
          state.page.offset.x.px = state.option.dir === 'rtl' ? x - ix : ix - x;
        });

      slideDir = getSlideDir(Math.atan2(y - iy, x - ix));
      switch (slideDir) {
        case 'left':
        case 'right':
          if (!store.dragMode)
            setState((state) => {
              state.dragMode = true;
              state.page.anima = '';
            });
          break;
      }
      return;
    }
    case 'up': {
      // 将拖动的页面移回正常位置
      if (store.page.offset.x.px !== 0) {
        const dir = getTurnPageDir(startTime, store.page.offset.x.px);
        switch (dir) {
          case 'next':
          case 'prev': {
            turnPageAnimation(dir);
            break;
          }
          default:
            setState((state) => {
              state.page.offset.x.px = 0;
              state.page.anima = 'page';
              state.dragMode = false;
            });
        }
      }
      // 上下滑动速度达标后触发翻页
      else if (slideDir) {
        switch (slideDir) {
          case 'up':
          case 'down':
            if (getTurnPageDir(startTime, y - iy))
              turnPage(slideDir === 'up' ? 'next' : 'prev');
            break;
        }
      }
      slideDir = undefined;
    }
  }
};
