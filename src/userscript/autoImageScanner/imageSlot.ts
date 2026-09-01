import { isImageElement } from 'helper';

import { type ImageInfo } from './ImageWatcher';
import { isLazyLoadFailed } from './triggerLazyLoad';

/** 判断两个元素的 dataset 是否具有相同的键结构 */
const hasSameDatasetStructure = (a: HTMLElement, b: HTMLElement) => {
  const keysA = Object.keys(a.dataset);
  const keysB = Object.keys(b.dataset);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => keysB.includes(key));
};

/** 判断两个元素是否相似 */
const isSimilarElement = (a: HTMLElement, b: HTMLElement) =>
  a === b ||
  (a.className && a.className === b.className) ||
  hasSameDatasetStructure(a, b);

const SKIP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'IFRAME',
  'HEAD',
  'TEMPLATE',
]);
/** 判断元素是否为明显不可能是图片槽位 */
const isImageHostIneligible = (element: HTMLElement) => {
  // 元素不可见
  if (!element.checkVisibility()) return true;
  // 自己就是图片槽位
  if (isImageElement(element)) return false;
  // 被黑名单标记
  if (SKIP_TAGS.has(element.tagName)) return true;
  // 没有任何子元素
  if (element.children.length === 0) return true;
  // 多次触发懒加载仍未成功加载出图片，不可能是图片槽位
  if (isLazyLoadFailed(element)) return true;
  return false;
};

/** 判断元素是否具有足够的尺寸 */
const hasValidSize = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return rect.width >= 100 && rect.height >= 100;
};

/** 查找最近一层的「与当前元素相似」且数量足够的兄弟图片槽位 */
export const findSimilarImageSlots = (
  element: HTMLElement,
  threshold: number,
): HTMLElement[] => {
  let current: HTMLElement | undefined = element;

  while (current?.parentElement) {
    const siblingList = current.parentElement.children;
    if (siblingList.length >= threshold) {
      const similarElements: HTMLElement[] = [];
      for (const sibling of siblingList) {
        if (
          !(sibling instanceof HTMLElement) ||
          !isSimilarElement(sibling, current) ||
          isImageHostIneligible(sibling) ||
          (!isImageElement(sibling) && !hasValidSize(sibling))
        )
          continue;
        similarElements.push(sibling);
      }
      if (similarElements.length >= threshold) return similarElements;
    }
    current = current.parentElement;
  }

  return [];
};

/** 一组图片槽位 */
export type ImageSlotGroup = {
  /** 槽位组的共同父元素，用于快速判断图片是否可能属于该组 */
  parent: HTMLElement;
  /** 相似的兄弟图片槽位；可能是 img，也可能是包裹 img 的元素 */
  slots: Set<HTMLElement>;
  /** 该组内所有通过 filterImg 的图片 */
  coveredImgs: Set<HTMLImageElement>;
  /** 组内图片显示面积的中位数，懒计算并缓存 */
  readonly medianArea: number;
  /** 组内所有通过 filterImg 的图片的数量 */
  readonly imgNum: number;
};

/** 至少需要几个相似的兄弟元素，才断定他们是一组图 */
export const IMAGE_SLOT_THRESHOLD = 5;

/** 收集一个槽位内所有已通过 filterImg 的图片 */
const addSlotImgs = (
  slot: HTMLElement,
  rawImgSet: Set<HTMLImageElement>,
  coveredImgs: Set<HTMLImageElement>,
) => {
  for (const innerImg of slot.querySelectorAll('img'))
    if (rawImgSet.has(innerImg)) coveredImgs.add(innerImg);
};

/** 从所有合格图片中找出所有图片槽位组 */
export const findImageSlotGroups = (
  map: Map<HTMLImageElement, ImageInfo>,
): ImageSlotGroup[] => {
  const rawImgs = [...map.keys()];
  const rawImgSet = new Set(rawImgs);
  const coveredImgSet = new Set<HTMLImageElement>();
  const groups: ImageSlotGroup[] = [];

  for (const img of rawImgs) {
    if (coveredImgSet.has(img)) continue;

    const slots = findSimilarImageSlots(img, IMAGE_SLOT_THRESHOLD);
    if (slots.length === 0) continue;

    const parent = slots[0].parentElement;
    if (!parent) continue;

    let medianAreaCache: number | undefined;
    const group: ImageSlotGroup = {
      parent,
      slots: new Set(slots),
      coveredImgs: new Set(),
      get imgNum() {
        return this.coveredImgs.size;
      },
      get medianArea() {
        medianAreaCache ??= getGroupMedianArea(group, map);
        return medianAreaCache;
      },
    };
    for (const slot of slots) {
      if (isImageElement(slot)) {
        if (rawImgSet.has(slot)) group.coveredImgs.add(slot);
      } else {
        addSlotImgs(slot, rawImgSet, group.coveredImgs);
      }
    }
    for (const coveredImg of group.coveredImgs) coveredImgSet.add(coveredImg);
    groups.push(group);
  }

  return groups;
};

/** 从多个图片槽位组中选择最可能属于正文的一组 */
export const pickBestGroup = (groups: ImageSlotGroup[]): ImageSlotGroup =>
  groups.reduce((best, current) => {
    // 优先选择覆盖图片数量更多的组
    if (current.imgNum !== best.imgNum)
      return current.imgNum > best.imgNum ? current : best;

    // 数量相同时，选择组内图片显示面积中位数更大的组
    return current.medianArea > best.medianArea ? current : best;
  });

export type ImageSlotGroupResult = {
  /** 找到的所有图片槽位组 */
  groups: ImageSlotGroup[];
  /** 当前最可能属于正文的图片槽位组；没有任何组时为 undefined */
  bestGroup?: ImageSlotGroup;
};

/** 计算所有图片槽位组，并同时返回当前最优组 */
export const getImageSlotGroupResult = (
  map: Map<HTMLImageElement, ImageInfo>,
): ImageSlotGroupResult => {
  const groups = findImageSlotGroups(map);
  return {
    groups,
    bestGroup: groups.length > 0 ? pickBestGroup(groups) : undefined,
  };
};

/** 计算组内图片显示面积的中位数 */
const getGroupMedianArea = (
  group: ImageSlotGroup,
  map: Map<HTMLImageElement, ImageInfo>,
) => {
  const areas = [...group.coveredImgs]
    .map((img) => {
      const info = map.get(img);
      return info ? info.display.width * info.display.height : 0;
    })
    .sort((a, b) => a - b); // oxlint-disable-line unicorn/no-array-sort
  if (areas.length === 0) return 0;
  const mid = Math.floor(areas.length / 2);
  return areas.length % 2 === 1
    ? areas[mid]
    : (areas[mid - 1] + areas[mid]) / 2;
};

/** 将图片槽位组展开为展示用槽位列表 */
export const buildSlotElementsFromGroup = (
  group: ImageSlotGroup,
): HTMLElement[] => {
  const slotElements: HTMLElement[] = [];
  const slotImgsMap = new Map<HTMLElement, HTMLImageElement[]>();

  for (const img of group.coveredImgs) {
    let node: HTMLElement | null = img.parentElement;
    while (node && node !== group.parent && node.parentElement !== group.parent)
      node = node.parentElement;
    if (!node || node === group.parent) continue;

    const imgs = slotImgsMap.get(node) ?? [];
    imgs.push(img);
    slotImgsMap.set(node, imgs);
  }

  for (const slot of group.slots) {
    if (isImageElement(slot)) {
      if (group.coveredImgs.has(slot)) slotElements.push(slot);
      continue;
    }

    const imgs = slotImgsMap.get(slot);
    if (imgs && imgs.length > 0) slotElements.push(...imgs);
    else slotElements.push(slot);
  }
  return slotElements;
};
