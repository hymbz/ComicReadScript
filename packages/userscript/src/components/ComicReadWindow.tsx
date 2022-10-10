import MdClose from '@material-design-icons/svg/round/close.svg';

import { IconBotton } from '@crs/ui-component/dist/IconBotton';
import type { MangaProps } from '@crs/ui-component/dist/Manga';
import { Manga } from '@crs/ui-component/dist/Manga';
import type ReactDOM from 'react-dom/client';
import shadow from 'react-shadow';
import MangaStyle from '@crs/ui-component/dist/Manga.css';
import IconBottonStyle from '@crs/ui-component/dist/IconBotton.css';
import { querySelector } from '../helper';

let comicReadWindowRoot: ReactDOM.Root | null = null;
/**
 * 显示漫画阅读窗口
 *
 * @param imgUrlList
 */
export const showComicReadWindow = (imgUrlList: string[]) => {
  if (!imgUrlList.length) throw new Error('imgUrlList 为空');

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const ReactDOM: typeof import('react-dom/client') = require('react-dom');

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

  const editButtonList: MangaProps['editButtonList'] = (list) => [
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

  if (!comicReadWindowRoot) comicReadWindowRoot = ReactDOM.createRoot(dom);
  comicReadWindowRoot.render(
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
      <Manga imgUrlList={imgUrlList} editButtonList={editButtonList} />
      <style type="text/css">{IconBottonStyle}</style>
      <style type="text/css">{MangaStyle}</style>
    </shadow.div>,
  );

  document.body.style.overflow = 'hidden';
};
