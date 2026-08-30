/** 图片四边的空白边缘比例 */
export type BlankMargin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type ComicImg = {
  loadType: 'loading' | 'loaded' | 'error' | 'wait';
  type?: 'long' | 'wide' | 'vertical' | '';
  src: string;
  width?: number;
  height?: number;
  name?: string;

  size: { height: number; width: number };
  blobUrl?: string;
  progress?: number;

  /** 背景色 */
  background?: string | null;
  /** 边缘区域 */
  blankMargin?: BlankMargin | null;
  /** 图片在「图像识别」处理时使用的配置版本号 */
  recognitionVersion?: number;

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

  /**
   * 图片显示状态
   *
   * 0 - 页面中的第一张图片
   * 1 - 页面中的最后一张图片
   * '' - 页面中的唯一一张图片
   */
  imgShowState: {} as Partial<Record<number, 0 | 1 | ''>>,
  defaultImgType: '' as ComicImg['type'],
};
