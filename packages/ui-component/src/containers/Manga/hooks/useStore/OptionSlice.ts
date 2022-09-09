declare global {
  interface Option {
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
    clickPage: boolean;
    /** 自定义背景 */
    customBackground?: string;

    darkMode: boolean;
  }
}

export interface OptionSlice {
  option: Option;

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
    clickPage: false,

    customBackground: undefined,

    // 判断用户系统环境是否要求开启暗色模式
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  },

  showTouchArea: false,
});
