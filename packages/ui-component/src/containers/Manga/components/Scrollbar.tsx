import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { useEffect, useState, memo, useMemo } from 'react';
import type { SelfState } from '../hooks/useStore';
import { shallow, useStore } from '../hooks/useStore';

import classes from '../index.module.css';
import { ScrollbarSlide } from './ScrollbarSlide';

const selector = ({
  option: { dir, scrollbar, scrollMode },
  slideData,
  showScrollbar,
  activeSlideIndex,
  rootRef,
  mangaFlowRef,
}: SelfState) => ({
  slideData,
  showScrollbar,
  dir,
  scrollbar,
  scrollMode,
  activeSlideIndex,
  rootRef,
  mangaFlowRef,
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
    rootRef,
    mangaFlowRef,
  } = useStore(selector, shallow);

  /** 滚动条提示文本 */
  const tooltipText = useMemo(() => {
    if (scrollMode || !slideData.length || activeSlideIndex === undefined)
      return '';

    const slideIndex = slideData[activeSlideIndex].map((slide) => {
      if (slide.type === 'fill') return '填充页';
      if (slide.loadType === 'loaded') return `${slide.index}`;
      // 如果图片未加载完毕则在其 index 后增加显示当前加载状态
      return `${slide.index} (${slide.loadType})`;
    });
    if (dir === 'rtl') slideIndex.reverse();

    return `${slideIndex.join(' | ')}`;
  }, [scrollMode, slideData, activeSlideIndex, dir]);

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

  // 能显示出漫画的高度
  const windowHeight = rootRef.current?.offsetHeight;
  // 漫画的总高度
  const contentHeight = mangaFlowRef.current?.scrollHeight;
  // 滚动条高度
  const dragHeight = useMemo(() => {
    // 因为需要在图片加载完成后重新计算高度，所以把 slideData 放进来防止 eslint 报错
    // eslint-disable-next-line no-constant-condition
    if (false) console.log(slideData);

    if (!scrollMode || !windowHeight || !contentHeight) return undefined;
    return `${(windowHeight / contentHeight) * 100}%`;
  }, [slideData, windowHeight, contentHeight, scrollMode]);

  // 滚动条所处高度
  const [dragTop, setDragTop] = useState<number>(0);
  useEffect(() => {
    if (!scrollMode) {
      setDragTop(0);
      return undefined;
    }
    const controller = new AbortController();
    if (mangaFlowRef.current) {
      mangaFlowRef.current.addEventListener(
        'scroll',
        () => {
          if (!mangaFlowRef.current || !contentHeight) setDragTop(0);
          else {
            setDragTop((mangaFlowRef.current.scrollTop / contentHeight) * 100);
          }
        },
        {
          capture: false,
          passive: true,
          signal: controller.signal,
        },
      );
    }
    return () => controller.abort();
  }, [contentHeight, mangaFlowRef, scrollMode]);

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
        style={{
          transform: scrollMode
            ? undefined
            : `translateY(${activeSlideIndex}00%)`,
          top: `${dragTop}%`,
          height: dragHeight,
        }}
      >
        <div className={classes.scrollbarPoper} data-show={showScrollbar}>
          {tooltipText}
        </div>
      </div>

      {slideList}
    </div>
  );
});
