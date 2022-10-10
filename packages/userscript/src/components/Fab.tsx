import { Fab } from '@crs/ui-component/dist/Fab';
import FabStyle from '@crs/ui-component/dist/Fab.css';
import type ReactDOM from 'react-dom/client';
import shadow from 'react-shadow';
import type { MouseEventHandler } from 'react';
import { querySelector } from '../helper';

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
