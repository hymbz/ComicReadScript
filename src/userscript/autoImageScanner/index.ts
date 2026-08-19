import {
  getMostItem,
  isImageElement,
  plimit,
  querySelectorAll,
  t,
  throttle,
  wait,
} from 'helper';
import { type Promisable } from 'type-fest';

import { type ChapterSwitch, getChapterSwitch } from './chapterSwitch';
import { getEleSelector, isEleSelector } from './eleSelector';
import {
  BlobUrlResolver,
  PlaceholderImgList,
  findSimilarSiblingElements,
  sortElementsByDomOrder,
  sortElementsByTop,
} from './helper';
import { type ImageInfo, ImageWatcher } from './ImageWatcher';
import {
  getDatasetUrl,
  imgMap,
  isLazyLoaded,
  needTrigged,
  triggerLazyLoad,
} from './triggerLazyLoad';

const SELECTOR_FALLBACK_TIMEOUT = 3000;

const IMG_BLACK_LIST_SELECTOR = [
  // 东方永夜机的预加载图片
  '#pagetual-preload',
  // 177picyy 上会在图片下加一个 noscript，本来只是图片元素的 html 代码
  // 但经过东方永夜机加载后就会变成真的图片元素，导致重复
  'noscript',
].join(',');

/** 自动发现网页上的所有漫画图片的通用扫描器 */
export class AutoImageScanner {
  /** 能获取到所有图片的 selector */
  private readonly initSelector?: string;
  /** 是否要按图片在页面中的垂直位置排序，否则将按文档顺序排序 */
  private readonly enableSortImageByTop: boolean;

  /** 自定义图片过滤规则 */
  private readonly filterImg?: (
    info: ImageInfo,
    img: HTMLImageElement,
  ) => boolean;
  /** 是否触发懒加载的条件 */
  private readonly shouldTriggerLazyLoad?: () => boolean;

  /** 图片列表变化时的回调 */
  private readonly onImgListChange?: (imgList: string[]) => void;
  /** 章节切换按钮变化时的回调 */
  private readonly onChapterSwitchChange?: (
    sw: ChapterSwitch,
  ) => Promisable<void>;
  /** 页面上没有符合条件的图片时的回调 */
  private readonly onEmpty?: () => void;
  /** 发现新的正确的能获取到所有图片的 selector 时的回调 */
  private readonly onSelectorSuggest?: (selector: string) => void;

  /** 是否已开始监听 */
  private started = false;
  /** 当前生效的图片 selector */
  private imgSelector: string;
  /** 显式 selector 回退定时器 */
  private selectorFallbackTimer: number | undefined;
  /** 懒加载触发 promise，用于避免重复触发 */
  private triggerPromise: Promise<void> | undefined;
  /** 代际标记，用于忽略 stop 后过期的 handleChanged 回调 */
  private generation = 0;

  /** 处理 URL.createObjectURL 后马上 URL.revokeObjectURL 的图片 */
  private readonly blobUrlResolver = new BlobUrlResolver();

  private readonly placeholderImgList = new PlaceholderImgList();
  /** 检测重复的加载占位图，用真实地址进行替换 */
  private readonly updatePlaceholderImgList = throttle((imgList: string[]) => {
    this.placeholderImgList.update(imgList);
  });

  /** 图片监听器 */
  private readonly imageWatcher: ImageWatcher;

  /** 找到的所有符合条件的图片元素 */
  imgEleList: HTMLImageElement[] = [];
  /** 找到的占位兄弟元素，用于提前占位 */
  private similarElements: HTMLElement[] = [];
  /** 找到的所有符合条件的图片 url */
  imgList: string[] = [];
  /** 当前识别到的章节切换按钮 */
  chapterSwitch: ChapterSwitch = {};

  /**
   * @param options 扫描器配置
   */
  constructor(options: {
    selector?: AutoImageScanner['initSelector'];
    filterImg?: AutoImageScanner['filterImg'];
    onImgListChange?: AutoImageScanner['onImgListChange'];
    onEmpty?: AutoImageScanner['onEmpty'];
    onChapterSwitchChange?: AutoImageScanner['onChapterSwitchChange'];
    onSelectorSuggest?: AutoImageScanner['onSelectorSuggest'];
    shouldTriggerLazyLoad?: AutoImageScanner['shouldTriggerLazyLoad'];
    sortImageByTop?: AutoImageScanner['enableSortImageByTop'];
  }) {
    this.initSelector = options.selector;
    this.filterImg = options.filterImg;
    this.onImgListChange = options.onImgListChange;
    this.onEmpty = options.onEmpty;
    this.onChapterSwitchChange = options.onChapterSwitchChange;
    this.onSelectorSuggest = options.onSelectorSuggest;
    this.shouldTriggerLazyLoad = options.shouldTriggerLazyLoad;
    this.imgSelector = options.selector ?? '';
    this.enableSortImageByTop = options.sortImageByTop ?? false;

    this.imageWatcher = new ImageWatcher({
      filterImg: (info, img) => this.filterImage(info, img),
      onChanged: (map) => this.handleChanged(map, this.generation),
    });
  }

  /** 开始寻找页面图片 */
  start() {
    if (this.started) return;
    this.started = true;
    this.imageWatcher.start();

    // options.initSelector 有值，但又找不到图片，说明网站结构发生变化
    // 需要当 initSelector 不存在，重新对网页上的所有图片进行扫描
    if (this.initSelector && this.imgSelector === this.initSelector) {
      this.selectorFallbackTimer = window.setTimeout(() => {
        if (querySelectorAll(this.imgSelector).length > 0) return;
        this.imgSelector = '';
        void this.triggerAllLazyLoad();
      }, SELECTOR_FALLBACK_TIMEOUT);
    }
  }

  /** 停止监听并清理资源 */
  stop() {
    this.started = false;
    this.generation++;
    this.handleChanged.clear();
    this.imageWatcher.stop();
    if (this.selectorFallbackTimer !== undefined)
      window.clearTimeout(this.selectorFallbackTimer);
    this.selectorFallbackTimer = undefined;
    this.triggerPromise = undefined;
    this.blobUrlResolver.clear();
    this.placeholderImgList.clear();
    this.imgEleList = [];
    this.similarElements = [];
    this.imgList = [];
    this.chapterSwitch = {};
  }

  /** 等到发现首张图片 */
  async waitFirstImage(timeout = 10 * 1000) {
    const list = await wait(
      () => (this.imgList.some(Boolean) ? [...this.imgList] : undefined),
      timeout,
    );
    if (!list?.length) throw new Error(t('site.changed_load_failed'));
    return list;
  }

  /** 手动触发一轮懒加载 */
  triggerLazyLoad() {
    this.start();
    return this.triggerAllLazyLoad();
  }

  /** 获取页面上所有不在黑名单中的图片元素 */
  private readonly getAllImg = () =>
    querySelectorAll<HTMLImageElement>(
      `:not(${IMG_BLACK_LIST_SELECTOR}) > img`,
    );

  /** 获取大概率是漫画图片的图片元素 */
  private readonly getExpectImgList = () =>
    this.imgSelector
      ? querySelectorAll<HTMLImageElement>(this.imgSelector).filter(
          (e) =>
            isLazyLoaded(e, imgMap.get(e)?.oldSrc) ||
            !imgMap.has(e) ||
            imgMap.get(e)!.triggedNum <= 5,
        )
      : [];

  /** 判断当前是否应该触发懒加载 */
  private readonly runCondition = () => this.shouldTriggerLazyLoad?.() ?? true;

  /** 触发大概率是漫画图片的懒加载 */
  private readonly triggerExpectImg = (num?: number, time?: number) =>
    wait(async () => {
      let expectImgList = this.getExpectImgList().filter(needTrigged);
      if (num) expectImgList = expectImgList.slice(0, num);
      await triggerLazyLoad(expectImgList, this.runCondition);
      return expectImgList.every((e) => !needTrigged(e));
    }, time);

  /** 触发一轮完整的懒加载，并对重复调用去重 */
  private readonly triggerAllLazyLoad = () => {
    if (this.triggerPromise) return this.triggerPromise;

    this.triggerPromise = (async () => {
      try {
        // 优先触发大概率是漫画图片的懒加载
        if (this.imgSelector) {
          await this.triggerExpectImg(3, 1000 * 5);
          await this.triggerExpectImg();
        }
        await triggerLazyLoad(
          this.getAllImg().filter(needTrigged),
          this.runCondition,
        );

        // 针对不使用 img 来触发懒加载的网站，要找到图片容器元素再尝试触发懒加载
        // https://www.twmanga.com/comic/chapter/sanjiaoguanxirumen-founai/0_0.html
        // https://klz9.com/love-live-flowers-hasunosora-jogakuin-school-idol-club-chapter-1.html
        if (this.imgEleList.length > 3) {
          const similarElements = findSimilarSiblingElements(
            this.imgEleList[0],
            5,
          ).filter(needTrigged);
          if (similarElements.length > 0) {
            this.similarElements = similarElements;
            await triggerLazyLoad(similarElements, this.runCondition);
          }
        }
      } finally {
        this.triggerPromise = undefined;
      }
    })();

    return this.triggerPromise;
  };

  /** 记录传入的图片元素中最常见的那个 selector（仅 initSelector 失效时） */
  private readonly saveImgEleSelector = (list: HTMLElement[]) => {
    // initSelector 仍生效时跳过
    if (
      list.length < 7 ||
      (this.initSelector && this.imgSelector === this.initSelector)
    )
      return;

    const newSelector = getMostItem(list.map(getEleSelector));
    if (newSelector !== this.imgSelector) {
      this.imgSelector = newSelector;
      this.onSelectorSuggest?.(newSelector);
    }
  };

  /** 判断图片是否符合扫描条件 */
  private readonly filterImage = (info: ImageInfo, img: HTMLImageElement) => {
    // 排除黑名单里的
    if (img.closest(IMG_BLACK_LIST_SELECTOR)) return false;
    // 记录在案的直接通过
    if (this.imgSelector && isEleSelector(img, this.imgSelector)) return true;
    // 定义了过滤规则的按定义的来
    if (this.filterImg) return this.filterImg(info, img);
    // 排除显示尺寸小的
    if (info.display.height <= 100 || info.display.width <= 100) return false;
    // 原图尺寸必须足够大
    return info.natural.height > 500 && info.natural.width > 500;
  };

  /** 图片集合变化时更新图片列表、章节按钮并触发懒加载 */
  private readonly handleChanged = throttle(
    async (map: Map<HTMLImageElement, ImageInfo>, generation: number) => {
      if (generation !== this.generation) return;

      if (map.size === 0) return this.onEmpty?.();

      // 过滤掉已从 DOM 移除或触发次数过多的占位元素
      this.similarElements = this.similarElements.filter(
        (e) => e.isConnected && needTrigged(e),
      );

      const slotElements = this.enableSortImageByTop
        ? sortElementsByTop([...map.keys(), ...this.similarElements])
        : sortElementsByDomOrder([...map.keys(), ...this.similarElements]);
      this.imgEleList = slotElements.filter(isImageElement);

      if (slotElements.length === 0) return this.onEmpty?.();

      // 随着图片的增加，需要补上空缺位置，避免变成稀疏数组
      if (this.imgList.length < slotElements.length)
        this.imgList = [
          ...this.imgList,
          ...Array.from(
            { length: slotElements.length - this.imgList.length },
            () => '',
          ),
        ];
      // colamanga 会创建随机个数的假 img 元素，导致刚开始时高估页数，需要删掉多余的页数
      else if (this.imgList.length > slotElements.length)
        this.imgList = this.imgList.slice(0, slotElements.length);

      this.onImgListChange?.([...this.imgList]);
      this.updatePlaceholderImgList(this.imgList);

      let isEdited = false;
      await plimit(
        slotElements.map((e, i) => async () => {
          // 占位元素保持空字符串，等待懒加载成功后再替换
          if (!isImageElement(e)) {
            if (this.imgList[i] === '') return;
            isEdited ||= true;
            this.imgList[i] = '';
            return;
          }

          let newUrl = await this.blobUrlResolver.resolve(e);
          if (this.placeholderImgList.has(newUrl))
            newUrl = getDatasetUrl(e) ?? '';
          if (newUrl === this.imgList[i]) return;

          isEdited ||= true;
          this.imgList[i] = newUrl;
        }),
      );
      if (generation !== this.generation) return;
      if (isEdited) this.saveImgEleSelector(this.imgEleList);

      void this.triggerAllLazyLoad();
      this.chapterSwitch = getChapterSwitch();
      await this.onChapterSwitchChange?.({ ...this.chapterSwitch });
      if (generation !== this.generation) return;
      if (isEdited) {
        this.onImgListChange?.([...this.imgList]);
        this.updatePlaceholderImgList(this.imgList);
      }
    },
    500,
  );
}
