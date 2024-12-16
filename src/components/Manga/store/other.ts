export const otherState = {
  title: '',

  /**
   * 用于防止滚轮连续滚动导致过快触发事件的锁
   *
   * - 在首次触发结束页时开启，一段时间关闭。开启时禁止触发结束页的上下话切换功能。
   */
  scrollLock: false,

  rootSize: { width: 0, height: 0 },
  scrollbarSize: { width: 0, height: 0 },

  supportWorker: false,
};
