import type { Component } from 'solid-js';
import { Index, onMount } from 'solid-js';

import { ComicImg } from './ComicImg';
import { setState, store } from '../hooks/useStore';
import { handleMangaFlowScroll, initPanzoom } from '../hooks/useStore/slice';

import classes from '../index.module.css';

/**
 * 漫画图片流的容器
 */
export const ComicImgFlow: Component = () => {
  let mangaFlowRef: HTMLDivElement;
  // 绑定 mangaFlowRef
  onMount(() => {
    setState((state) => {
      state.mangaFlowRef = mangaFlowRef;
      initPanzoom(state);
    });
  });

  return (
    <div class={classes.mangaFlowBox} onScroll={handleMangaFlowScroll}>
      <div
        id={classes.mangaFlow}
        ref={mangaFlowRef!}
        class={classes.mangaFlow}
        classList={{
          [classes.disableZoom]:
            store.option.disableZoom || store.option.scrollMode,
          [classes.scrollMode]: store.option.scrollMode,
        }}
        dir={store.option.dir}
      >
        <Index each={store.imgList}>
          {(img, i) => <ComicImg img={img()} index={i} />}
        </Index>
      </div>
    </div>
  );
};
