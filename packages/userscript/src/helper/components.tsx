import { Manga } from '@crs/ui-component/dist/Manga';
import MangaStyle from '@crs/ui-component/dist/Manga.css';
import ReactDOM from 'react-dom/client';
import shadow from 'react-shadow';
import { querySelector } from '.';

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

  const root = ReactDOM.createRoot(dom);

  root.render(
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
      <Manga imgUrlList={imgUrlList} />
      <style type="text/css">{MangaStyle}</style>
    </shadow.div>,
  );

  document.body.style.overflow = 'hidden';
};
