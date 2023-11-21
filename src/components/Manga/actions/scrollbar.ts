import { t } from 'helper/i18n';
import type { PointerState, UseDrag } from '../hooks/useDrag';
import type { State } from '../store';
import { store, refs, _setState } from '../store';

/** 漫画流的总高度 */
export const contentHeight = () => refs.mangaFlow.scrollHeight;

/** 能显示出漫画的高度 */
export const windowHeight = () => refs.root.offsetHeight ?? 0;

/** 更新滚动条滑块的高度和所处高度 */
export const updateDrag = (state: State) => {
  if (!state.option.scrollMode) {
    state.scrollbar.dragHeight = 0;
    state.scrollbar.dragTop = 0;
    return;
  }
  state.scrollbar.dragTop = refs.mangaFlow.scrollTop / contentHeight();
  state.scrollbar.dragHeight =
    windowHeight() / (contentHeight() || windowHeight());
};

/** 获取指定图片的提示文本 */
export const getImgTip = (state: State, i: number) => {
  if (i === -1) return t('other.fill_page');
  const img = state.imgList[i];

  // 如果图片未加载完毕则在其 index 后增加显示当前加载状态
  if (img.loadType !== 'loaded')
    return `${i + 1} (${t(`img_status.${img.loadType}`)})`;

  if (
    img.translationType &&
    img.translationType !== 'hide' &&
    img.translationMessage
  )
    return `${i + 1}：${img.translationMessage}`;

  return `${i + 1}`;
};

/** 获取指定页面的提示文本 */
export const getPageTip = (pageIndex: number): string => {
  const page = store.pageList[pageIndex];
  if (!page) return 'null';
  const pageIndexText = page.map((index) => getImgTip(store, index)) as
    | [string]
    | [string, string];
  if (store.option.dir === 'rtl') pageIndexText.reverse();
  return pageIndexText.join(store.option.scrollMode ? '\n' : ' | ');
};

/** 获取滚动条位置 */
export const getScrollPosition =
  (): State['option']['scrollbar']['position'] => {
    if (store.option.scrollbar.position === 'auto')
      return store.isMobile ? 'top' : 'right';
    return store.option.scrollbar.position;
  };

/** 判断点击位置在滚动条上的位置比率 */
const getClickTop = (x: number, y: number, e: HTMLElement): number => {
  switch (getScrollPosition()) {
    case 'bottom':
    case 'top':
      return store.option.dir === 'rtl'
        ? 1 - x / e.offsetWidth
        : x / e.offsetWidth;

    default:
      return y / e.offsetHeight;
  }
};

/** 计算在滚动条上的拖动距离 */
const getDragDist = (
  [x, y]: PointerState['xy'],
  [ix, iy]: PointerState['initial'],
  e: HTMLElement,
) => {
  switch (getScrollPosition()) {
    case 'bottom':
    case 'top':
      return store.option.dir === 'ltr'
        ? (x - ix) / e.offsetWidth
        : (1 - (x - ix)) / e.offsetWidth;

    default:
      return (y - iy) / e.offsetHeight;
  }
};

/** 开始拖拽时的 dragTop 值 */
let startTop = 0;
export const handleScrollbarDrag: UseDrag = ({ type, xy, initial }, e) => {
  const [x, y] = xy;

  // 跳过拖拽结束事件（单击时会同时触发开始和结束，就用开始事件来完成单击的效果
  if (type === 'up') return;

  if (!refs.mangaFlow) return;

  const scrollbarDom = e.target as HTMLElement;

  /** 点击位置在滚动条上的位置比率 */
  const clickTop = getClickTop(x, y, e.target as HTMLElement);
  let top = clickTop;

  if (store.option.scrollMode) {
    if (type === 'move') {
      top = startTop + getDragDist(xy, initial, scrollbarDom);
      // 处理超出范围的情况
      if (top < 0) top = 0;
      else if (top > 1) top = 1;
      refs.mangaFlow.scrollTo({
        top: top * contentHeight(),
        behavior: 'instant',
      });
    } else {
      // 确保滚动条的中心会在点击位置
      top -= store.scrollbar.dragHeight / 2;
      startTop = top;
      refs.mangaFlow.scrollTo({
        top: top * contentHeight(),
        behavior: 'smooth',
      });
    }
  } else {
    let newPageIndex = Math.floor(top * store.pageList.length);
    // 处理超出范围的情况
    if (newPageIndex < 0) newPageIndex = 0;
    else if (newPageIndex >= store.pageList.length)
      newPageIndex = store.pageList.length - 1;

    if (newPageIndex !== store.activePageIndex)
      _setState('activePageIndex', newPageIndex);
  }
};
