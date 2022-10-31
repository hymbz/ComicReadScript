import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { useRef, memo, useMemo } from 'react';
import { useDrag } from '../hooks/useDrag';
import type { SelfState } from '../hooks/useStore';
import { shallow, useStore } from '../hooks/useStore';

import classes from '../index.module.css';
import { ScrollbarSlide } from './ScrollbarSlide';

const selector = ({
  option: { scrollbar, scrollMode },
  slideData,
  showScrollbar,
  activeSlideIndex,
  scrollbar: { dragHeight, dragTop, handleWheel, dragOption, tipText },
}: SelfState) => ({
  slideData,
  showScrollbar,
  scrollbar,
  scrollMode,
  activeSlideIndex,
  dragHeight,
  dragTop,
  handleWheel,
  dragOption,
  tipText,
});

/** 滚动条 */
export const Scrollbar: React.FC = memo(() => {
  const {
    slideData,
    showScrollbar,
    scrollbar,
    scrollMode,
    activeSlideIndex,
    dragHeight,
    dragTop,
    handleWheel,
    dragOption,
    tipText,
  } = useStore(selector, shallow);

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
        ? slideData.map(([a, b]) => (
            <div key={`${a.index}${b?.index}`}>
              <ScrollbarSlide index={a.index} />
              {b ? <ScrollbarSlide index={b.index} /> : null}
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
          className={clsx(classes.scrollbarPoper, !tipText && classes.hidden)}
          data-show={showScrollbar}
        >
          {tipText}
        </div>
      </div>

      {slideList}
    </div>
  );
});
