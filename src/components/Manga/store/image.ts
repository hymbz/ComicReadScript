declare global {
  type ComicImg = {
    loadType: 'loading' | 'loaded' | 'error' | 'wait';
    type: 'long' | 'wide' | 'vertical' | '';
    src: string;
    width?: number;
    height?: number;

    translationUrl?: string;
    translationMessage?: string;
    translationType?: 'wait' | 'show' | 'hide' | 'error';
  };

  type PageList = Array<[number] | [number, number]>;
}

/** 值为 boolean 表示是自动修改的，值为 number 表示是手动修改 */
export type FillEffect = Record<number, boolean | number>;

export const imgState = {
  imgList: [] as ComicImg[],
  pageList: [] as PageList,

  fillEffect: { '-1': true } as FillEffect,

  /** 比例 */
  proportion: {
    单页比例: 0,
    横幅比例: 0,
    条漫比例: 0,
  },
};
