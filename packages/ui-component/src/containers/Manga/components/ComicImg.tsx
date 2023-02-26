import type { Draft } from 'immer';
import { current } from 'immer';
import type { SyntheticEvent } from 'react';
import { memo, useRef, useCallback } from 'react';
import { shallow, useStore } from '../hooks/useStore';

import classes from '../index.module.css';

/**
 * 漫画图片
 *
 * @param img 图片数据
 */
export const ComicImg: React.FC<{ index: number }> = memo(({ index }) => {
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImgLoaded = useCallback(() => {
    if (index === -1) return;
    useStore.setState((state) => {
      if (!imgRef.current) return;

      const img = state.imgList[index];
      img.loadType = 'loaded';
      img.height = imgRef.current.naturalHeight;
      img.width = imgRef.current.naturalWidth;
      state.img.updateImgType(img);

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      state.onLoading?.(current(img), current(state.imgList));
    });
  }, [index]);

  const handleImgError = useCallback(
    (e: SyntheticEvent<HTMLImageElement, Event>) => {
      if (index === -1) return;
      // 跳过因为 src 为空导致的错误
      if ((e.target as HTMLImageElement).getAttribute('src') === '') return;
      useStore.setState((state) => {
        const img = state.imgList[index];
        img.loadType = 'error';
        img.error = e as Draft<SyntheticEvent<HTMLImageElement, Event>>;
        console.error('图片加载失败', e);

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        state.onLoading?.(current(img), current(state.imgList));
      });
    },
    [index],
  );

  const { show, fill } = useStore((state) => {
    // 卷轴模式下全部显示
    if (state.option.scrollMode) return { show: '' };

    const activePage = state.pageList[state.activePageIndex];
    if (!activePage.includes(index)) return { show: undefined };
    return {
      show: '',
      fill: ((): undefined | 'left' | 'right' => {
        const i = activePage.indexOf(-1);
        if (i === -1) return undefined;
        return !!i === (state.option.dir === 'rtl') ? 'left' : 'right';
      })(),
    };
  }, shallow);

  const img = useStore((state) => state.imgList[index]);

  return (
    <img
      ref={imgRef}
      className={classes.img}
      src={img.loadType === 'wait' ? '' : img.src}
      alt={`${index}`}
      data-show={show}
      data-type={img.type}
      data-load-type={img.loadType}
      data-fill={fill}
      onLoad={handleImgLoaded}
      onError={handleImgError}
    />
  );
});
