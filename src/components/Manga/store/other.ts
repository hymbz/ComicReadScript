/** 滚动设备类型：A 类传统滚轮、B 类高精度滚轮、C 类触摸板；undefined 表示尚未确定 */
export type ScrollDeviceType = undefined | 'a' | 'b' | 'c';

export const otherState = {
  /** 漫画标题 */
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

  /** 虚拟棘轮的翻页进度（0~1），正为向下滚动 */
  wheelProgress: 0,

  /** 最近一次判定的滚动设备类型 */
  scrollDeviceType: undefined as ScrollDeviceType,

  autoScroll: { play: false, progress: 0 },

  supportWorker: false,

  supportUpscaleImage: true,
};
