import rButton from '@crs/ui-component/dist/Manga';
import ReactDOM from 'react-dom/client';

(async () => {
  const root = ReactDOM.createRoot(document.getElementById('search')!);

  const Button = await rButton();

  root.render(<Button />);
})();
