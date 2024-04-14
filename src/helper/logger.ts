const prefix = [
  '%cComicRead',
  'background-color: #607d8b; color: white; padding: 2px 4px; border-radius: 4px;',
];

export const log = (...args: unknown[]) =>
  Reflect.apply(console.log, null, [...prefix, ...args]);
log.warn = (...args: unknown[]) =>
  Reflect.apply(console.warn, null, [...prefix, ...args]);
log.error = (...args: unknown[]) =>
  Reflect.apply(console.error, null, [...prefix, ...args]);
