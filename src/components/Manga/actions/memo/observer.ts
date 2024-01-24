import { createRoot, createSignal, onCleanup } from 'solid-js';
import { inRange, throttle } from 'helper';
import { createEffectOn, createEqualsSignal } from 'helper/solidJs';
import { store, _setState, setState } from '../../store';

/** 当前显示的图片 */
export const showImgList = new Set<HTMLImageElement>();

const [_showPageList, setShowPageList] = createEqualsSignal<number[]>([]);
/** 当前显示的页面 */
export const showPageList = _showPageList;
const updateShowPageList = throttle(() => {
  const newShowPageList = new Set<number>();
  showImgList.forEach((img) =>
    newShowPageList.add(+img.parentElement!.getAttribute('data-index')!),
  );
  setShowPageList([...newShowPageList].sort((a, b) => a - b));
});

export const initIntersectionObserver = (root: HTMLElement) => {
  const handleObserver: IntersectionObserverCallback = (entries) => {
    if (!entries.length) return;
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

const [_rootSize, setRootSize] = createSignal(
  { width: 0, height: 0 },
  // 宽高为零时不触发变更
  { equals: (_, { width, height }) => !width || !height },
);
/** 容器尺寸 */
export const rootSize = _rootSize;

export const initResizeObserver = (dom: HTMLElement) => {
  setRootSize({ width: dom.scrollWidth, height: dom.scrollHeight });
  // 在 rootDom 的大小改变时更新比例，并重新计算图片类型
  const resizeObserver = new ResizeObserver(
    throttle(([{ contentRect }]) =>
      setRootSize({ width: contentRect.width, height: contentRect.height }),
    ),
  );
  resizeObserver.disconnect();
  resizeObserver.observe(dom);
  onCleanup(() => resizeObserver.disconnect());
};

const [_scrollTop, setScrollTop] = createSignal(0);
/** 滚动距离 */
export const scrollTop = _scrollTop;
export const bindScrollTop = (dom: HTMLElement) => {
  dom.addEventListener('scroll', () => setScrollTop(dom.scrollTop), {
    passive: true,
  });
};

createRoot(() => {
  // 卷轴模式下，将当前显示的第一页作为当前页
  createEffectOn(showPageList, ([firstPage]) => {
    if (!store.gridMode && store.option.scrollMode)
      _setState('activePageIndex', firstPage ?? 0);
  });

  // 窗口宽度小于800像素时，标记为移动端
  createEffectOn(rootSize, ({ width }) =>
    _setState('isMobile', inRange(1, width, 800)),
  );
});
