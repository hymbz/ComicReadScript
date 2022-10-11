import MdClose from '@material-design-icons/svg/round/close.svg';

import { IconBotton } from '@crs/ui-component/dist/IconBotton';
import type { MangaProps } from '@crs/ui-component/dist/Manga';
import { Manga } from '@crs/ui-component/dist/Manga';
import ReactDOM from 'react-dom/client';
import shadow from 'react-shadow';
import MangaStyle from '@crs/ui-component/dist/Manga.css';
import IconBottonStyle from '@crs/ui-component/dist/IconBotton.css';
import produce from 'immer';
import { querySelector } from '../helper';

export type MangaRecipe = (draftProps: MangaProps) => void;

let mangaRoot: ReactDOM.Root | null = null;
/**
 * 显示漫画阅读窗口
 *
 * @param props
 */
export const useManga = (
  props?: MangaProps,
): [(recipe?: MangaRecipe) => void, (recipe: MangaRecipe) => void] => {
  let mangaProps = props ?? { imgList: [] };

  let dom = querySelector('#comicRead');
  if (!dom) {
    dom = document.createElement('div');
    dom.id = 'comicRead';
    document.body.appendChild(dom);
  }

  const onExit = () => {
    dom!.style.display = 'none';
    document.body.style.overflow = 'unset';
  };

  mangaProps.editButtonList = (list) => [
    ...list,
    [
      '退出',
      () => (
        <IconBotton tip="退出" onClick={onExit}>
          <MdClose />
        </IconBotton>
      ),
    ],
  ];

  dom.style.display = 'unset';

  if (!mangaRoot) mangaRoot = ReactDOM.createRoot(dom);

  const set = (recipe: MangaRecipe) => {
    mangaProps = produce(mangaProps, recipe);
  };

  const show = (recipe?: MangaRecipe) => {
    if (recipe) set(recipe);

    if (!mangaProps.imgList.length) throw new Error('imgList 为空');

    mangaRoot!.render(
      <shadow.div
        style={{
          position: 'fixed',
          height: '100vh',
          width: '100vw',
          top: 0,
          left: 0,
          zIndex: 99999,
        }}
      >
        <Manga {...mangaProps} />
        <style type="text/css">{IconBottonStyle}</style>
        <style type="text/css">{MangaStyle}</style>
      </shadow.div>,
    );

    document.body.style.overflow = 'hidden';
  };

  return [show, set];
};
