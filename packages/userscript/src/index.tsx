import rButton from '@crs/ui-component/dist/Manga';
import rButtonCss from '@crs/ui-component/dist/Manga.css';
import ReactDOM from 'react-dom/client';

(async () => {
  const root = ReactDOM.createRoot(document.getElementById('search')!);

  const Button = await rButton();
  await GM.addStyle(rButtonCss);

  root.render(<Button />);
})();
