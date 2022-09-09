import clsx from 'clsx';
import { useMemo } from 'react';
import { useHover } from '../hooks/useHover';
import { useStore } from '../hooks/useStore';

import classes from '../index.module.css';

const selector = ({
  //
  swiper,
  option,
  slideData,
  activeSlideIndex,
  showScrollbar,
  handleScroll,
}: SelfState) => ({
  swiper,
  option,
  slideData,
  activeSlideIndex,
  showScrollbar,
  handleScroll,
});

/** 滚动条 */
export const Scrollbar: React.FC = () => {
  const {
    swiper,
    option,
    slideData,
    activeSlideIndex,
    showScrollbar,
    handleScroll,
  } = useStore(selector);

  const [isHover, handleMouseEnter, handleMouseLeave] = useHover();

  /** 滚动条提示文本 */
  const tooltipText = useMemo(() => {
    if (!slideData.length) return '';

    const slideIndex = slideData[activeSlideIndex].map((slide) => slide.index);
    if (option.dir === 'rtl') slideIndex.reverse();

    return `${slideIndex.join(' | ')}`;
  }, [slideData, activeSlideIndex, option]);

  return (
    <div
      className={clsx(classes.scrollbar, {
        [classes.hidden]: !option.scrollbar.enabled && !showScrollbar,
      })}
      role="scrollbar"
      aria-controls="mange-main"
      aria-valuenow={swiper?.activeIndex || -1}
      tabIndex={0}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onWheel={handleScroll}
    >
      <div
        className={clsx(
          classes.scrollbarDrag,
          isHover || !option.scrollbar.autoHidden || showScrollbar
            ? classes.opacity1
            : classes.opacity0,
        )}
      >
        <div
          className={clsx(
            classes.scrollbarPoper,
            isHover || showScrollbar ? classes.opacity1 : classes.opacity0,
          )}
        >
          {tooltipText}
        </div>
      </div>
    </div>
  );
};
