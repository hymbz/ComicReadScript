import type { Preview } from 'storybook-solidjs-vite';

import { INITIAL_VIEWPORTS } from 'storybook/viewport';

import './global.css';
import 'normalize.css';

const preview: Preview = {
  parameters: {
    viewport: { viewports: INITIAL_VIEWPORTS },
    controls: { disableSaveFromUI: true },
  },
};

export default preview;
