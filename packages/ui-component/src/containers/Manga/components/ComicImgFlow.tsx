import clsx from 'clsx';

import { useEffect, useMemo, useRef } from 'react';
import type { Draft } from 'immer';
import type { SelfState } from '../hooks/useStore';
import { useStore, shallow } from '../hooks/useStore';
import { ComicImg } from './ComicImg';

import classes from '../index.module.css';

const selector = ({
  activePageIndex,
  imgList,
  option: { scrollMode, disableZoom, dir },
  scrollbar: { handleMangaFlowScroll },
}: SelfState) => ({
  activePageIndex,
  imgList,
  scrollMode,
  disableZoom,
  dir,
  handleMangaFlowScroll,
});

/**
 * 漫画图片流的容器
 */
export const ComicImgFlow: React.FC = () => {
  const { imgList, scrollMode, disableZoom, dir, handleMangaFlowScroll } =
    useStore(selector, shallow);

  const mangaFlowRef = useRef<HTMLDivElement>(null);
  // 绑定 mangaFlowRef
  useEffect(() => {
    useStore.setState((state) => {
      state.mangaFlowRef = mangaFlowRef as Draft<React.RefObject<HTMLElement>>;
    });
  }, []);

  const imgEleList = useMemo(
    // eslint-disable-next-line react/no-array-index-key
    () => imgList.map((_, i) => <ComicImg key={i} index={i} />),
    [imgList],
  );

  return (
    <div
      ref={mangaFlowRef}
      id={classes.mangaFlow}
      className={clsx(
        classes.mangaFlow,
        (disableZoom || scrollMode) && classes.disableZoom,
        scrollMode && classes.scrollMode,
      )}
      dir={dir}
      onScroll={handleMangaFlowScroll}
    >
      {imgEleList}
    </div>
  );
};
