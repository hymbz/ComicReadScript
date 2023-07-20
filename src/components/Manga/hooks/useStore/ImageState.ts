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

/** 加载状态的中文描述 */
export const loadTypeMap: Record<ComicImg['loadType'], string> = {
  error: '加载出错',
  loading: '正在加载',
  wait: '等待加载',
  loaded: '',
};

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
};
