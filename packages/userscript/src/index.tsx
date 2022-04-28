import { buildManga } from '@crs/ui-component/dist/index';
import ReactDOM from 'react-dom/client';

(() => {
  const root = ReactDOM.createRoot(document.querySelector('.css-1ydg16i')!);

  const Manga = buildManga();

  root.render(<Manga />);
})();
