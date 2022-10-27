import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { useRef, memo, useMemo } from 'react';
import { useDrag } from '../hooks/useDrag';
import type { SelfState } from '../hooks/useStore';
import { shallow, useStore } from '../hooks/useStore';

import classes from '../index.module.css';
import { ScrollbarSlide } from './ScrollbarSlide';

const selector = ({
  option: { dir, scrollbar, scrollMode },
  slideData,
  showScrollbar,
  activeSlideIndex,
  scrollbar: { dragHeight, dragTop, handleWheel, dragOption },
}: SelfState) => ({
  slideData,
  showScrollbar,
  dir,
  scrollbar,
  scrollMode,
  activeSlideIndex,
  dragHeight,
  dragTop,
  handleWheel,
  dragOption,
});

/** 滚动条 */
export const Scrollbar: React.FC = memo(() => {
  const {
    slideData,
    showScrollbar,
    dir,
    scrollbar,
    scrollMode,
    activeSlideIndex,
    dragHeight,
    dragTop,
    handleWheel,
    dragOption,
  } = useStore(selector, shallow);

  /** 滚动条提示文本 */
  const tooltipText = useMemo(() => {
    if (!slideData.length) return null;

    const slideIndex = slideData[activeSlideIndex].map((slide) => {
      if (slide.type === 'fill') return '填充页';
      if (slide.loadType === 'loaded') return `${slide.index}`;
      // 如果图片未加载完毕则在其 index 后增加显示当前加载状态
      return `${slide.index} (${slide.loadType})`;
    });
    if (dir === 'rtl') slideIndex.reverse();

    return `${slideIndex.join(' | ')}`;
  }, [slideData, activeSlideIndex, dir]);

  const style = useMemo(
    () =>
      ({
        '--slideHeight': `${(1 / slideData.length) * 100}%`,
      } as CSSProperties),
    [slideData.length],
  );

  const slideList = useMemo(
    () =>
      scrollbar.showProgress
        ? slideData.map(([a, b], i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i}>
              <ScrollbarSlide img={a} />
              {b ? <ScrollbarSlide img={b} /> : null}
            </div>
          ))
        : [],
    [scrollbar.showProgress, slideData],
  );

  const ref = useRef<HTMLDivElement>(null);
  useDrag(ref, dragOption);

  return (
    <div
      ref={ref}
      className={clsx(classes.scrollbar, {
        [classes.hidden]: !scrollbar.enabled && !showScrollbar,
      })}
      role="scrollbar"
      aria-controls={classes.mangaFlow}
      aria-valuenow={activeSlideIndex || -1}
      style={style}
      tabIndex={-1}
      onWheel={handleWheel}
    >
      <div
        className={classes.scrollbarDrag}
        data-show={!scrollbar.autoHidden || showScrollbar}
        style={{
          transform: scrollMode
            ? undefined
            : `translateY(${activeSlideIndex}00%)`,
          top: `${dragTop * 100}%`,
          height: dragHeight ? `${dragHeight * 100}%` : undefined,
        }}
      >
        <div
          className={clsx(
            classes.scrollbarPoper,
            !tooltipText && classes.hidden,
          )}
          data-show={showScrollbar}
        >
          {tooltipText}
        </div>
      </div>

      {slideList}
    </div>
  );
});
