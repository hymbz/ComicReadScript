export const ShowState = {
  /** 当前设备是否是移动端 */
  isMobile: false,
  /** 是否处于拖拽模式 */
  isDragMode: false,

  /** 当前页数 */
  activePageIndex: 0,

  /** 网格模式 */
  gridMode: false,

  show: {
    /** 是否强制显示工具栏 */
    toolbar: false,
    /** 是否强制显示滚动条 */
    scrollbar: false,
    /** 是否显示点击区域 */
    touchArea: false,
    /** 结束页状态 */
    endPage: undefined as undefined | 'start' | 'end',
  },

  page: {
    /** 动画效果 */
    anima: '' as '' | 'zoom' | 'page',
    /** 竖向排列 */
    vertical: false,

    /** 正常显示页面所需的偏移量 */
    offset: {
      x: { pct: 0, px: 0 },
      y: { pct: 0, px: 0 },
    },
  },
};
