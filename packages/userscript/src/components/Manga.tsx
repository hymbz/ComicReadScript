import MdClose from '@material-design-icons/svg/round/close.svg';

import { IconBotton } from '@crs/ui-component/dist/IconBotton';
import type { MangaProps } from '@crs/ui-component/dist/Manga';
import { Manga } from '@crs/ui-component/dist/Manga';
import shadow from 'react-shadow';
import MangaStyle from '@crs/ui-component/dist/Manga.css';
import IconBottonStyle from '@crs/ui-component/dist/IconBotton.css';
import produce from 'immer';
import { useComponentsRoot } from '../helper';

export type SelfMangaProps = MangaProps & { show: boolean };

/**
 * 显示漫画阅读窗口
 *
 * @param props
 */
export const useManga = (props?: Partial<SelfMangaProps>) => {
  const [root, dom] = useComponentsRoot('comicRead');

  let mangaProps = { imgList: [], show: false, ...props } as SelfMangaProps;

  mangaProps.onExit = () => {
    mangaProps.show = false;
    dom.style.visibility = 'hidden';
    document.documentElement.style.overflow = 'unset';
  };

  const set = (recipe: Partial<SelfMangaProps>) => {
    const oldEnable = mangaProps.show;
    if (recipe) {
      if (typeof recipe === 'function')
        mangaProps = produce(mangaProps, recipe);
      else Object.assign(mangaProps, recipe);
    }

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

    // 如果没有修改 show 参数则直接跳过
    if (oldEnable === mangaProps.show) return;

    if (mangaProps.show) {
      dom.style.visibility = 'visible';
      document.documentElement.style.overflow = 'hidden';
    } else {
      mangaProps.onExit?.();
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

  return set;
};
