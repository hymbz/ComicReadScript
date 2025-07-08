const prefix = [
  '%cComicRead',
  'background-color: #607d8b; color: white; padding: 2px 4px; border-radius: 4px;',
];

// oxlint-disable-next-line no-console
export const log = (...args: unknown[]) => console.log(...prefix, ...args);
log.warn = (...args: unknown[]) => console.warn(...prefix, ...args);
log.error = (...args: unknown[]) => console.error(...prefix, ...args);
