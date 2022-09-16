import clsx from 'clsx';
import type { Draft } from 'immer';
import type { SyntheticEvent } from 'react';
import { memo, useEffect, useRef, useCallback } from 'react';
import { useStore } from '../hooks/useStore';

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

    const activeImgIndex = useStore((state) => state.activeImgIndex);
    const preloadImgNum = useStore((state) => state.option.preloadImgNum);
    // 页数发生变动时，预加载当前页前后指定数量的图片，并取消其他预加载的图片
    useEffect(() => {
      useStore.setState((state) => {
        // 跳过已加载完成的图片
        if (state.imgList[index].loadType === 'loaded') return;

        if (
          index > activeImgIndex - preloadImgNum / 2 &&
          index < activeImgIndex + preloadImgNum
        )
          state.imgList[index].loadType = 'loading';
        else if (state.imgList[index].loadType === 'loading')
          state.imgList[index].loadType = 'wait';
      });
    }, [index, activeImgIndex, preloadImgNum]);

    const loadType = useStore((state) => state.imgList[index].loadType);

    return (
      <img
        ref={imgRef}
        src={loadType === 'wait' ? '' : src}
        data-type={loadType}
        alt={`${index}`}
        className={clsx(classes.img, classes[type])}
        onLoad={handleImgLoaded}
        onError={handleImgError}
      />
    );
  });
