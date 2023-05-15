export interface Option {
  dir: 'ltr' | 'rtl';
  /** 滚动条 */
  scrollbar: {
    enabled: boolean;
    /** 自动隐藏 */
    autoHidden: boolean;
    /** 显示图片加载状态 */
    showProgress: boolean;
  };
  /** 单页模式 */
  onePageMode: boolean;
  /** 卷轴模式 */
  scrollMode: boolean;
  /** 点击翻页 */
  clickPage: {
    enabled: boolean;
    /** 左右反转点击区域 */
    overturn: boolean;
  };
  /** 自定义背景色 */
  customBackground?: string;
  /** 禁止放大图片 */
  disableZoom: boolean;
  /** 黑暗模式 */
  darkMode: boolean;
  /** 滚动到底后继续滚动会跳至下一话 */
  flipToNext: boolean;
  /** 始终加载所有图片 */
  alwaysLoadAllImg: boolean;
}

export const OptionState = {
  option: {
    dir: 'rtl',
    scrollbar: {
      enabled: true,
      autoHidden: false,
      showProgress: true,
    },
    onePageMode: false,
    scrollMode: false,
    clickPage: {
      enabled: 'ontouchstart' in document.documentElement,
      overturn: false,
    },
    disableZoom: false,
    // 判断用户系统环境是否要求开启暗色模式
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    flipToNext: true,
    alwaysLoadAllImg: false,
  } as Option,

  /** 显示点击区域 */
  showTouchArea: false,
};
