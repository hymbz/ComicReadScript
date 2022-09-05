import { Button } from '@crs/ui-component/dist/Button';
import ButtonStyle from '@crs/ui-component/dist/Button.css';
import ReactDOM from 'react-dom/client';
import shadow from 'react-shadow';

(() => {
  const root = ReactDOM.createRoot(document.querySelector('.SDkEP')!);

  root.render(
    <shadow.div>
      <Button />
      <style type="text/css">{ButtonStyle}</style>
    </shadow.div>,
  );
})();
