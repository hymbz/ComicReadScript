import type { ComicImg } from 'components/Manga';

export type MainFn = {
  t: typeof import('helper').t;
  log: typeof import('helper').log;
  toast: typeof import('components/Toast').toast;
  setImg: <K extends keyof ComicImg>(
    url: string,
    key: K,
    val: ComicImg[K],
  ) => void;
  getModel: () => Promise<{
    base64: string;
    json: string;
    buffer: ArrayBuffer | undefined;
  }>;
};
export const mainFn = {} as MainFn;
export const setMainFn = (helper: MainFn, keys: string[]) => {
  for (const name of keys)
    Reflect.set(mainFn, name, (...args: any[]) =>
      Reflect.apply(helper[name], helper, args),
    );
};

export const base64ToArrayBuffer = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.codePointAt(i)!;
  return bytes.buffer;
};
