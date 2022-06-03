import Color from 'color';

// TODO: Color 这个依赖可能可以删掉？

declare global {
  interface StateStyles {
    color: string;
    backgroundColor: string;
  }
}

export interface StylesSlice {
  styles: {
    normal: StateStyles;
    invert: StateStyles;
  };
  getHoverBgColor: (color: string) => string;

  [key: string]: unknown;
}

export const stylesSlice: SelfStateCreator<StylesSlice> = (set, get) => {
  const white: StateStyles = {
    color: '#FFFFFF',
    backgroundColor: '#000000',
  };
  const black: StateStyles = {
    color: '#000000',
    backgroundColor: '#FFFFFF',
  };
  const custom = (): StateStyles => {
    const bgcolor = get().option.自定义背景!;
    return {
      color: Color(bgcolor).isDark() ? white.color : black.color,
      backgroundColor: bgcolor,
    };
  };

  return {
    styles: {
      get normal() {
        const { 自定义背景, darkMode } = get().option;
        if (自定义背景) return custom();
        return darkMode ? white : black;
      },
      get invert() {
        const { 自定义背景, darkMode } = get().option;
        if (自定义背景) return custom();
        return darkMode ? black : white;
      },
    },
    getHoverBgColor: (color: string) => {
      const isBlackBG = color === white.color;
      const isDark = get().option.darkMode;

      let lightness: number;

      if (isBlackBG !== isDark) lightness = 50;
      else if (isDark) lightness = 30;
      else lightness = 90;

      // 黑色背景：0
      // 白底：50
      // 黑底：30

      // 白色背景：100
      // 白底：90
      // 黑底：50
      return `hsl(0deg 0% ${lightness}%)`;
    },
  };
};
