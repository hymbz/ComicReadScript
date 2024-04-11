export const OtherState = {
  /** 监视图片是否出现的 observer */
  observer: null as IntersectionObserver | null,

  flag: {
    /** 是否自动开启过卷轴模式 */
    autoScrollMode: false,
    /** 是否自动将未加载图片类型设为跨页图过 */
    autoWide: false,
    /** 是否自动将滚动条移至底部过 */
    autoLong: false,

    /**
     * 用于防止滚轮连续滚动导致过快触发事件的锁
     *
     * - 在缩放时开启，结束缩放一段时间后关闭。开启时禁止翻页。
     * - 在首次触发结束页时开启，一段时间关闭。开启时禁止触发结束页的上下话切换功能。
     */
    scrollLock: false,
  },
};
