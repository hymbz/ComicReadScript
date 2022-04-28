import rButton from '@crs/ui-component/dist/Manga';
import ReactDOM from 'react-dom/client';

(() => {
  const root = ReactDOM.createRoot(document.querySelector('.css-1ydg16i')!);

  const Button = rButton();

  root.render(<Button />);
})();
