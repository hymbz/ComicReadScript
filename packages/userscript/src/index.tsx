import rButton from '@crs/ui-component/dist/Manga';
import ReactDOM from 'react-dom/client';

(() => {
  const root = ReactDOM.createRoot(document.getElementById('search')!);

  const Button = rButton();

  root.render(<Button />);
})();
