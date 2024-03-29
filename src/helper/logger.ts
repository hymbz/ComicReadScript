const prefix = [
  '%cComicRead',
  'background-color: #607d8b; color: white; padding: 2px 4px; border-radius: 4px;',
];

export const log = (...args: unknown[]) =>
  // eslint-disable-next-line no-console
  console.log.apply(null, [...prefix, ...args]);
log.warn = (...args: unknown[]) =>
  // eslint-disable-next-line no-console
  console.warn.apply(null, [...prefix, ...args]);
log.error = (...args: unknown[]) =>
  // eslint-disable-next-line no-console
  console.error.apply(null, [...prefix, ...args]);
