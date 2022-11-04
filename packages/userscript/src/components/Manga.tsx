import MdClose from '@material-design-icons/svg/round/close.svg';

import { IconBotton } from '@crs/ui-component/dist/IconBotton';
import type { MangaProps } from '@crs/ui-component/dist/Manga';
import { Manga } from '@crs/ui-component/dist/Manga';
import shadow from 'react-shadow';
import MangaStyle from '@crs/ui-component/dist/Manga.css';
import IconBottonStyle from '@crs/ui-component/dist/IconBotton.css';
import produce from 'immer';
import { useComponentsRoot } from '../helper';

// TODO: 感觉可以去掉使用 函数 修改的方式？
export type MangaRecipe =
  | ((draftProps: MangaProps) => void)
  | Partial<MangaProps>;

/**
 * 显示漫画阅读窗口
 *
 * @param props
 */
export const useManga = (
  props?: MangaProps,
): [
  (recipe?: MangaRecipe, hide?: boolean) => void,
  (recipe: MangaRecipe) => void,
  boolean,
] => {
  const [root, dom] = useComponentsRoot('comicRead');

  let mangaProps = props ?? { imgList: [] };

  let enbale = false;

  mangaProps.onExit = () => {
    enbale = false;
    dom.style.visibility = 'hidden';
    document.documentElement.style.overflow = 'unset';
  };

  const set = (recipe: MangaRecipe) => {
    if (typeof recipe === 'function') mangaProps = produce(mangaProps, recipe);
    else Object.assign(mangaProps, recipe);
  };

  const show = (recipe?: MangaRecipe, hide = false) => {
    if (recipe) set(recipe);

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

    if (hide) {
      mangaProps.onExit!();
    } else {
      enbale = true;
      dom.style.visibility = 'visible';
      document.documentElement.style.overflow = 'hidden';
    }
  };

  const handleEnd = () => {
    mangaProps.onExit!();
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
