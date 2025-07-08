import type { StorybookConfig } from 'storybook-solidjs-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: ['../src/stories/public'],
  framework: 'storybook-solidjs-vite',
  addons: ['@vueless/storybook-dark-mode', '@storybook/addon-docs'],
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
    enableCrashReports: false,
  },
};
export default config;
