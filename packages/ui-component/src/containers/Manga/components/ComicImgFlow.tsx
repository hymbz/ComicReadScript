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

  const pageEleList = useMemo(
    () =>
      pageList.map(([a, b], i) => (
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
    [pageList],
  );

  const body = useMemo(() => {
    if (imgList.length === 0)
      return <div style={{ fontSize: '3em' }}>NULL</div>;

    if (scrollMode) return pageEleList;

    return (
      <div
        className={classes.wrapper}
        style={{ transform: `translateY(-${activePageIndex}00%)` }}
      >
        {pageEleList}
      </div>
    );
  }, [activePageIndex, imgList, scrollMode, pageEleList]);

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
