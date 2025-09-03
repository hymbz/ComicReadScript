export const otherState = {
  title: '',

  /**
   * 用于防止滚轮连续滚动导致过快触发事件的锁
   *
   * - 在首次触发结束页时开启，一段时间关闭。开启时禁止触发结束页的上下话切换功能。
   */
  scrollLock: false,
  /** 当前是否处于全屏状态 */
  fullscreen: false,

  rootSize: { width: 0, height: 0 },
  scrollbarSize: { width: 0, height: 0 },

  /** 卷轴模式下的滚动距离 */
  scrollTop: 0,

  autoScroll: { play: false, progress: 0 },

  supportWorker: false,

  supportUpscaleImage: true,
};
