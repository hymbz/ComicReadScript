export type ComicImg = {
  loadType: 'loading' | 'loaded' | 'error' | 'wait';
  type?: 'long' | 'wide' | 'vertical' | '';
  src: string;
  width?: number;
  height?: number;

  size: { height: number; width: number };
  blobUrl?: string;
  progress?: number;

  background?: string;
  blankMargin?: { left: number; right: number } | null;

  translationUrl?: string;
  translationMessage?: string;
  translationType?: 'wait' | 'show' | 'hide' | 'error';

  upscaleUrl?: string;
};

export type PageList = ([number] | [number, number])[];

/** 值为 boolean 表示是自动修改的，值为 number 表示是手动修改 */
export type FillEffect = Record<number, boolean | 1 | 0>;

export const imgState = {
  imgMap: {} as Record<string, ComicImg>,
  imgList: [] as string[],
  pageList: [] as PageList,

  fillEffect: { '-1': true } as FillEffect,

  showRange: [0, 0] as [number, number],
  renderRange: [0, 0] as [number, number],
  loadingRange: [0, 0] as [number, number],

  defaultImgType: '' as ComicImg['type'],
};
