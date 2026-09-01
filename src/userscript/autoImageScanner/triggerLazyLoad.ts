import {
  createScheduled,
  exposeToGlobal,
  isImageElement,
  singleThreaded,
  sleep,
  throttle,
  wait,
} from 'helper';

import { DwellWatcher } from './dwellWatcher';

/** 新元素短停留时间 */
const SHORT_STAY_TIME = 310;
/** 旧元素长停留时间 */
const LONG_STAY_TIME = 1010;
/** 旧元素超过该时间后，即使有新元素也会优先进行长停留 */
const OLD_TIMEOUT = 5000;
/** 每轮之间的间隔 */
const ROUND_INTERVAL = 100;

/** 触发网页底部翻页的停留时间 */
const TURN_PAGE_WAIT_TIME = 600;
// https://www.ykmh.net/manhua/jiangfangyanshuobuhuishudegaoyanzhinvhaiquanlizhengfudebaihegushi/280311.html
// 触发网页底部翻页的停留时间必须大于 500ms

/** 触发网页底部翻页的节流时间 */
const TURN_PAGE_THROTTLE_TIME = 1000;

/** 用于判断是否是图片 url 的正则 */
const isImgUrlRe =
  /^(?:(?:(?:https?|ftp|file):)?\/)?\/[-\w+&@#/%?=~|!:,.;]+[-\w+&@#%=~|]$/u;

/** 找出格式为图片 url 的元素属性 */
export const getDatasetUrl = (e: Element) => {
  for (const key of e.getAttributeNames()) {
    // 跳过白名单
    switch (key) {
      case 'src':
      case 'alt':
      case 'class':
      case 'style':
      case 'id':
      case 'title':
      case 'onload':
      case 'onerror':
        continue;
    }

    const val = e.getAttribute(key)!.trim();
    if (!isImgUrlRe.test(val)) continue;
    return val;
  }
};

/** 判断一个元素是否已经成功触发完懒加载 */
export const isLazyLoaded = (e: HTMLElement, oldSrc?: string) => {
  // 不在页面上或不可见的元素不可能是图片槽位，视为无需再触发懒加载
  if (!e.isConnected || !e.checkVisibility()) return true;
  if (isImageElement(e)) {
    if (!e.src) return false;
    if (!e.offsetParent) return false;
    // 有些网站会使用 svg 占位
    if (e.src.startsWith('data:image/svg')) return false;
    if (e.naturalWidth > 500 || e.naturalHeight > 500) return true;
    if (oldSrc !== undefined && e.src !== oldSrc) return true;
  } else {
    const imgDomList = e.querySelectorAll('img');
    for (const imgDom of imgDomList)
      if (isLazyLoaded(imgDom, oldSrc)) return true;
  }
  return false;
};

class LazyLoadManager {
  /** 懒加载失败回调 */
  onFailed?: (e: HTMLElement) => void;
  /** 当前是否允许触发懒加载 */
  runCondition: () => boolean = () => true;

  /** 记录元素的初始 src */
  private readonly oldSrcMap = new WeakMap<HTMLElement, string>();
  /** 未完成短停留的新元素 */
  private readonly newSet = new Set<HTMLElement>();
  /** 已完成短停留但未完成长停留的旧元素，value 为短停留完成时间 */
  private readonly oldMap = new Map<HTMLElement, number>();
  /** 长停留后仍未成功触发懒加载，判定为非图片槽位的元素 */
  private readonly failedSet = new WeakSet<HTMLElement>();

  private readonly dwellWatcher = new DwellWatcher();

  /** 触发网页底部翻页的节流 */
  private readonly turnPageScheduled = createScheduled((fn) =>
    throttle(fn, TURN_PAGE_THROTTLE_TIME),
  );

  readonly trigger = singleThreaded(async (_state, targets: HTMLElement[]) => {
    this.addTargets(targets);
    await this.runRounds();
  });

  /** 判断图片元素是否需要触发懒加载 */
  needTrigger(e: HTMLElement) {
    return !isLazyLoaded(e, this.oldSrcMap.get(e)) && !this.failedSet.has(e);
  }

  /** 判断元素是否已经被判定为不可能是图片槽位 */
  isLazyLoadFailed(e: HTMLElement) {
    return this.failedSet.has(e);
  }

  /** 将目标元素加入待触发集合 */
  private addTargets(targets: HTMLElement[]) {
    for (const e of targets) {
      if (this.failedSet.has(e) || !e.isConnected || !e.checkVisibility())
        continue;
      if (isImageElement(e) && !this.oldSrcMap.has(e))
        this.oldSrcMap.set(e, e.src);

      const oldSrc = this.oldSrcMap.get(e);
      const datasetUrl = getDatasetUrl(e);
      if (datasetUrl) e.setAttribute('src', datasetUrl);
      if (isLazyLoaded(e, oldSrc)) continue;
      if (this.oldMap.has(e) || this.newSet.has(e)) continue;

      this.newSet.add(e);
      this.dwellWatcher.watch(e, SHORT_STAY_TIME, () =>
        this.handleShortCompleted(e),
      );
    }
  }

  /** 短停留完成的回调 */
  private readonly handleShortCompleted = (e: HTMLElement) => {
    if (!this.newSet.delete(e)) return;
    if (isLazyLoaded(e, this.oldSrcMap.get(e))) return;

    this.oldMap.set(e, Date.now());
    this.dwellWatcher.watch(e, LONG_STAY_TIME, () =>
      this.handleLongCompleted(e),
    );
  };

  /** 长停留完成的回调 */
  private readonly handleLongCompleted = (e: HTMLElement) => {
    if (!this.oldMap.delete(e)) return;
    if (isLazyLoaded(e, this.oldSrcMap.get(e))) return;

    this.failedSet.add(e);
    this.onFailed?.(e);
  };

  /** 移除元素并取消观察 */
  private removeElement(e: HTMLElement) {
    this.dwellWatcher.unwatch(e);
    this.newSet.delete(e);
    this.oldMap.delete(e);
  }

  /** 清理已不在页面上或已经完成懒加载的元素 */
  private prune() {
    for (const e of this.newSet) {
      const loaded = isLazyLoaded(e, this.oldSrcMap.get(e));
      if (loaded) this.removeElement(e);
    }
    for (const e of this.oldMap.keys()) {
      const loaded = isLazyLoaded(e, this.oldSrcMap.get(e));
      if (loaded) this.removeElement(e);
    }
  }

  /** 获取超过超时时间的旧元素 */
  private getDueOld() {
    const now = Date.now();
    return [...this.oldMap.entries()]
      .filter(([, shortCompletedAt]) => now - shortCompletedAt >= OLD_TIMEOUT)
      .map(([e]) => e);
  }

  /** 按 DOM 顺序排序 */
  private sortByDomOrder(list: HTMLElement[]) {
    return list.toSorted((a, b) => {
      if (a === b) return 0;
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1;
    });
  }

  /** 扫描所有新元素，让它们完成短停留 */
  private async sweepNew() {
    this.prune();
    const targets = this.sortByDomOrder([...this.newSet]);
    for (const e of targets) {
      if (!this.newSet.has(e)) continue;
      this.scrollToElement(e);
      await this.waitForBatch(
        (target) => this.newSet.has(target),
        SHORT_STAY_TIME,
      );
    }
  }

  /** 扫描指定旧元素，让它们完成长停留 */
  private async sweepOld(targets: HTMLElement[]) {
    this.prune();
    const sorted = this.sortByDomOrder(targets);
    for (const e of sorted) {
      if (!this.oldMap.has(e)) continue;
      this.scrollToElement(e);
      await this.waitForBatch(
        (target) => this.oldMap.has(target),
        LONG_STAY_TIME,
      );
    }
  }

  /**
   * 等待当前视口内所有待处理元素完成对应停留。
   *
   * 如果待处理元素已离开视口或已从对应集合中移除，则提前结束等待。
   */
  private async waitForBatch(
    isPending: (e: HTMLElement) => boolean,
    duration: number,
  ) {
    // 给 dwellWatcher 一点时间上报滚动后的初始可见状态
    await sleep(20);
    await wait(
      () =>
        [...this.dwellWatcher.visibleElements].some(isPending)
          ? undefined
          : true,
      duration,
      50,
    );
  }

  /** 滚动到元素顶部并派发 scroll 事件，触发网站懒加载 */
  private scrollToElement(e: HTMLElement) {
    e.scrollIntoView({ behavior: 'instant', block: 'start' });
    e.dispatchEvent(new Event('scroll', { bubbles: true }));
  }

  /** 触发网页底部翻页 */
  private readonly triggerTurnPage = async () => {
    if (!this.turnPageScheduled()) return;
    const nowScroll = window.scrollY;
    // 滚到底部再滚回来，触发可能存在的自动翻页脚本
    window.scroll({ top: document.body.scrollHeight, behavior: 'instant' });
    document.body.dispatchEvent(new Event('scroll', { bubbles: true }));
    if (TURN_PAGE_WAIT_TIME) await sleep(TURN_PAGE_WAIT_TIME);
    if (this.runCondition())
      window.scroll({ top: nowScroll, behavior: 'instant' });
  };

  /**
   * 执行完整的懒加载轮次
   *
   * 对每个元素执行短停留（初始快速尝试触发）和长停留（保险起见的二次尝试），
   * 两次停留后都无法触发懒加载的，判定其不是图片槽位
   */
  private async runRounds() {
    const startScroll = window.scrollY;
    try {
      while (true) {
        if (!this.runCondition()) return;
        this.prune();
        if (this.newSet.size === 0 && this.oldMap.size === 0)
          return await this.triggerTurnPage();

        const hadNew = this.newSet.size > 0;
        const startNewSize = this.newSet.size;
        const startOldSize = this.oldMap.size;

        // 新元素优先短停留
        if (this.newSet.size > 0) await this.sweepNew();

        // 超时旧元素长停留
        if (this.oldMap.size > 0) {
          const dueOld = this.getDueOld();
          if (dueOld.length > 0) await this.sweepOld(dueOld);
        }

        // 本轮没有新元素时，才对未超时旧元素进行长停留
        if (!hadNew && this.oldMap.size > 0)
          await this.sweepOld([...this.oldMap.keys()]);

        this.prune();
        const changed =
          this.newSet.size < startNewSize || this.oldMap.size < startOldSize;
        if (this.newSet.size === 0 && this.oldMap.size === 0)
          return await this.triggerTurnPage();
        // 一轮下来没有任何推进时停止，避免对无法进入视口的元素无限重试
        if (!changed) return await this.triggerTurnPage();

        await this.triggerTurnPage();
        await sleep(ROUND_INTERVAL);
      }
    } finally {
      if (this.runCondition())
        window.scroll({ top: startScroll, behavior: 'instant' });
    }
  }
}

export const lazyLoadTrigger = new LazyLoadManager();
exposeToGlobal({ lazyLoadTrigger });

export const triggerLazyLoad = lazyLoadTrigger.trigger;
export const needTrigger = (e: HTMLElement) => lazyLoadTrigger.needTrigger(e);
export const isLazyLoadFailed = (e: HTMLElement) =>
  lazyLoadTrigger.isLazyLoadFailed(e);
