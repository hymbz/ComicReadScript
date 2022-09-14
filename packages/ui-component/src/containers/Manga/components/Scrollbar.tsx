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
}: SelfState) => ({
  swiper,
  option,
  slideData,
  activeSlideIndex,
  showScrollbar,
});

/** 滚动条 */
export const Scrollbar: React.FC = () => {
  const { swiper, option, slideData, activeSlideIndex, showScrollbar } =
    useStore(selector);

  const [isHover, handleMouseEnter, handleMouseLeave] = useHover();

  /** 滚动条提示文本 */
  const tooltipText = useMemo(() => {
    if (!slideData.length) return '';

    const slideIndex = slideData[activeSlideIndex].map((slide) => {
      let slideText = `${slide.index}`;
      // 如果图片未加载完毕则在其 index 后增加显示当前加载状态
      if (slide.loadType !== 'loaded') slideText += ` (${slide.loadType})`;
      return slideText;
    });
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
