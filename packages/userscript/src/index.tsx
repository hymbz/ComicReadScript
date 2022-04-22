import rButton from '@crs/ui-component/dist/Button';
import ReactDOM from 'react-dom/client';

// import { creatLibProxy, selfLibName } from './helper/import';

// import { getLib } from './helper/import';

(async () => {
  // const React = await getLib.React();
  // const ReactDOM = await getLib.ReactDOM();

  const root = ReactDOM.createRoot(document.getElementById('search')!);

  const Button = await rButton();
  root.render(<Button />);
})();
