import { createRoot, createSignal, onCleanup } from 'solid-js';
import { inRange, throttle } from 'helper';
import {
  createEffectOn,
  createEqualsSignal,
  createRootMemo,
} from 'helper/solidJs';

import { store, _setState, setState } from '../../store';
import { useDomSize } from '../../hooks/useDomSize';

import { isAbreastMode } from './common';

/** 记录每张图片所在的页面 */
export const imgPageMap = createRootMemo(() => {
  const map: Record<number, number> = {};
  for (let i = 0; i < store.pageList.length; i++) {
    store.pageList[i].forEach((imgIndex) => {
      if (imgIndex !== -1) map[imgIndex] = i;
    });
  }

  return map;
});

/** 当前显示的图片 */
export const showImgList = new Set<HTMLImageElement>();

const [_showPageList, setShowPageList] = createEqualsSignal<number[]>([]);
/** 当前显示的页面 */
export const showPageList = _showPageList;
const updateShowPageList = throttle(() => {
  const newShowPageList = new Set<number>();
  showImgList.forEach((img) =>
    newShowPageList.add(imgPageMap()[Number(img.alt)]),
  );
  setShowPageList([...newShowPageList].sort((a, b) => a - b));
});

export const initIntersectionObserver = (root: HTMLElement) => {
  const handleObserver: IntersectionObserverCallback = (entries) => {
    if (entries.length === 0) return;
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) showImgList.add(target as HTMLImageElement);
      else showImgList.delete(target as HTMLImageElement);
    });
    updateShowPageList();
  };

  _setState(
    'observer',
    new IntersectionObserver(handleObserver, { root, threshold: 0.01 }),
  );
  onCleanup(() => {
    setState((state) => {
      state.observer?.disconnect();
      state.observer = null;
    });
  });
};

export const [rootSize, watchRootSize] = useDomSize();
export const [flowSize, watchFlowSize] = useDomSize();

const [_scrollTop, setScrollTop] = createSignal(0);
/** 滚动距离 */
export const scrollTop = createRootMemo(() =>
  isAbreastMode() ? store.page.offset.x.px : _scrollTop(),
);
export const bindScrollTop = (dom: HTMLElement) => {
  dom.addEventListener('scroll', () => setScrollTop(dom.scrollTop), {
    passive: true,
  });
};

createRoot(() => {
  // 卷轴模式下，将当前显示的第一页作为当前页
  createEffectOn(showPageList, ([firstPage]) => {
    if (!store.gridMode && store.option.scrollMode.enabled)
      _setState('activePageIndex', firstPage ?? 0);
  });

  // 窗口宽度小于800像素时，标记为移动端
  createEffectOn(rootSize, ({ width }) =>
    _setState('isMobile', inRange(1, width, 800)),
  );
});
