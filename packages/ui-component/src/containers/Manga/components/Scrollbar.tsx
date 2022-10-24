import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { memo, useMemo } from 'react';
import type { SelfState } from '../hooks/useStore';
import { shallow, useStore } from '../hooks/useStore';

import classes from '../index.module.css';
import { ScrollbarSlide } from './ScrollbarSlide';

const selector = ({
  option: { dir, scrollbar },
  slideData,
  showScrollbar,
  activeSlideIndex,
}: SelfState) => ({
  slideData,
  showScrollbar,
  dir,
  scrollbar,
  activeSlideIndex,
});

/** 滚动条 */
export const Scrollbar: React.FC = memo(() => {
  const { slideData, showScrollbar, dir, scrollbar, activeSlideIndex } =
    useStore(selector, shallow);

  /** 滚动条提示文本 */
  const tooltipText = useMemo(() => {
    if (!slideData.length || activeSlideIndex === undefined) return '';

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
        ? slideData
            .flat()
            .map((img) => (
              <ScrollbarSlide
                img={img}
                key={`${img.index}${img.type === 'fill' ? ' fill' : ''}`}
              />
            ))
        : [],
    [scrollbar.showProgress, slideData],
  );

  return (
    <div
      className={clsx(classes.scrollbar, {
        [classes.hidden]: !scrollbar.enabled && !showScrollbar,
      })}
      role="scrollbar"
      aria-controls="mange-main"
      aria-valuenow={activeSlideIndex || -1}
      tabIndex={0}
      style={style}
    >
      <div
        className={classes.scrollbarDrag}
        data-show={!scrollbar.autoHidden || showScrollbar}
        style={{ transform: `translateY(${activeSlideIndex}00%)` }}
      >
        <div className={classes.scrollbarPoper} data-show={showScrollbar}>
          {tooltipText}
        </div>
      </div>

      {slideList}
    </div>
  );
});
