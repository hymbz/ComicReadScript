type ShowState = {
  /** 当前设备是否是移动端 */
  isMobile: boolean;
  /** 是否处于拖拽模式 */
  isDragMode: boolean;
  /** 是否正在播放翻页滑动动画 */
  isTurnAnimating: boolean;
  /** 鼠标是否悬停在滚动条上 */
  isScrollbarHover: boolean;

  /** 当前页数 */
  activePageIndex: number;

  show: {
    /** 是否强制显示工具栏 */
    toolbar: boolean;
    /** 是否强制显示滚动条 */
    scrollbar: boolean;
    /** 是否强制显示页码提示 */
    pageTip: boolean;
    /** 是否显示点击区域 */
    touchArea: boolean;
    /** 结束页状态 */
    endPage: undefined | 'start' | 'end';
  };

  page: {
    /** 动画效果 */
    anima: '' | 'zoom' | 'page';
    /** 竖向排列 */
    vertical: boolean;

    /** 正常显示页面所需的偏移量 */
    offset: {
      /** 水平偏移 */
      x: {
        /** 以「页」（一屏）为单位的偏移量，乘以容器宽后得到像素值 */
        pct: number;
        /** 像素级补充偏移量，用于滚动/拖拽等细粒度位移 */
        px: number;
      };
      /** 垂直偏移 */
      y: {
        /** 以「页」（一屏）为单位的偏移量，乘以容器高后得到像素值 */
        pct: number;
        /** 像素级补充偏移量，用于滚动/拖拽等细粒度位移 */
        px: number;
      };
    };
  };
};

export const showState: ShowState = {
  isMobile: false,
  isDragMode: false,
  isTurnAnimating: false,
  isScrollbarHover: false,

  activePageIndex: 0,

  show: {
    toolbar: false,
    scrollbar: false,
    pageTip: false,
    touchArea: false,
    endPage: undefined,
  },

  page: {
    anima: '',
    vertical: true,

    offset: {
      x: { pct: 0, px: 0 },
      y: { pct: 0, px: 0 },
    },
  },
};
