import clsx from 'clsx';
import { memo, useEffect } from 'react';

import { throttle } from 'throttle-debounce';
import { useStore, shallow } from '../hooks/useStore';
import { ComicImg } from './ComicImg';

import classes from '../index.module.css';

const selector = ({ slideData, option: { disableZoom, dir } }: SelfState) => ({
  slideData,
  disableZoom,
  dir,
});

const updateSlides = throttle(100, () => {
  useStore.setState((state) => {
    state.swiper?.updateSlides();
    state.swiper?.scrollbar.updateSize();
  });
});

/**
 * 漫画图片流的容器
 */
export const ComicImgFlow: React.FC = memo(() => {
  const { slideData, disableZoom, dir } = useStore(selector, shallow);

  useEffect(updateSlides, [slideData]);

  return (
    <div
      className={clsx(classes.mangaFlow, disableZoom && classes.disableZoom)}
      dir={dir}
    >
      <div className={classes.wrapper}>
        {slideData.map(([a, b], i) => (
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
        ))}
      </div>
    </div>
  );
});
