import { type State } from 'components/Manga';

import { type RegionManager } from './backgroundDetection/Region';
import {
  LAB_QUANTIZE_LEVELS,
  SKIP_CENTER_RATIO,
} from './backgroundDetection/thresholds';
import {
  type LabQuantizedData,
  buildLabQuantizedData,
  toGrayListByLab,
} from './colorUtils';
import { Log } from './log';
import {
  type BlankMargin,
  type CenterBounds,
  type ImgContextInput,
} from './types';

/** 图片处理过程中需要共享/累积的状态和工具方法 */
export class ImgContext {
  readonly data: Uint8ClampedArray;
  readonly width: number;
  readonly height: number;
  readonly url: string;
  readonly index: number;
  readonly option: State['option']['imgRecognition'];
  readonly version: number;

  /** 中心保留区域的边界范围 */
  readonly bounds: CenterBounds;

  readonly logger = new Log();

  backgroundRegions?: RegionManager;
  /**
   * - undefined = 尚未计算
   * - null = 没有空白边缘
   * - 对象 = 计算出的的空白边缘
   */
  blankMargin?: BlankMargin | null;
  /**
   * - undefined = 尚未计算
   * - null = 没有背景色
   */
  background?: string | null;

  constructor({
    imgData,
    width,
    height,
    url,
    index,
    option,
    version,
  }: ImgContextInput) {
    this.data = imgData;
    this.width = width;
    this.height = height;
    this.url = url;
    this.index = index;
    this.option = option;
    this.version = version;

    const edgeScanRatio = (1 - SKIP_CENTER_RATIO) / 2;
    this.bounds = {
      startX: Math.floor(width * edgeScanRatio),
      endX: Math.ceil(width * (1 - edgeScanRatio)),
      startY: Math.floor(height * edgeScanRatio),
      endY: Math.ceil(height * (1 - edgeScanRatio)),
    };
  }

  /** 灰度表 */
  get grayList(): Uint8ClampedArray {
    if (!this._grayList) {
      this._grayList = this.computeGrayList();
      this.logger.mark('灰度图生成完成');
    }
    return this._grayList;
  }
  private _grayList?: Uint8ClampedArray;

  /** Oklab 量化数据 */
  get labQuantized(): LabQuantizedData {
    if (!this._labQuantized) {
      this._labQuantized = buildLabQuantizedData(
        this,
        LAB_QUANTIZE_LEVELS,
        (fn) => this.forEachOutsideCenter(fn),
      );
      this.logger.mark('Oklab 量化完成');
    }
    return this._labQuantized;
  }
  private _labQuantized?: LabQuantizedData;

  /** 遍历中心区域外的所有像素，按上下左右四个带状区域迭代，避免逐像素判断中心区域 */
  forEachOutsideCenter(fn: (index: number) => void) {
    const { startX, endX, startY, endY } = this.bounds;
    const { width, height } = this;

    for (let y = 0; y < startY; y++) {
      let index = y * width;
      for (let x = 0; x < width; x++, index++) fn(index);
    }

    for (let y = endY; y < height; y++) {
      let index = y * width;
      for (let x = 0; x < width; x++, index++) fn(index);
    }

    for (let y = startY; y < endY; y++) {
      let index = y * width;
      for (let x = 0; x < startX; x++, index++) fn(index);

      index = y * width + endX;
      for (let x = endX; x < width; x++, index++) fn(index);
    }
  }

  private computeGrayList(): Uint8ClampedArray {
    // 使用 Oklab 量化的数据来获取灰度表
    return toGrayListByLab(this.labQuantized);
  }

  /** 遍历图片的指定行 */
  forEachRows(
    y: number,
    fn: (x: number) => void,
    { start = 0, end = this.width }: { start?: number; end?: number } = {},
  ) {
    for (let i = start; i < end; i++) fn(this.width * y + i);
  }

  /** 遍历图片的指定列 */
  forEachCols(
    x: number,
    fn: (y: number) => void,
    { start = 0, end = this.height }: { start?: number; end?: number } = {},
  ) {
    for (let i = start; i < end; i++) fn(i * this.width + x);
  }
}
