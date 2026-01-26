import { isHTMLElement, isImageElement } from 'helper';

/**
 * 图片尺寸及相关信息
 */
export type ImageInfo = {
  display: { width: number; height: number };
  natural: { width: number; height: number };
};

/**
 * 配置选项接口
 */
export type ImageWatcherOptions = {
  /**
   * 判断图片是否符合条件的过滤器
   * @param img 图片元素
   * @param display 显示尺寸
   * @param natural 原始尺寸
   */
  filter: (info: ImageInfo, img: HTMLImageElement) => boolean;

  /** 当符合条件的图片集合发生变化时触发的回调 */
  onChanged: (map: Map<HTMLImageElement, ImageInfo>) => void;
};

/** 监听网页上的所有图片元素的变化，筛选出符合条件的图片 */
export class ImageWatcher {
  private options: ImageWatcherOptions;

  private ro: ResizeObserver;

  private mo: MutationObserver;

  // 记录已经符合条件的图片元素及其尺寸信息
  // 注意：如果图片的 src 发生改变，我们会将其从这里移除，重新进行检查
  private qualifiedMap = new Map<HTMLImageElement, ImageInfo>();

  // 需要监听的属性列表，涵盖了常见的懒加载属性
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
    for (const e of document.querySelectorAll('img')) this.observeImage(e);

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

  /** 使用 ResizeObserver 监测图片尺寸变化 */
  private observeImage = (img: HTMLImageElement) => this.ro.observe(img);

  /** 处理 ResizeObserver 的回调，只有在图片尺寸发生实际变化（或初始化）时才会触发 */
  private handleResize = (entries: ResizeObserverEntry[]): void => {
    let changed = false;

    for (const entry of entries) {
      const img = entry.target as HTMLImageElement;

      const imageInfo: ImageInfo = {
        display: {
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        },
        natural: { width: img.naturalWidth, height: img.naturalHeight },
      };

      // oxlint-disable-next-line no-array-method-this-argument
      if (this.qualifiedMap.has(img) || !this.options.filter(imageInfo, img))
        continue;

      this.qualifiedMap.set(img, imageInfo);
      changed = true;

      // 符合条件后停止监听尺寸变化
      // 如果之后 src 发生改变，会被 MO 捕获并重新 observe
      this.ro.unobserve(img);
    }

    if (changed) this.options.onChanged(this.qualifiedMap);
  };

  /**
   * 遍历节点及其子树中的所有图片元素
   */
  private forEachImage(
    nodes: NodeList,
    callback: (img: HTMLImageElement) => void,
  ): void {
    for (const node of nodes) {
      if (isImageElement(node)) callback(node);
      else if (isHTMLElement(node))
        for (const img of node.querySelectorAll('img')) callback(img);
    }
  }

  /**
   * 处理 MutationObserver 的回调
   * 负责发现新元素和属性变化
   */
  private handleMutation = (mutations: MutationRecord[]): void => {
    let changed = false;
    const deleteImg = (img: HTMLImageElement) => {
      if (!this.qualifiedMap.has(img)) return;
      this.qualifiedMap.delete(img);
      changed = true;
    };

    for (const mutation of mutations) {
      switch (mutation.type) {
        case 'childList': {
          this.forEachImage(mutation.addedNodes, this.observeImage);
          this.forEachImage(mutation.removedNodes, deleteImg);
          break;
        }

        case 'attributes': {
          const node = mutation.target;
          // 图片的 src 变了以后，要将其视为一张新图来看待
          if (isImageElement(node)) {
            deleteImg(node);
            this.observeImage(node);
          }
          break;
        }
      }
    }

    if (changed) this.options.onChanged(this.qualifiedMap);
  };
}
