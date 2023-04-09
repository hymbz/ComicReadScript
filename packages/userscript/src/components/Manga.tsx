import type { MangaProps } from '@crs/ui-component/dist/Manga';
import { Manga } from '@crs/ui-component/dist/Manga';
import shadow from 'react-shadow';
import MangaStyle from '@crs/ui-component/dist/Manga.css';
import IconBottonStyle from '@crs/ui-component/dist/IconButton.css';
import { useComponentsRoot } from '../helper/utils';

export type SelfMangaProps = MangaProps & {
  show: boolean;
  handleExit: MangaProps['onExit'];
};

/**
 * 显示漫画阅读窗口
 */
export const useManga = async (initProps?: Partial<SelfMangaProps>) => {
  const [root, dom] = useComponentsRoot('comicRead');
  await GM.addStyle(`
    #comicRead > div {
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

    #comicRead.hidden > div {
      transform: scale(0);

      opacity: 0;

      transition: opacity 300ms, transform 0s 300ms;
    }
  `);

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
      <shadow.div>
        <Manga {...props} />
        <style type="text/css">{IconBottonStyle}</style>
        <style type="text/css">{MangaStyle}</style>
      </shadow.div>,
    );

    if (props.imgList.length && props.show) {
      dom.className = '';
      document.documentElement.style.overflow = 'hidden';
    } else {
      dom.className = 'hidden';
      document.documentElement.style.overflow = 'unset';
    }
  };

  props.onExit = () => {
    set({ show: false });
  };

  return [set, props] as [typeof set, SelfMangaProps];
};
