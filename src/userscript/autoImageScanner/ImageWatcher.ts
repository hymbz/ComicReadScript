import { ReactiveMap, isHTMLElement, isImageElement } from 'helper';

export type ImageInfo = {
  display: { width: number; height: number };
  natural: { width: number; height: number };
};

export type ImageWatcherOptions = {
  /**
   * 判断图片是否符合条件的过滤器
   * @param img 图片元素
   * @param display 显示尺寸
   * @param natural 原始尺寸
   */
  filterImg: (info: ImageInfo, img: HTMLImageElement) => boolean;

  /** 当符合条件的图片集合发生变化时触发的回调 */
  onChanged: (map: Map<HTMLImageElement, ImageInfo>) => void;
};

/** 遍历节点及其子树中的所有图片元素 */
const forEachImage = (
  nodes: NodeList,
  callback: (img: HTMLImageElement) => void,
): void => {
  for (const node of nodes) {
    if (isImageElement(node)) callback(node);
    else if (isHTMLElement(node))
      for (const img of node.querySelectorAll('img')) callback(img);
  }
};

/** 监听网页上的所有图片元素的变化，筛选出符合条件的图片 */
export class ImageWatcher {
  private readonly options: ImageWatcherOptions;

  private readonly ro: ResizeObserver;

  private readonly mo: MutationObserver;

  // 记录已经符合条件的图片元素及其尺寸信息
  // 如果图片的 src 发生改变，会将其从这里移除，重新进行检查
  private readonly qualifiedMap = new ReactiveMap<
    HTMLImageElement,
    ImageInfo
  >();

  // 需要监听的属性列表
  private readonly targetAttributes = [
    'src',
    'srcset',
    'data-src',
    'data-original',
    'data-srcset',
  ];

  constructor(options: ImageWatcherOptions) {
    this.options = options;
    this.ro = new ResizeObserver(this.handleResize);
    this.mo = new MutationObserver(this.handleMutation);
  }

  public start(): void {
    // 监视页面当前所有图片，确保脚本加载前已经存在的图片也被处理
    let changed = false;
    for (const e of document.querySelectorAll('img')) {
      this.observeImage(e);
      if (this.tryQualify(e)) changed = true;
    }
    if (changed) this.options.onChanged(this.qualifiedMap);

    this.mo.observe(document.body, {
      childList: true, // 监听节点增删
      subtree: true, // 监听所有子孙节点
      attributes: true, // 监听属性变化
      attributeFilter: this.targetAttributes, // 只监听特定的图片相关属性
    });
  }

  /** 停止监听并清理资源 */
  public stop(): void {
    this.mo.disconnect();
    this.ro.disconnect();
    this.qualifiedMap.clear();
  }

  /** 使用 ResizeObserver 监测图片尺寸变化，并在图片加载完成后重新检查 */
  private readonly observeImage = (img: HTMLImageElement) => {
    this.ro.observe(img);

    if (img.complete) return;

    img.addEventListener(
      'load',
      () => {
        if (this.tryQualify(img)) this.options.onChanged(this.qualifiedMap);
      },
      { once: true },
    );
  };

  /** 构造图片尺寸信息 */
  private createImageInfo(
    img: HTMLImageElement,
    display: { width: number; height: number },
  ): ImageInfo {
    return {
      display,
      natural: { width: img.naturalWidth, height: img.naturalHeight },
    };
  }

  /** 尝试将图片加入 qualifiedMap，成功返回 true */
  private tryQualify(
    img: HTMLImageElement,
    display?: { width: number; height: number },
  ): boolean {
    if (this.qualifiedMap.has(img)) return false;

    const rect = display ?? img.getBoundingClientRect();
    const imageInfo = this.createImageInfo(img, rect);

    if (!this.options.filterImg(imageInfo, img)) return false;

    this.qualifiedMap.set(img, imageInfo);
    this.ro.unobserve(img);
    return true;
  }

  /** 处理 ResizeObserver 的回调，只有在图片尺寸发生实际变化（或初始化）时才会触发 */
  private readonly handleResize = (entries: ResizeObserverEntry[]): void => {
    let changed = false;

    for (const entry of entries) {
      const img = entry.target as HTMLImageElement;

      if (
        this.tryQualify(img, {
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      )
        changed = true;
    }

    if (changed) this.options.onChanged(this.qualifiedMap);
  };

  /** 将图片从 qualifiedMap 移除，返回是否真的移除了 */
  private readonly deleteImg = (img: HTMLImageElement) => {
    if (!this.qualifiedMap.has(img)) return false;
    this.qualifiedMap.delete(img);
    return true;
  };

  /** 处理新增节点中的图片 */
  private handleAddedNodes(nodes: NodeList): boolean {
    let changed = false;
    forEachImage(nodes, (img) => {
      this.observeImage(img);
      if (this.tryQualify(img)) changed = true;
    });
    return changed;
  }

  /** 处理移除节点中的图片 */
  private handleRemovedNodes(nodes: NodeList): boolean {
    let changed = false;
    forEachImage(nodes, (img) => {
      if (this.deleteImg(img)) changed = true;
    });
    return changed;
  }

  /** 处理图片属性变化 */
  private handleAttributeMutation(node: Node): boolean {
    if (!isImageElement(node)) return false;

    // 图片的 src 变了以后，要将其视为一张新图来看待
    if (this.tryQualify(node)) return true;

    let changed = false;
    if (this.deleteImg(node)) changed = true;
    this.observeImage(node);
    return changed;
  }

  /** 处理监听节点的增删改 */
  private readonly handleMutation = (mutations: MutationRecord[]): void => {
    let changed = false;

    for (const mutation of mutations) {
      switch (mutation.type) {
        case 'childList': {
          changed = this.handleAddedNodes(mutation.addedNodes) || changed;
          changed = this.handleRemovedNodes(mutation.removedNodes) || changed;
          break;
        }

        case 'attributes': {
          changed = this.handleAttributeMutation(mutation.target) || changed;
          break;
        }
      }
    }

    if (changed) this.options.onChanged(this.qualifiedMap);
  };
}
