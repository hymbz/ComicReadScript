import {
  ColorHistogram,
  type LabQuantizedData,
  type RGBColor,
  groupColorsByHsv,
  rgbToHex,
} from '../colorUtils';
import { type ImgContext } from '../imgContext';
import { MIN_REGION_RATIO, RESERVED_REGION_ID } from './thresholds';

/** 4-连通的相邻像素位置偏移 */
const NEIGHBOR_OFFSETS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
] as const;

export abstract class Region {
  public readonly id: number;

  /** 该区域包含的所有像素索引 */
  readonly pixelIndexes: number[] = [];

  /** 所属的区域管理器 */
  protected readonly manager: RegionManager;

  /** 区域颜色直方图 */
  private readonly colorHistogram = new ColorHistogram();

  public constructor(manager: RegionManager, id: number) {
    this.manager = manager;
    this.id = id;
  }

  /** 当前区域的像素数量 */
  get pixelCount(): number {
    return this.pixelIndexes.length;
  }

  /** 将像素添加到区域里来，返回是否成功添加 */
  public addPixel(index: number): boolean {
    // 检查像素是否尚未被其他区域占用
    if (this.manager.getOwner(index) !== 0) return false;

    // 检查像素是否符合 checkPixel 的条件
    if (!this.checkPixel(index)) return false;

    if (this.manager.claimPixel(index, this.id)) {
      this.pixelIndexes.push(index);
      this.updateColorHistogram(index);
      this.onPixelAdded(index);
      return true;
    }

    return false;
  }

  /** 将像素的 Oklab 量化分组码加入区域的颜色直方图 */
  private updateColorHistogram(index: number): void {
    const group = this.manager.labQuantized.groupList[index];
    if (group >= 0) this.colorHistogram.add(group);
  }

  /**
   * 从种子像素开始，以 4-连通方式将满足 checkPixel 的相邻像素加入当前区域。
   *
   * 如果种子像素无法加入，自动释放当前区域。
   */
  public growFromSeed(seedIndex: number): void {
    if (!this.addPixel(seedIndex)) return this.manager.releaseRegion(this.id);

    const { width, height } = this.manager;
    const queue = [seedIndex];
    let head = 0;
    while (head < queue.length) {
      const current = queue[head];
      head += 1;

      const currentX = current % width;
      const currentY = Math.floor(current / width);

      for (const [dx, dy] of NEIGHBOR_OFFSETS) {
        const nextX = currentX + dx;
        const nextY = currentY + dy;
        if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height)
          continue;

        const nextIndex = nextY * width + nextX;
        if (this.manager.getOwner(nextIndex) !== 0) continue;
        if (this.addPixel(nextIndex)) queue.push(nextIndex);
      }
    }
  }

  /** 算法独有的像素检查，由子类实现。 */
  protected abstract checkPixel(index: number): boolean;

  /** 像素成功添加后的回调，用于维护算法特定的派生状态 */
  protected abstract onPixelAdded(index: number): void;

  /** 当另一个区域合并到当前区域时调用，用于合并子类维护的派生状态 */
  public onMerged(source: Region): void {
    this.colorHistogram.merge(source.colorHistogram);
  }

  /** 遍历该区域包含的所有像素索引 */
  public forEachPixel(callback: (index: number) => void): void {
    for (const index of this.pixelIndexes) callback(index);
  }

  /** 获取区域的众数 Oklab */
  getModeLab(): { l: number; a: number; b: number } | undefined {
    const group = this.colorHistogram.getModeKey();
    if (group === undefined) return;

    const lab = this.manager.labQuantized.groupToLab;
    const offset = group * 3;
    return { l: lab[offset], a: lab[offset + 1], b: lab[offset + 2] };
  }

  /** 获取区域众数色对应的 Oklab 量化分组 id */
  getQuantizedGroup(): number | undefined {
    return this.colorHistogram.getModeKey();
  }

  /** 获取区域的量化 RGB（Oklab 量化分组对应的平均 RGB，仅用于 HSV 分组） */
  getQuantizedRgb(): { r: number; g: number; b: number } | undefined {
    const group = this.getQuantizedGroup();
    if (group === undefined) return;

    const rgb = this.manager.labQuantized.groupToRgb;
    const offset = group * 3;
    return { r: rgb[offset], g: rgb[offset + 1], b: rgb[offset + 2] };
  }

  /**
   * 获取该区域在原图中的主色
   *
   * 从众数 Oklab 分组内取原图 RGB 的精确众数
   */
  getMainColor(): string {
    const group = this.colorHistogram.getModeKey();
    if (group === undefined) throw new Error('区域没有像素，无法获取主色');

    const counts = new Map<
      number,
      { count: number; r: number; g: number; b: number }
    >();
    let maxKey = 0;
    let maxCount = 0;

    this.forEachPixel((index) => {
      if (this.manager.labQuantized.groupList[index] !== group) return;

      const i = index * 4;
      const r = this.manager.data[i];
      const g = this.manager.data[i + 1];
      const b = this.manager.data[i + 2];
      const key = (r << 16) | (g << 8) | b;

      const item = counts.get(key);
      if (item) item.count += 1;
      else counts.set(key, { count: 1, r, g, b });

      const count = item ? item.count : 1;
      if (count > maxCount) {
        maxKey = key;
        maxCount = count;
      }
    });

    const rgb = counts.get(maxKey);
    if (!rgb) throw new Error('区域中不存在主色分组对应的像素');

    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }
}

/**
 * 区域管理器
 *
 * 负责像素归属的统一管理，以及区域实例的注册与查询。
 */
export class RegionManager {
  /** 图片宽度 */
  public readonly width: number;

  /** 图片高度 */
  public readonly height: number;

  /** 图片像素数据 */
  public readonly data: Uint8ClampedArray;

  /** 统一的 Oklab 像素量化数据 */
  public readonly labQuantized: LabQuantizedData;

  /**
   * 记录像素归属情况
   *
   * 值为区域 id：0 表示无归属，>0 表示归属对应 id 的区域，<0 表示保留区域
   */
  private readonly ownership: Int32Array;

  /** 已注册的区域实例，键为区域 id，值为区域对象 */
  private readonly regions = new Map<number, Region>();

  /** 下一个可分配的区域 id */
  private nextId = 1;

  constructor(img: ImgContext) {
    this.width = img.width;
    this.height = img.height;
    this.ownership = new Int32Array(img.width * img.height);
    this.data = img.data;
    this.labQuantized = img.labQuantized;
    this.reserveCenter(img);
  }

  /** 将图片的中间区域标记为保留区域，不参与识别 */
  private reserveCenter(img: ImgContext) {
    for (let y = img.bounds.startY; y < img.bounds.endY; y++)
      for (let x = img.bounds.startX; x < img.bounds.endX; x++)
        this.claimPixel(y * img.width + x, RESERVED_REGION_ID);
  }

  /** 创建并注册一个区域实例 */
  public createRegion<T extends Region>(
    RegionClass: new (manager: RegionManager, id: number, ...args: any[]) => T,
    ...args: any[]
  ): T {
    const id = this.nextId;
    this.nextId += 1;
    const region = new RegionClass(this, id, ...args);
    this.regions.set(id, region);
    return region;
  }

  /** 根据 id 获取区域实例 */
  public getRegion(id: number): Region | undefined {
    return this.regions.get(id);
  }

  /** 获取当前所有已注册区域的 id 列表 */
  public getRegionIds() {
    return this.regions.keys();
  }

  /** 获取当前已注册区域的数量 */
  public getRegionCount(): number {
    return this.regions.size;
  }

  /** 获取指定像素的归属区域 id */
  public getOwner(index: number): number {
    return this.ownership[index];
  }

  /** 将指定像素认领给指定区域，返回是否认领成功 */
  public claimPixel(index: number, regionId: number): boolean {
    if (this.ownership[index] !== 0) return false;
    this.ownership[index] = regionId;
    return true;
  }

  /** 释放指定像素的归属，返回是否释放成功 */
  public releasePixel(index: number, regionId: number): boolean {
    if (this.ownership[index] !== regionId) return false;
    this.ownership[index] = 0;
    return true;
  }

  /** 注销区域，释放所属像素 */
  public releaseRegion(regionId: number): void {
    const region = this.regions.get(regionId);
    if (!region) return;

    for (const index of region.pixelIndexes) this.ownership[index] = 0;
    region.pixelIndexes.length = 0;
    this.regions.delete(regionId);
  }

  /** 删除所有面积过小的区域，并返回被删除的区域 id 列表 */
  public removeSmallRegions(): void {
    const minPixelCount = Math.max(
      1,
      Math.floor(this.width * this.height * MIN_REGION_RATIO),
    );
    for (const id of this.regions.keys()) {
      const region = this.regions.get(id);
      if (region && region.pixelCount < minPixelCount) this.releaseRegion(id);
    }
  }

  /** 合并颜色相似的区域 */
  public mergeSimilarRegions(): void {
    // 用于将被花纹分割成的多个小区域重新合并，避免被 removeSmallRegions 删掉

    if (this.regions.size <= 1) return;

    // 同一个量化分组的代表色一定相同，先聚成一组，减少 HSV 分组的输入规模
    const idsByGroup = new Map<number, number[]>();
    for (const region of this.regions.values()) {
      const group = region.getQuantizedGroup();
      if (group === undefined) continue;

      const ids = idsByGroup.get(group);
      if (ids) ids.push(region.id);
      else idsByGroup.set(group, [region.id]);
    }

    if (idsByGroup.size === 0) return;

    const representativeRgbs: RGBColor[] = [];
    const representativeGroups: number[] = [];
    for (const [group, ids] of idsByGroup) {
      const rgb = this.regions.get(ids[0])?.getQuantizedRgb();
      if (!rgb) continue;
      representativeRgbs.push(rgb);
      representativeGroups.push(group);
    }

    if (representativeRgbs.length === 0) return;

    const groups = groupColorsByHsv(representativeRgbs);
    for (const group of groups) {
      if (group.length === 0) continue;

      // 在整个颜色组里选面积最大的区域作为合并目标，减少 ownership 写入
      let targetId = -1;
      let maxCount = -1;
      for (const representativeIndex of group) {
        const ids = idsByGroup.get(representativeGroups[representativeIndex]);
        if (!ids) continue;
        for (const id of ids) {
          const count = this.regions.get(id)?.pixelCount ?? 0;
          if (count > maxCount) {
            maxCount = count;
            targetId = id;
          }
        }
      }

      for (const representativeIndex of group) {
        const ids = idsByGroup.get(representativeGroups[representativeIndex]);
        if (!ids) continue;
        for (const id of ids)
          if (id !== targetId) this.mergeRegions(targetId, id);
      }
    }
  }

  /**
   * 将一个区域的所有像素合并到另一个区域，并注销源区域，返回是否合并成功
   *
   * 合并后，源区域的 id 不再有效，目标区域的 pixelCount 会增加源区域的像素数量
   */
  public mergeRegions(targetId: number, sourceId: number): boolean {
    const target = this.regions.get(targetId);
    const source = this.regions.get(sourceId);
    if (!target || !source) return false;

    const sourcePixels = source.pixelIndexes;
    const targetPixels = target.pixelIndexes;
    const sourceLength = sourcePixels.length;
    const targetStart = targetPixels.length;

    targetPixels.length = targetStart + sourceLength;
    for (let i = 0; i < sourceLength; i++) {
      const index = sourcePixels[i];
      this.ownership[index] = targetId;
      targetPixels[targetStart + i] = index;
    }

    sourcePixels.length = 0;
    target.onMerged(source);
    this.regions.delete(sourceId);
    return true;
  }

  /** 遍历指定区域的所有像素索引 */
  public forEachPixelOfRegion(
    regionId: number,
    callback: (index: number) => void,
  ): void {
    this.regions.get(regionId)?.forEachPixel(callback);
  }
}
