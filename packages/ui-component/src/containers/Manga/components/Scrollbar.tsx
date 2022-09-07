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
  handleScroll,
}: SelfState) => ({
  swiper,
  option,
  slideData,
  activeSlideIndex,
  handleScroll,
});

/** 滚动条 */
export const Scrollbar: React.FC = () => {
  const { swiper, option, slideData, activeSlideIndex, handleScroll } =
    useStore(selector);

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
      id="manga-swiper-scrollbar"
      className={clsx('manga-swiper-scrollbar', classes.scrollbar, {
        [classes.hidden]: !option.scrollbar.enable,
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
          'manga-swiper-scrollbar-drag',
          classes.scrollbarDrag,
          isHover || !option.scrollbar.autoHidden
            ? classes.opacity1
            : classes.opacity0,
        )}
      >
        <div
          className={clsx(
            classes.scrollbarPoper,
            isHover ? classes.opacity1 : classes.opacity0,
          )}
        >
          {tooltipText}
        </div>
      </div>
    </div>
  );
};
