import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import type { Draft } from 'immer';
import type { SyntheticEvent } from 'react';
import { memo, useRef, useCallback } from 'react';
import { useStore } from '../hooks/useStore';
import { loadTypeMap } from '../hooks/useStore/ImageSlice';

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
        });
      },
      [index],
    );

    const img = useStore((state) => state.imgList[index]);

    return (
      <div className={clsx(classes.img, classes[img.type], className)}>
        <img
          ref={imgRef}
          src={img.loadType === 'wait' ? '' : img.src}
          data-type={img.loadType}
          alt={`${index}`}
          onLoad={handleImgLoaded}
          onError={handleImgError}
        />
        {img.loadType !== 'loaded' ? (
          <div className={classes.mask}>{loadTypeMap[img.loadType]}</div>
        ) : null}
      </div>
    );
  },
);
