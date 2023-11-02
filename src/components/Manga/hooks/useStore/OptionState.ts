import { lang } from 'helper/i18n';

export interface Option {
  dir: 'ltr' | 'rtl';
  /** 滚动条 */
  scrollbar: {
    enabled: boolean;
    /** 自动隐藏 */
    autoHidden: boolean;
    /** 显示图片加载状态 */
    showImgStatus: boolean;
    /** 快捷滚动 */
    easyScroll: boolean;
  };
  /** 单页模式 */
  onePageMode: boolean;
  /** 卷轴模式 */
  scrollMode: boolean;
  /** 卷轴模式下的图片间距 */
  scrollModeSpacing: number;
  /** 点击翻页 */
  clickPageTurn: {
    enabled: boolean;
    /** 左右反转点击区域 */
    reverse: boolean;
    /** 将点击区域改为上下翻页 */
    vertical: boolean;
  };
  /** 默认启用首页填充 */
  firstPageFill: boolean;
  /** 自定义背景色 */
  customBackground?: string;
  /** 禁止自动放大图片 */
  disableZoom: boolean;
  /** 黑暗模式 */
  darkMode: boolean;
  /** 左右翻页键交换 */
  swapPageTurnKey: boolean;
  /** 滚动到底后继续滚动会跳至下一话 */
  jumpToNext: boolean;
  /** 始终加载所有图片 */
  alwaysLoadAllImg: boolean;
  /** 卷轴模式下图片的缩放比例 */
  scrollModeImgScale: number;
  /** 在结束页显示评论 */
  showComment: boolean;
  /** 预加载页数 */
  preloadPageNum: number;

  /** 翻译 */
  translation: {
    /** 翻译服务器 */
    server: 'disable' | 'selfhosted' | 'cotrans';
    /** 本地部署的项目 url */
    localUrl: string | undefined;
    /** 忽略缓存强制重试 */
    forceRetry: boolean;
    /** manga-image-translator 配置 */
    options: {
      size: string;
      detector: string;
      direction: string;
      translator: string;
      targetLanguage: string;
    };
  };
}

const LanguageMap = { zh: 'CHS', en: 'ENG' };
const targetLanguage = LanguageMap[lang()] ?? 'CHS';

export const defaultOption: Readonly<Option> = {
  dir: 'rtl',
  scrollbar: {
    enabled: true,
    autoHidden: false,
    showImgStatus: true,
    easyScroll: false,
  },
  onePageMode: false,
  scrollMode: false,
  scrollModeSpacing: 0,
  clickPageTurn: {
    enabled: 'ontouchstart' in document.documentElement,
    reverse: false,
    vertical: false,
  },
  firstPageFill: true,
  disableZoom: false,
  darkMode: false,
  swapPageTurnKey: false,
  jumpToNext: true,
  alwaysLoadAllImg: false,
  scrollModeImgScale: 1,
  showComment: true,
  preloadPageNum: 20,

  translation: {
    server: 'disable',
    localUrl: undefined,
    forceRetry: false,
    options: {
      size: 'M',
      detector: 'default',
      translator: 'gpt3.5',
      direction: 'auto',
      targetLanguage,
    },
  },
};

export const OptionState = {
  option: JSON.parse(JSON.stringify(defaultOption)) as Option,
};
