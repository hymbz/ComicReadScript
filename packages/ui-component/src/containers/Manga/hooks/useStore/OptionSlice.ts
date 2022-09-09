declare global {
  interface Option {
    dir: 'ltr' | 'rtl';
    /** 滚动条 */
    scrollbar: {
      enable: boolean;
      /** 自动隐藏 */
      autoHidden: boolean;
    };
    /** 单页模式 */
    onePageMode: boolean;
    /** 卷轴模式 */
    scrollMode: boolean;
    点击翻页: boolean;
    自定义背景?: string;

    darkMode: boolean;

    [key: string]: unknown;
  }
}

export interface OptionSlice {
  option: Option;

  showTouchArea: boolean;

  [key: string]: unknown;
}

export const optionSlice: SelfStateCreator<OptionSlice> = () => ({
  option: {
    dir: 'rtl',
    scrollbar: {
      enable: true,
      autoHidden: false,
    },
    onePageMode: false,
    scrollMode: false,
    点击翻页: false,

    自定义背景: undefined,

    // 判断用户系统环境是否要求开启暗色模式
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  },

  showTouchArea: false,
});
