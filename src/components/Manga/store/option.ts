import type { areaArrayMap } from '../components/TouchArea';

import {
  cotransDefaultOptions,
  type CotransOptions,
} from '../actions/translation/translator/Cotrans/options';
import {
  mitDefaultOptions,
  type MitOptions,
} from '../actions/translation/translator/MangaImageTranslator/options';

export type Option = {
  /** 漫画方向 */
  dir: 'ltr' | 'rtl';
  /** 默认启用首页填充 */
  firstPageFill: boolean;
  /** 自定义背景色 */
  customBackground?: string;
  /** 禁止自动放大图片 */
  disableZoom: boolean;
  /** 黑暗模式 */
  darkMode: boolean;
  /** 黑暗模式跟随系统 */
  autoDarkMode: boolean;
  /** 左右翻页键交换 */
  swapPageTurnKey: boolean;
  /** 始终加载所有图片 */
  alwaysLoadAllImg: boolean;
  /** 在结束页显示评论 */
  showComment: boolean;
  /** 预加载页数 */
  preloadPageNum: number;
  /** 显示页数。0 表示 auto */
  pageNum: 1 | 2 | 0;
  /** 自动切换单双页模式 */
  autoSwitchPageMode: boolean;
  /** 自动隐藏鼠标 */
  autoHiddenMouse: boolean;
  /** 翻页至尽头后继续翻页的操作 */
  scroolEnd: 'none' | 'exit' | 'auto';
  /** 自动全屏 */
  autoFullscreen: boolean;

  zoom: {
    /** 缩放大小 */
    ratio: number;
    /** 确保缩放前后基准点不变所需的偏移量 */
    offset: { x: number; y: number };
  };

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
    /** 缩小菜单区域 */
    shrinkMenu: boolean;
    /** 区域排列类型 */
    area: keyof typeof areaArrayMap;
  };

  /** 卷轴模式 */
  scrollMode: {
    enabled: boolean;
    /** 图片间距 */
    spacing: number;
    /** 图片缩放比例 */
    imgScale: number;

    /**
     * 调整图片的显示宽度
     *
     * - 'disable': 禁用
     * - 'full': 全部图片缩放适应页宽
     * - number: 通过调整图片缩放比例，让**大多数**图片的宽度接近指定值
     */
    adjustToWidth: 'disable' | 'full' | number;
    // 虽然放在同一个选项里，但 'full' 和 number 其实是毫无关联的两套实现
    // number 之所以是作用于大多数而不是全部，是为了避免跨页大图被缩小得看不清字
    // https://github.com/hymbz/ComicReadScript/issues/285

    /** 并排模式 */
    abreastMode: boolean;
    /** 并排模式下重新显示上列结尾部分的比例 */
    abreastDuplicate: number;

    /** 双页模式 */
    doubleMode: boolean;
    /** 滚动翻页时对齐边缘 */
    alignEdge: boolean;
  };

  /** 图像识别 */
  imgRecognition: {
    enabled: boolean;
    /** 识别背景色 */
    background: boolean;
    /** 自动调整页面填充 */
    pageFill: boolean;
    /** 图片放大 */
    upscale: boolean;
  };

  /** 翻译 */
  translation: {
    /** 是否启用翻译 */
    enabled: boolean;
    /** 翻译器 */
    provider: 'manga-image-translator' | 'cotrans';
    /** 忽略缓存强制重试 */
    forceRetry: boolean;
    /** 只下载完成翻译的图片 */
    onlyDownloadTranslated: boolean;

    mit: MitOptions;
    cotrans: CotransOptions;
  };

  /** 自动滚动 */
  autoScroll: {
    enabled: boolean;
    interval: number;
    distance: number;
    /** 是否触发退出和上/下话 */
    triggerEnd: boolean;
  };
};

const _defaultOption: Readonly<Option> = {
  dir: 'rtl',
  scrollbar: {
    position: 'auto',
    autoHidden: false,
    showImgStatus: true,
    easyScroll: false,
  },
  clickPageTurn: {
    enabled: 'ontouchstart' in document.documentElement,
    reverse: false,
    area: 'left_right',
    shrinkMenu: false,
  },
  firstPageFill: true,
  disableZoom: false,
  darkMode: false,
  autoDarkMode: false,
  swapPageTurnKey: false,
  scroolEnd: 'auto',
  alwaysLoadAllImg: false,
  showComment: true,
  preloadPageNum: 20,
  pageNum: 0,
  autoSwitchPageMode: true,
  autoHiddenMouse: true,
  autoFullscreen: false,

  zoom: {
    ratio: 100,
    offset: { x: 0, y: 0 },
  },

  scrollMode: {
    enabled: false,
    spacing: 0,
    imgScale: 1,
    adjustToWidth: 'disable',
    abreastMode: false,
    abreastDuplicate: 0.1,
    doubleMode: false,
    alignEdge: false,
  },

  imgRecognition: {
    enabled: false,
    background: true,
    pageFill: true,
    upscale: false,
  },

  translation: {
    enabled: false,
    provider: 'manga-image-translator',
    onlyDownloadTranslated: false,
    forceRetry: false,

    mit: mitDefaultOptions(),
    cotrans: cotransDefaultOptions(),
  },

  autoScroll: {
    enabled: false,
    interval: 3000,
    distance: 200,
    triggerEnd: false,
  },
};

export const defaultOption = () => structuredClone(_defaultOption) as Option;

export const optionState = {
  defaultOption: defaultOption(),
  option: defaultOption(),
};
