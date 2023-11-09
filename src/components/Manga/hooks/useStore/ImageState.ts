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

  /** 是否处于拖拽模式 */
  dragMode: false,

  page: {
    /** 动画效果 */
    anima: '' as '' | 'zoom' | 'page',
    /** 竖向排列 */
    vertical: false,

    /** 正常显示页面所需的偏移量 */
    offset: {
      x: { pct: 0, px: 0 },
      y: { pct: 0, px: 0 },
    },
  },

  zoom: {
    /** 缩放大小 */
    scale: 100,
    /** 确保缩放前后基准点不变所需的偏移量 */
    offset: { x: 0, y: 0 },
  },
};
