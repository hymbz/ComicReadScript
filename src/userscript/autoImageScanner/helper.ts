import { canvasToBlob, isEqual, testImgUrl } from 'helper';

/** 按照元素的显示高度来排序元素 */
export const sortElementsByTop = <T extends HTMLElement>(
  elements: Iterable<T>,
): T[] => {
  const list = [...elements];
  const topMap = new WeakMap<T, number>();
  for (const e of list) topMap.set(e, e.getBoundingClientRect().top);
  // oxlint-disable-next-line unicorn/no-array-sort
  return list.sort((a, b) => topMap.get(a)! - topMap.get(b)!);
};

/** 按照文档顺序来排序元素 */
export const sortElementsByDomOrder = <T extends HTMLElement>(
  elements: Iterable<T>,
): T[] =>
  // oxlint-disable-next-line unicorn/no-array-sort
  [...elements].sort((a, b) => {
    const position = a.compareDocumentPosition(b);
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  });

/** 判断两个元素是否相似 */
const isSimilarElement = (a: HTMLElement, b: HTMLElement) =>
  isEqual(a.dataset, b.dataset) || (a.className && a.className === b.className);

const SKIP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'IFRAME',
  'HEAD',
  'TEMPLATE',
]);
/** 判断元素是否为明显不可能是图片容器 */
const isImageHostIneligible = (element: HTMLElement) => {
  // 没有任何子元素
  if (element.children.length === 0) return true;
  // 隐藏在屏幕外或尺寸为 0
  if (element.offsetParent === null) return true;
  // 被黑名单标记
  if (SKIP_TAGS.has(element.tagName)) return true;
  return false;
};

/** 判断元素是否具有足够的尺寸 */
const hasValidSize = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return rect.width >= 100 && rect.height >= 100;
};

/** 从指定元素开始向上冒泡，找到第一个「拥有足够多相似的可能作为图片容器的元素」的集合 */
export const findSimilarSiblingElements = (
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
          sibling === current ||
          !(sibling instanceof HTMLElement) ||
          isImageHostIneligible(sibling) ||
          !isSimilarElement(sibling, current) ||
          !hasValidSize(sibling)
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

/** 处理 URL.createObjectURL 后马上 URL.revokeObjectURL 的图片 */
export class BlobUrlResolver {
  private readonly blobUrlMap = new Map<string, string>();

  async resolve(e: HTMLImageElement): Promise<string> {
    if (this.blobUrlMap.has(e.src)) return this.blobUrlMap.get(e.src)!;
    if (!e.src.startsWith('blob:')) return this.httpToHttps(e.src);
    if (await testImgUrl(e.src)) return e.src;

    const canvas = new OffscreenCanvas(e.naturalWidth, e.naturalHeight);
    const canvasCtx = canvas.getContext('2d')!;
    canvasCtx.drawImage(e, 0, 0);

    const url = URL.createObjectURL(await canvasToBlob(canvas));
    this.blobUrlMap.set(e.src, url);
    return url;
  }

  clear() {
    this.blobUrlMap.clear();
  }

  /** 在 https 页面下将 http 图片地址升级为 https */
  private httpToHttps(url: string) {
    if (url.startsWith('http:') && location.protocol === 'https:')
      return url.replace('http:', 'https:');
    return url;
  }
}

/** 检测重复的加载占位图，用真实地址替换 */
export class PlaceholderImgList {
  /** 已判定为重复占位图的 URL 集合 */
  private readonly set = new Set<string>();

  has(url: string) {
    return this.set.has(url);
  }

  update(imgList: string[]) {
    const countMap = new Map<string, number>();

    for (const url of imgList) {
      if (!url || this.set.has(url)) continue;

      const count = (countMap.get(url) ?? 0) + 1;
      countMap.set(url, count);
      if (count > 5) this.set.add(url);
    }
  }

  clear() {
    this.set.clear();
  }
}
