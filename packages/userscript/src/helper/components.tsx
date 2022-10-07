import type { MangaProps } from '@crs/ui-component/dist/Manga';
import { Manga, ToolbarButton } from '@crs/ui-component/dist/Manga';
import MangaStyle from '@crs/ui-component/dist/Manga.css';
import { Fab } from '@crs/ui-component/dist/Fab';
import FabStyle from '@crs/ui-component/dist/Fab.css';
import type ReactDOM from 'react-dom/client';
import MdClose from '@material-design-icons/svg/round/close.svg';
import shadow from 'react-shadow';
import type { MouseEventHandler } from 'react';
import { querySelector } from '.';

// TODO: 或许可以把这个放到 ui-component 里去？

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
        <ToolbarButton buttonKey="退出" onClick={onExit}>
          <MdClose />
        </ToolbarButton>
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
      <style type="text/css">{MangaStyle}</style>
    </shadow.div>,
  );

  document.body.style.overflow = 'hidden';
};

let FabRoot: ReactDOM.Root | null = null;
export const showFab = (onClick: MouseEventHandler) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const ReactDOM: typeof import('react-dom/client') = require('react-dom');

  let dom = querySelector('#readFab');
  if (!dom) {
    dom = document.createElement('div');
    dom.id = 'readFab';
    document.body.appendChild(dom);
  }

  if (!FabRoot) FabRoot = ReactDOM.createRoot(dom);
  FabRoot.render(
    <shadow.div>
      <Fab onClick={onClick} />
      <style type="text/css">{FabStyle}</style>
    </shadow.div>,
  );
};
