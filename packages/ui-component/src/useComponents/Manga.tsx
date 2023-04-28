/* eslint-disable import/no-relative-packages */

import { createStore, produce } from 'solid-js/store';
import { IconButtonStyle } from '../components/IconButton';
import type { MangaProps } from '../components/Manga';
import { MangaStyle, Manga } from '../components/Manga';
import { mountComponents } from '../helper';

export type SelfMangaProps = MangaProps & {
  show: boolean;
  handleExit: MangaProps['onExit'];
};

/**
 * 显示漫画阅读窗口
 */
export const useManga = async (initProps?: Partial<SelfMangaProps>) => {
  await GM.addStyle(`
    #comicRead {
      position: fixed;
      z-index: 999999999;
      top: 0;
      left: 0;

      width: 100vw;
      height: 100vh;

      font-size: 16px;

      opacity: 1;

      transition: opacity 300ms, transform 100ms;
    }

    #comicRead.hidden {
      transform: scale(0);

      opacity: 0;

      transition: opacity 300ms, transform 0s 300ms;
    }
  `);

  const [props, setProps] = createStore({
    imgList: [],
    show: false,
    ...initProps,
  } as SelfMangaProps);

  const dom = mountComponents('comicRead', () => (
    <>
      <Manga {...props} />
      <style type="text/css">{IconButtonStyle}</style>
      <style type="text/css">{MangaStyle}</style>
    </>
  ));

  const set = (
    recipe: ((draftProps: SelfMangaProps) => void) | Partial<SelfMangaProps>,
  ) => {
    setProps(typeof recipe === 'function' ? produce(recipe) : recipe);

    if (props.imgList.length && props.show) {
      dom.className = '';
      document.documentElement.style.overflow = 'hidden';
    } else {
      dom.className = 'hidden';
      document.documentElement.style.overflow = 'unset';
    }
  };

  setProps({
    onExit: () => set({ show: false }),
  });

  return [set, props] as [typeof set, SelfMangaProps];
};
