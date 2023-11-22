export const OtherState = {
  /** 监视图片是否出现的 observer */
  observer: null as IntersectionObserver | null,

  /** 自动更新不能手动修改的变量 */
  memo: {
    /** 显示窗口的尺寸 */
    size: { width: 0, height: 0 },
    /** 当前显示的图片 */
    showImgList: [] as HTMLImageElement[],
    /** 当前显示的页面 */
    showPageList: [] as number[],
    /** 要渲染的页面 */
    renderPageList: [] as PageList,
    /** 滚动条长度 */
    scrollLength: 0,
  },

  flag: {
    /** 是否需要自动判断开启卷轴模式 */
    autoScrollMode: true,
    /** 是否需要自动将未加载图片类型设为跨页图 */
    autoWide: true,

    /**
     * 用于防止滚轮连续滚动导致过快触发事件的锁
     *
     * - 在缩放时开启，结束缩放一段时间后关闭。开启时禁止翻页。
     * - 在首次触发结束页时开启，一段时间关闭。开启时禁止触发结束页的上下话切换功能。
     */
    scrollLock: false,
  },
};
