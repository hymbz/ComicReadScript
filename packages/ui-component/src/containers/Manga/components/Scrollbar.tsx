import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { useRef, memo, useMemo } from 'react';
import { useDrag } from '../hooks/useDrag';
import type { SelfState } from '../hooks/useStore';
import { shallow, useStore } from '../hooks/useStore';

import classes from '../index.module.css';
import { ScrollbarPage } from './ScrollbarPage';

const selector = ({
  option: { scrollbar, scrollMode },
  pageList,
  showScrollbar,
  activePageIndex,
  scrollbar: { dragHeight, dragTop, handleWheel, dragOption, tipText },
}: SelfState) => ({
  pageList,
  showScrollbar,
  scrollbar,
  scrollMode,
  activePageIndex,
  dragHeight,
  dragTop,
  handleWheel,
  dragOption,
  tipText,
});

/** 滚动条 */
export const Scrollbar: React.FC = memo(() => {
  const {
    pageList,
    showScrollbar,
    scrollbar,
    scrollMode,
    activePageIndex,
    dragHeight,
    dragTop,
    handleWheel,
    dragOption,
    tipText,
  } = useStore(selector, shallow);

  const style = useMemo(
    () =>
      ({
        '--pageHeight': `${(1 / pageList.length) * 100}%`,
      } as CSSProperties),
    [pageList.length],
  );

  const pageEleList = useMemo(
    () =>
      scrollbar.showProgress
        ? pageList.map(([a, b]) => (
            <div key={`${a.index}${b?.index}`}>
              <ScrollbarPage index={a.index} />
              {b ? <ScrollbarPage index={b.index} /> : null}
            </div>
          ))
        : [],
    [scrollbar.showProgress, pageList],
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
      aria-valuenow={activePageIndex || -1}
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
            : `translateY(${activePageIndex}00%)`,
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

      {pageEleList}
    </div>
  );
});
