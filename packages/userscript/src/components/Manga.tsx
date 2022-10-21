import MdClose from '@material-design-icons/svg/round/close.svg';

import { IconBotton } from '@crs/ui-component/dist/IconBotton';
import type { MangaProps } from '@crs/ui-component/dist/Manga';
import { Manga } from '@crs/ui-component/dist/Manga';
import shadow from 'react-shadow';
import MangaStyle from '@crs/ui-component/dist/Manga.css';
import IconBottonStyle from '@crs/ui-component/dist/IconBotton.css';
import produce from 'immer';
import { useComponentsRoot } from '../helper';

export type MangaRecipe = (draftProps: MangaProps) => void;

/**
 * 显示漫画阅读窗口
 *
 * @param props
 */
export const useManga = (
  props?: MangaProps,
): [(recipe?: MangaRecipe) => void, (recipe: MangaRecipe) => void, boolean] => {
  const [root, dom] = useComponentsRoot('comicRead');

  let mangaProps = props ?? { imgList: [] };

  let enbale = false;

  const set = (recipe: MangaRecipe) => {
    mangaProps = produce(mangaProps, recipe);
  };

  const show = (recipe?: MangaRecipe) => {
    if (recipe) set(recipe);

    if (!mangaProps.imgList.length) throw new Error('imgList 为空');

    // 仅在初次运行时渲染节点
    if (dom.style.display === '')
      root.render(
        <shadow.div
          style={{
            fontSize: 16,
            position: 'fixed',
            height: '100vh',
            width: '100vw',
            top: 0,
            left: 0,
            zIndex: 999999999,
          }}
        >
          <Manga {...mangaProps} />
          <style type="text/css">{IconBottonStyle}</style>
          <style type="text/css">{MangaStyle}</style>
        </shadow.div>,
      );

    enbale = true;
    dom.style.visibility = 'visible';
    document.documentElement.style.overflow = 'hidden';
  };

  mangaProps.onExit = () => {
    enbale = false;
    dom.style.visibility = 'hidden';
    document.documentElement.style.overflow = 'unset';
  };

  const handleEnd = () => {
    mangaProps.onExit?.();
  };
  mangaProps.editButtonList = (list) => [
    ...list,
    [
      '退出',
      () => (
        <IconBotton tip="退出" onClick={handleEnd}>
          <MdClose />
        </IconBotton>
      ),
    ],
  ];

  return [show, set, enbale];
};
