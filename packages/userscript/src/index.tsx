import rButton from '@crs/ui-component/dist/Button';

import { getLib } from './helper/import';

// import component from './component';

const React = await getLib.React();
const ReactDOM = await getLib.ReactDOM();
const root = ReactDOM.createRoot(document.getElementById('ssr-top')!);

const Button = await rButton();
root.render(<Button />);
