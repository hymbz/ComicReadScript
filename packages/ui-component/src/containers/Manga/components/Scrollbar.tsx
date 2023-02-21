import clsx from 'clsx';
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

  const pageEleList = useMemo(
    () =>
      scrollbar.showProgress
        ? pageList.map(([a, b]) => (
            <div key={`${a}${b}`}>
              <ScrollbarPage index={a !== -1 ? a : b!} />
              {b ? <ScrollbarPage index={b !== -1 ? b : a} /> : null}
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
      tabIndex={-1}
      onWheel={handleWheel}
    >
      <div
        className={classes.scrollbarDrag}
        data-show={!scrollbar.autoHidden || showScrollbar}
        style={{
          top: scrollMode
            ? `${dragTop * 100}%`
            : `${(1 / pageList.length) * 100 * activePageIndex}%`,
          height: dragHeight
            ? `${dragHeight * 100}%`
            : `${(1 / pageList.length) * 100}%`,
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
