import {
  type ComicImg,
  type State,
  type updatePageData,
} from 'components/Manga';

export { type BlankMargin } from 'components/Manga';

/** 从主线程传入 worker 的图片输入数据 */
export type ImgContextInput = {
  /** 原始图片像素数据 */
  imgData: Uint8ClampedArray;
  /** 原始图片宽度 */
  width: number;
  /** 原始图片高度 */
  height: number;
  /** 图片地址 */
  url: string;
  /** 图片在 imgList 中的序号 */
  index: number;
  /** 当前图像识别配置 */
  option: State['option']['imgRecognition'];
  /** 识别版本号，用于丢弃过期结果 */
  version: number;
};

/** 中心保留区域的边界范围。 */
export type CenterBounds = {
  startX: number;
  endX: number;
  startY: number;
  endY: number;
};

export type MainFn = {
  showImage?: typeof import('components/DebugPopup').showImage;
  showColorArea?: typeof import('components/DebugPopup').showColorArea;
  showGrayList?: typeof import('components/DebugPopup').showGrayList;
  log: typeof import('helper').log;
  setImg: <K extends keyof ComicImg>(payload: {
    url: string;
    key: K;
    val: ComicImg[K];
    version: number;
  }) => void;
  updatePageData: typeof updatePageData.throttle;
};
