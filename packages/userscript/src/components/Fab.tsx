import type { FabProps } from '@crs/ui-component/dist/Fab';
import { Fab } from '@crs/ui-component/dist/Fab';
import FabStyle from '@crs/ui-component/dist/Fab.css';
import type ReactDOM from 'react-dom/client';
import shadow from 'react-shadow';
import { querySelector } from '../helper';

let FabRoot: ReactDOM.Root | null = null;
export const showFab = (props: FabProps) => {
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
      <Fab {...props} />
      <style type="text/css">{FabStyle}</style>
    </shadow.div>,
  );
};
