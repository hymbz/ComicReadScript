import clsx from 'clsx';

import { useEffect, useMemo, useRef } from 'react';
import type { Draft } from 'immer';
import type { SelfState } from '../hooks/useStore';
import { useStore, shallow } from '../hooks/useStore';
import { ComicImg } from './ComicImg';

import classes from '../index.module.css';

const selector = ({
  pageList,
  activePageIndex,
  imgList,
  option: { scrollMode, disableZoom, dir },
  scrollbar: { watchMangaFlowScroll },
}: SelfState) => ({
  pageList,
  activePageIndex,
  imgList,
  scrollMode,
  disableZoom,
  dir,
  watchMangaFlowScroll,
});

/**
 * 漫画图片流的容器
 */
export const ComicImgFlow: React.FC = () => {
  const {
    pageList,
    activePageIndex,
    imgList,
    scrollMode,
    disableZoom,
    dir,
    watchMangaFlowScroll,
  } = useStore(selector, shallow);

  const mangaFlowRef = useRef<HTMLDivElement>(null);
  // 绑定 mangaFlowRef
  useEffect(() => {
    useStore.setState((state) => {
      state.mangaFlowRef = mangaFlowRef as Draft<React.RefObject<HTMLElement>>;
    });
  }, []);

  const imgEleList = useMemo(
    () => imgList.map(({ index }) => <ComicImg key={index} index={index} />),
    [imgList],
  );

  const gridAreas = useMemo(
    () =>
      pageList
        .map(
          (page) =>
            `"${page.map((i) => (i !== -1 ? `_${i}` : '.')).join(' ')}"`,
        )
        .join('\n'),
    [pageList],
  );

  const body = useMemo(() => {
    if (imgEleList.length === 0)
      return <div style={{ fontSize: '3em' }}>NULL</div>;

    if (scrollMode) return imgEleList;

    return (
      <div
        className={classes.wrapper}
        style={{
          transform: `translateY(-${activePageIndex}00%)`,
          gridTemplateAreas: gridAreas,
        }}
      >
        {imgEleList}
      </div>
    );
  }, [imgEleList, scrollMode, activePageIndex, gridAreas]);

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
      onScroll={watchMangaFlowScroll}
    >
      {body}
    </div>
  );
};
