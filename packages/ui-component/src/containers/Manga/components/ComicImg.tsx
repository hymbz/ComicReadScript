import clsx from 'clsx';
import type { Draft } from 'immer';
import type { SyntheticEvent } from 'react';
import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useStore } from '../hooks/useStore';

import classes from '../index.module.css';

export interface ComicImgProps {
  img: ComicImg;
}

const selector = ({
  activeImgIndex,
  option: { preloadImgNum },
}: SelfState) => ({
  activeImgIndex,
  preloadImgNum,
});

/**
 * 漫画图片
 *
 * @param img 图片数据
 */
export const ComicImg: React.FC<ComicImgProps> = ({ img }) => {
  const { activeImgIndex, preloadImgNum } = useStore(selector);

  const imgRef = useRef<HTMLImageElement>(null);

  const handleImgLoaded = useCallback(() => {
    useStore.setState((state) => {
      if (typeof img.index !== 'number' || !imgRef.current) return;

      const draftImg = state.imgList[img.index];
      draftImg.loadType = 'loaded';
      draftImg.height = imgRef.current.naturalHeight;
      draftImg.width = imgRef.current.naturalWidth;
      state.img.updateImgType(draftImg);
    });
  }, [img.index]);

  const handleImgError = useCallback(
    (e: SyntheticEvent<HTMLImageElement, Event>) => {
      useStore.setState((state) => {
        if (typeof img.index !== 'number') return;

        const draftImg = state.imgList[img.index];
        draftImg.loadType = 'error';
        draftImg.error = e as Draft<SyntheticEvent<HTMLImageElement, Event>>;
      });
    },
    [img.index],
  );

  // 页数发生变动时，预加载当前页前后指定数量的图片，并取消加载其他加载中的图片
  const src = useMemo(
    () =>
      // 已加载完成的图片正常显示
      img.loadType === 'loaded' ||
      img.index === '填充' ||
      (img.index > activeImgIndex - preloadImgNum / 2 &&
        img.index < activeImgIndex + preloadImgNum)
        ? img.src
        : '',
    [activeImgIndex, img.index, img.loadType, img.src, preloadImgNum],
  );

  // 更新图片状态
  useEffect(() => {
    if (img.index !== '填充')
      useStore.setState((state) => {
        if (img.index === '填充') return;
        if (state.imgList[img.index].loadType !== 'loaded')
          state.imgList[img.index].loadType = src ? 'loading' : 'wait';
      });
  }, [img.index, src]);

  return (
    <img
      ref={imgRef}
      src={src}
      data-type={img.loadType}
      alt={`${img.index}`}
      className={clsx(classes.img, classes[img.type])}
      onLoad={handleImgLoaded}
      onError={handleImgError}
    />
  );
};
