import type { MangaProps } from '@crs/ui-component/dist/Manga';
import { Manga, ToolbarButton } from '@crs/ui-component/dist/Manga';
import MangaStyle from '@crs/ui-component/dist/Manga.css';
import ReactDOM from 'react-dom/client';
import { MdClose } from 'react-icons/md';
import shadow from 'react-shadow';
import { querySelector } from '.';

let comicReadWindowRoot: ReactDOM.Root | null = null;
/**
 * 显示漫画阅读窗口
 *
 * @param imgUrlList
 */
export const showComicReadWindow = (imgUrlList: string[]) => {
  if (!imgUrlList.length) throw new Error('imgUrlList 为空');

  let dom = querySelector('#comicRead');
  if (!dom) {
    dom = document.createElement('div');
    dom.id = 'comicRead';
    document.body.appendChild(dom);
  }

  const option: MangaProps['option'] = {
    onExit() {
      dom!.style.display = 'none';
      document.body.style.overflow = 'unset';
    },
  };

  const editButtonList: MangaProps['editButtonList'] = (list) => [
    ...list,
    [
      '退出',
      () => {
        return (
          <ToolbarButton buttonKey="退出" onClick={option.onExit}>
            <MdClose />
          </ToolbarButton>
        );
      },
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
      <Manga
        imgUrlList={imgUrlList}
        option={option}
        editButtonList={editButtonList}
      />
      <style type="text/css">{MangaStyle}</style>
    </shadow.div>,
  );

  document.body.style.overflow = 'hidden';
};
