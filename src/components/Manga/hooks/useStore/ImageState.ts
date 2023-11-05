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

/** 页面填充数据 */
export type FillEffect = Record<number, boolean>;

export const imgState = {
  imgList: [] as ComicImg[],
  pageList: [] as PageList,

  /** 页面切换动画 */
  pageAnimation: false,
  /** 页面偏移量，百分比 */
  pageOffsetPct: 0,
  /** 页面偏移量，像素 */
  pageOffsetPx: 0,
  /** 是否处于拖拽模式 */
  dragMode: false,

  /** 页面填充数据 */
  fillEffect: { '-1': true } as FillEffect,

  /** 当前页数 */
  activePageIndex: 0,

  /** 比例 */
  proportion: {
    单页比例: 0,
    横幅比例: 0,
    条漫比例: 0,
  },
};
