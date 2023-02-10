import type { MangaProps } from '@crs/ui-component/dist/Manga';
import { Manga } from '@crs/ui-component/dist/Manga';
import shadow from 'react-shadow';
import MangaStyle from '@crs/ui-component/dist/Manga.css';
import IconBottonStyle from '@crs/ui-component/dist/IconButton.css';
import { useComponentsRoot } from '../helper';

export type SelfMangaProps = MangaProps & { show: boolean };

/**
 * 显示漫画阅读窗口
 */
export const useManga = (initProps?: Partial<SelfMangaProps>) => {
  const [root, dom] = useComponentsRoot('comicRead');

  const props = { imgList: [], show: false, ...initProps } as SelfMangaProps;

  const set = (
    recipe:
      | Partial<SelfMangaProps>
      | ((props: SelfMangaProps) => Partial<SelfMangaProps>),
    render = true,
  ) => {
    if (recipe) {
      Object.assign(
        props,
        typeof recipe === 'function' ? recipe(props) : recipe,
      );
    }

    if (!render) return;

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
        <Manga {...props} />
        <style type="text/css">{IconBottonStyle}</style>
        <style type="text/css">{MangaStyle}</style>
      </shadow.div>,
    );

    if (props.imgList.length && props.show) {
      dom.style.visibility = 'visible';
      document.documentElement.style.overflow = 'hidden';
    } else {
      dom.style.visibility = 'hidden';
      document.documentElement.style.overflow = 'unset';
    }
  };

  props.onExit = () => {
    set({ show: false });
  };

  return [set, props] as [typeof set, SelfMangaProps];
};
