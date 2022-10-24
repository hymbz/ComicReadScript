import clsx from 'clsx';

import { useMemo } from 'react';
import type { SelfState } from '../hooks/useStore';
import { useStore, shallow } from '../hooks/useStore';
import { ComicImg } from './ComicImg';

import classes from '../index.module.css';

const selector = ({
  slideData,
  activeSlideIndex,
  option: { scrollMode, disableZoom, dir },
}: SelfState) => ({
  slideData,
  activeSlideIndex,
  scrollMode,
  disableZoom,
  dir,
});

/**
 * 漫画图片流的容器
 */
export const ComicImgFlow: React.FC = () => {
  const { slideData, activeSlideIndex, scrollMode, disableZoom, dir } =
    useStore(selector, shallow);

  const slideList = useMemo(
    () =>
      scrollMode
        ? slideData
            .flat()
            .map((img) => (
              <ComicImg
                key={img.index}
                index={img.index}
                type={img.type}
                src={img.src}
              />
            ))
        : slideData.map(([a, b], i) => (
            <div
              // 为了防止切换页面填充时 key 产生变化导致整个 dom 被重新创建出现图片闪烁现象
              // 只能用 index 当 key，这样在切换时会复用之前的 dom，只会修改 img 的 src
              // 虽然这样可能会出现图片切换延迟，但总比闪烁要好
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className={classes.mangaFlowPage}
            >
              <ComicImg index={a.index} type={a.type} src={a.src} />
              {b && <ComicImg index={b.index} type={b.type} src={b.src} />}
            </div>
          )),
    [scrollMode, slideData],
  );

  return (
    <div
      className={clsx(
        classes.mangaFlow,
        (disableZoom || scrollMode) && classes.disableZoom,
        scrollMode && classes.scrollMode,
      )}
      dir={dir}
    >
      <div
        className={classes.wrapper}
        style={{ transform: `translateY(-${activeSlideIndex}00%)` }}
      >
        {slideList}
      </div>
    </div>
  );
};
