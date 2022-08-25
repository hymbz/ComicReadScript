import type { AttributifyAttributes } from '@unocss/preset-attributify';

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface HTMLAttributes<T> extends AttributifyAttributes {}
}
