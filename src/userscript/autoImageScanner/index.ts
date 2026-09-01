import { getMostItem, querySelectorAll, t, throttle, wait } from 'helper';
import { type Promisable } from 'type-fest';

import { type ChapterSwitch, getChapterSwitch } from './chapterSwitch';
import { getEleSelector } from './eleSelector';
import { ImageListBuilder } from './imageListBuilder';
import { type ImageSlotGroup, getImageSlotGroupResult } from './imageSlot';
import { type ImageInfo } from './ImageWatcher';
import { LazyLoadController } from './lazyLoadController';
import { QualifiedImageWatcher } from './qualifiedImageWatcher';

const SELECTOR_FALLBACK_TIMEOUT = 3000;

/** 自动发现网页上的所有漫画图片的通用扫描器 */
export class AutoImageScanner {
  /** 能获取到所有图片的 selector */
  private readonly initSelector?: string;
  /** 是否要按图片在页面中的垂直位置排序，否则将按文档顺序排序 */
  private readonly enableSortImageByTop: boolean;
  /** 是否只保留图片槽位组内的图片 */
  private readonly filterByContainer: boolean;

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
  /** 代际标记，用于忽略 stop 后过期的 handleChanged 回调 */
  private generation = 0;

  private readonly imageWatcher: QualifiedImageWatcher;
  private readonly imageListBuilder: ImageListBuilder;
  private readonly lazyLoadController: LazyLoadController;

  /** 所有「相似、成组」的图片槽位组 */
  private imageSlotGroups: ImageSlotGroup[] = [];
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
    filterByContainer?: AutoImageScanner['filterByContainer'];
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
    this.filterByContainer = options.filterByContainer ?? true;

    this.imageWatcher = new QualifiedImageWatcher({
      getImgSelector: () => this.imgSelector,
      filterImg: this.filterImg,
      onChanged: (map) => this.handleChanged(map, this.generation),
    });

    this.imageListBuilder = new ImageListBuilder({
      enableSortImageByTop: this.enableSortImageByTop,
      filterByContainer: this.filterByContainer,
      onImgListChange: (imgList) => this.onImgListChange?.(imgList),
      onEmpty: () => this.onEmpty?.(),
    });

    this.lazyLoadController = new LazyLoadController({
      getImgSelector: () => this.imgSelector,
      getImageSlotGroups: () => this.imageSlotGroups,
      getAllImg: () => this.imageWatcher.getAllImg(),
      runCondition: () => this.shouldTriggerLazyLoad?.() ?? true,
      onLazyLoadFailed: () => this.imageListBuilder.onLazyLoadFailed(),
    });
  }

  /** 最终选中的图片 url */
  get imgList() {
    return this.imageListBuilder.imgList;
  }

  /** 最终选中的图片槽位 */
  get slotElements() {
    return this.imageListBuilder.slotElements;
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
        void this.lazyLoadController.trigger();
      }, SELECTOR_FALLBACK_TIMEOUT);
    }
  }

  /** 停止监听并清理资源 */
  stop() {
    this.started = false;
    this.generation++;
    this.handleChanged.clear();
    this.imageWatcher.stop();
    this.imageListBuilder.clear();
    if (this.selectorFallbackTimer !== undefined)
      window.clearTimeout(this.selectorFallbackTimer);
    this.selectorFallbackTimer = undefined;
    this.lazyLoadController.clear();
    this.imageSlotGroups = [];
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
    return this.lazyLoadController.trigger();
  }

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

  /** 图片集合变化时更新图片列表、章节按钮并触发懒加载 */
  private readonly handleChanged = throttle(
    async (map: Map<HTMLImageElement, ImageInfo>, generation: number) => {
      if (generation !== this.generation) return;

      if (map.size === 0) {
        this.imageSlotGroups = [];
        this.imageListBuilder.clearListState();
        return this.onEmpty?.();
      }

      const { groups, bestGroup } = getImageSlotGroupResult(map);
      this.imageSlotGroups = groups;

      const imgEleList = [...map.keys()];
      const { isEdited, isEmpty } = await this.imageListBuilder.update(
        map,
        bestGroup,
        generation,
      );
      if (generation !== this.generation) return;
      if (isEmpty) return;

      if (isEdited) this.saveImgEleSelector(imgEleList);

      void this.lazyLoadController.trigger();
      this.chapterSwitch = getChapterSwitch();
      await this.onChapterSwitchChange?.({ ...this.chapterSwitch });
      if (generation !== this.generation) return;
      this.imageListBuilder.notifyFinalImgListChange(isEdited);
    },
    500,
  );
}
