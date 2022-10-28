import clsx from 'clsx';
import type { Draft } from 'immer';
import type { SyntheticEvent } from 'react';
import { memo, useRef, useCallback } from 'react';
import { useStore } from '../hooks/useStore';
import { loadTypeMap } from '../hooks/useStore/ImageSlice';

import classes from '../index.module.css';

/**
 * 漫画图片
 *
 * @param img 图片数据
 */
export const ComicImg: React.FC<Pick<ComicImg, 'index' | 'src' | 'type'>> =
  memo(({ index, src, type }) => {
    const imgRef = useRef<HTMLImageElement>(null);

    const handleImgLoaded = useCallback(() => {
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

    const loadType = useStore((state) => state.imgList[index].loadType);

    return (
      <div className={clsx(classes.img, classes[type])}>
        <img
          ref={imgRef}
          src={loadType === 'wait' ? '' : src}
          data-type={loadType}
          alt={`${index}`}
          onLoad={handleImgLoaded}
          onError={handleImgError}
          decoding="sync"
        />
        {loadType !== 'loaded' ? (
          <div className={classes.mask}>{loadTypeMap[loadType]}</div>
        ) : null}
      </div>
    );
  });
