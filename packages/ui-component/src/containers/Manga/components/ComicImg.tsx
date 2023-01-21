import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import type { Draft } from 'immer';
import { current } from 'immer';
import type { SyntheticEvent } from 'react';
import { memo, useRef, useCallback } from 'react';
import { useStore } from '../hooks/useStore';

import classes from '../index.module.css';

export interface ComicImgProps {
  index: number;
  className?: ClassValue;
}

/**
 * 漫画图片
 *
 * @param img 图片数据
 */
export const ComicImg: React.FC<ComicImgProps> = memo(
  ({ index, className }) => {
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

          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          state.onLoading?.(current(img), current(state.imgList));
        });
      },
      [index],
    );

    const img = useStore((state) => state.imgList[index]);

    return (
      <img
        className={clsx(
          classes.img,
          classes[img.type],
          classes[img.loadType],
          className,
        )}
        ref={imgRef}
        src={img.loadType === 'wait' ? '' : img.src}
        data-type={img.loadType}
        alt={`${index}`}
        onLoad={handleImgLoaded}
        onError={handleImgError}
      />
    );
  },
);
