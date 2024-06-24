import { lang } from 'helper/i18n';

import type { areaArrayMap } from '../components/TouchArea';

export interface Option {
  /** 漫画方向 */
  dir: 'ltr' | 'rtl';
  /** 单页模式 */
  onePageMode: boolean;
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
  /** 在结束页显示评论 */
  showComment: boolean;
  /** 预加载页数 */
  preloadPageNum: number;

  /** 滚动条 */
  scrollbar: {
    /** 滚动条位置 */
    position: 'hidden' | 'auto' | 'top' | 'bottom' | 'right';
    /** 自动隐藏 */
    autoHidden: boolean;
    /** 显示图片加载状态 */
    showImgStatus: boolean;
    /** 快捷滚动 */
    easyScroll: boolean;
  };

  /** 点击翻页 */
  clickPageTurn: {
    enabled: boolean;
    /** 左右反转点击区域 */
    reverse: boolean;
    /** 区域排列类型 */
    area: keyof typeof areaArrayMap;
  };

  /** 卷轴模式 */
  scrollMode: {
    enabled: boolean;
    /** 卷轴模式下的图片间距 */
    spacing: number;
    /** 卷轴模式下图片的缩放比例 */
    imgScale: number;
    /** 卷轴模式下图片适应宽度 */
    fitToWidth: boolean;
    /** 并排模式 */
    abreastMode: boolean;
    /** 并排模式下重新显示上列结尾部分的比例 */
    abreastDuplicate: number;
  };

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
    /** 只下载完成翻译的图片 */
    onlyDownloadTranslated: boolean;
  };
}

const LanguageMap = { zh: 'CHS', en: 'ENG' };
const targetLanguage = LanguageMap[lang()] ?? 'CHS';

const _defaultOption: Readonly<Option> = {
  dir: 'rtl',
  scrollbar: {
    position: 'auto',
    autoHidden: false,
    showImgStatus: true,
    easyScroll: false,
  },
  onePageMode: false,
  clickPageTurn: {
    enabled: 'ontouchstart' in document.documentElement,
    reverse: false,
    area: 'left_right',
  },
  firstPageFill: true,
  disableZoom: false,
  darkMode: false,
  swapPageTurnKey: false,
  jumpToNext: true,
  alwaysLoadAllImg: true,
  showComment: true,
  preloadPageNum: 20,

  scrollMode: {
    enabled: false,
    spacing: 0,
    imgScale: 1,
    fitToWidth: false,
    abreastMode: false,
    abreastDuplicate: 0.2,
  },

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
    onlyDownloadTranslated: false,
  },
};

export const defaultOption = () =>
  JSON.parse(JSON.stringify(_defaultOption)) as Option;

export const OptionState = {
  defaultOption: defaultOption(),
  option: defaultOption(),
};
