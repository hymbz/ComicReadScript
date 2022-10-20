import clsx from 'clsx';
import { memo, useMemo } from 'react';
import { shallow, useStore } from '../hooks/useStore';

import classes from '../index.module.css';

const selector = ({
  swiper,
  option: { dir, scrollbar },
  slideData,
  showScrollbar,
}: SelfState) => ({
  swiper,
  slideData,
  showScrollbar,
  dir,
  scrollbar,
});

/** 滚动条 */
export const Scrollbar: React.FC = memo(() => {
  const { swiper, slideData, showScrollbar, dir, scrollbar } = useStore(
    selector,
    shallow,
  );

  /** 滚动条提示文本 */
  const tooltipText = useMemo(() => {
    if (!slideData.length) return '';

    const slideIndex = slideData[swiper?.activeIndex ?? 0].map((slide) => {
      let slideText = `${slide.index}`;
      // 如果图片未加载完毕则在其 index 后增加显示当前加载状态
      if (slide.loadType !== 'loaded') slideText += ` (${slide.loadType})`;
      return slideText;
    });
    if (dir === 'rtl') slideIndex.reverse();

    return `${slideIndex.join(' | ')}`;
  }, [slideData, swiper, dir]);

  return (
    <div
      className={clsx(classes.scrollbar, {
        [classes.hidden]: !scrollbar.enabled && !showScrollbar,
      })}
      role="scrollbar"
      aria-controls="mange-main"
      aria-valuenow={swiper?.activeIndex || -1}
      tabIndex={0}
    >
      <div
        className={classes.scrollbarDrag}
        data-show={!scrollbar.autoHidden || showScrollbar}
      >
        <div className={classes.scrollbarPoper} data-show={showScrollbar}>
          {tooltipText}
        </div>
      </div>
    </div>
  );
});
