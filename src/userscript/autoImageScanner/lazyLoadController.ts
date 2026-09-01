import { isImageElement, querySelectorAll } from 'helper';

import { type ImageSlotGroup } from './imageSlot';
import {
  lazyLoadTrigger,
  needTrigger,
  triggerLazyLoad,
} from './triggerLazyLoad';

export class LazyLoadController {
  private readonly getImgSelector: () => string;
  private readonly getImageSlotGroups: () => ImageSlotGroup[];
  private readonly getAllImg: () => HTMLImageElement[];
  private readonly runCondition: () => boolean;
  private readonly onLazyLoadFailed?: () => void;

  /** 懒加载触发 promise，用于避免重复触发 */
  private triggerPromise: Promise<void> | undefined;

  constructor(options: {
    /** 获取当前生效的图片 selector */
    getImgSelector: () => string;
    /** 获取所有图片槽位组 */
    getImageSlotGroups: () => ImageSlotGroup[];
    /** 获取页面上所有不在黑名单中的图片元素 */
    getAllImg: () => HTMLImageElement[];
    /** 判断当前是否允许触发懒加载 */
    runCondition: () => boolean;
    /** 懒加载失败后的回调 */
    onLazyLoadFailed?: () => void;
  }) {
    this.getImgSelector = options.getImgSelector;
    this.getImageSlotGroups = options.getImageSlotGroups;
    this.getAllImg = options.getAllImg;
    this.runCondition = options.runCondition;
    this.onLazyLoadFailed = options.onLazyLoadFailed;

    // 同一时间只会有一个 AutoImageScanner 在工作，因此将回调直接注册到全局单例
    lazyLoadTrigger.onFailed = () => this.onLazyLoadFailed?.();
    lazyLoadTrigger.runCondition = this.runCondition;
  }

  /** 手动触发一轮完整的懒加载 */
  trigger() {
    if (this.triggerPromise) return this.triggerPromise;

    this.triggerPromise = (async () => {
      try {
        // 优先触发大概率是漫画图片的懒加载
        const imgSelector = this.getImgSelector();
        if (imgSelector) {
          await this.triggerExpectImg(3);
          await this.triggerExpectImg();
        }
        await this.triggerAllRemainingLazyLoad();
      } finally {
        this.triggerPromise = undefined;
      }
    })();

    return this.triggerPromise;
  }

  /** 停止时清理触发状态 */
  clear() {
    this.triggerPromise = undefined;
  }

  /** 触发大概率是漫画图片且还未成功触发懒加载的元素的懒加载 */
  private readonly triggerExpectImg = async (num?: number) => {
    const selector = this.getImgSelector();
    if (!selector) return;
    let expectImgList =
      querySelectorAll<HTMLImageElement>(selector).filter(needTrigger);
    if (num) expectImgList = expectImgList.slice(0, num);
    await triggerLazyLoad(expectImgList);
  };

  /** 触发所有未收敛的 img 和图片容器 */
  private readonly triggerAllRemainingLazyLoad = async () => {
    // 针对不使用 img 来触发懒加载的网站，也要触发图片容器元素
    // https://www.twmanga.com/comic/chapter/sanjiaoguanxirumen-founai/0_0.html
    // https://klz9.com/love-live-flowers-hasunosora-jogakuin-school-idol-club-chapter-1.html
    if (!this.runCondition()) return;
    const imgTargets = this.getAllImg().filter(needTrigger);
    if (imgTargets.length > 0) await triggerLazyLoad(imgTargets);

    const groupTargets: HTMLElement[] = [];
    for (const group of this.getImageSlotGroups())
      for (const slot of group.slots)
        if (!isImageElement(slot) && needTrigger(slot)) groupTargets.push(slot);
    if (groupTargets.length > 0) await triggerLazyLoad(groupTargets);
  };
}
