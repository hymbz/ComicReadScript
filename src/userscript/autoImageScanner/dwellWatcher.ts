type DwellState = {
  duration: number;
  callback: () => void;
  enterTime?: number;
};

/** 轮询检查可见元素持续时长的间隔 */
const DWELL_CHECK_INTERVAL = 100;

/** 监视元素进入视口后的连续可见时长，并在达到指定时长后触发回调 */
export class DwellWatcher {
  private readonly stateMap = new WeakMap<HTMLElement, DwellState>();
  private readonly visibleSet = new Set<HTMLElement>();
  private checkTimer: number | undefined;
  private readonly observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const e = entry.target as HTMLElement;

      const state = this.stateMap.get(e);
      if (!state) continue;

      if (entry.isIntersecting) {
        this.visibleSet.add(e);
        if (state.enterTime === undefined) state.enterTime = performance.now();
        this.ensureTimer();
      } else {
        this.visibleSet.delete(e);
        state.enterTime = undefined;
        this.stopTimerIfNeeded();
      }
    }
  });

  watch(e: HTMLElement, duration: number, callback: () => void) {
    this.unwatch(e);
    this.stateMap.set(e, { duration, callback });
    this.observer.observe(e);
  }

  unwatch(e: HTMLElement) {
    this.visibleSet.delete(e);
    this.stopTimerIfNeeded();
    if (this.stateMap.delete(e)) this.observer.unobserve(e);
  }

  get visibleElements(): ReadonlySet<HTMLElement> {
    return this.visibleSet;
  }

  /** 有可见元素时启动轮询，没有可见元素时停止轮询 */
  private ensureTimer() {
    if (this.checkTimer === undefined && this.visibleSet.size > 0) {
      this.checkTimer = window.setInterval(
        () => this.checkVisibleElements(),
        DWELL_CHECK_INTERVAL,
      );
    }
  }

  private stopTimerIfNeeded() {
    if (this.checkTimer !== undefined && this.visibleSet.size === 0) {
      window.clearInterval(this.checkTimer);
      this.checkTimer = undefined;
    }
  }

  private checkVisibleElements() {
    for (const e of this.visibleSet) {
      const state = this.stateMap.get(e);
      if (!state) continue;
      if (state.enterTime === undefined) {
        state.enterTime = performance.now();
        continue;
      }
      if (performance.now() - state.enterTime >= state.duration) {
        this.unwatch(e);
        state.callback();
      }
    }
  }
}
