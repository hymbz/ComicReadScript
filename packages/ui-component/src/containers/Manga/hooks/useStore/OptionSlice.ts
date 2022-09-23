export interface Option {
  dir: 'ltr' | 'rtl';
  /** 滚动条 */
  scrollbar: {
    enabled: boolean;
    /** 自动隐藏 */
    autoHidden: boolean;
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
  /** 自定义背景 */
  customBackground?: string;
  /** 禁止放大图片 */
  disableZoom: boolean;
  /** 黑暗模式 */
  darkMode: boolean;
  /** 向后预加载图片数 */
  preloadImgNum: number;
  /** 在空闲时间自动加载其余图片 */
  autoLoadOtherImg: boolean;

  // TODO: option 应该都能字符串化保存，所以函数不应该放这
  /** 点击结束页按钮时触发的回调 */
  onExit?: () => void;
  /** 点击上一话按钮时触发的回调 */
  onPrev?: () => void;
  /** 点击下一话按钮时触发的回调 */
  onNext?: () => void;
}

export interface OptionSlice {
  option: Option;

  /** 显示点击区域 */
  showTouchArea: boolean;
}

export const optionSlice: SelfStateCreator<OptionSlice> = () => ({
  option: {
    dir: 'rtl',
    scrollbar: {
      enabled: true,
      autoHidden: false,
    },
    onePageMode: false,
    scrollMode: false,
    clickPage: {
      enabled: true,
      overturn: false,
    },
    disableZoom: false,
    // 判断用户系统环境是否要求开启暗色模式
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    preloadImgNum: 10,
    autoLoadOtherImg: true,
  },

  showTouchArea: false,
});
