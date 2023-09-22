import type { PanZoom } from 'panzoom';

import type { ToolbarButtonList } from '../../defaultButtonList';
import type { SettingList } from '../../defaultSettingList';
import type { Option } from './OptionState';

export const defaultHotkeys: Readonly<Record<string, string[]>> = {
  turn_page_up: ['w', 'ArrowUp', 'PageUp'],
  turn_page_down: [' ', 's', 'ArrowDown', 'PageDown'],
  turn_page_right: ['d', '.', 'ArrowRight'],
  turn_page_left: ['a', ',', 'ArrowLeft'],
  jump_to_home: ['Home'],
  jump_to_end: ['End'],
  exit: ['Escape'],
  switch_page_fill: ['/', 'm', 'z'],
  switch_scroll_mode: [],
  switch_single_double_page_mode: [],
  switch_dir: [],
};

export const OtherState = {
  panzoom: undefined as PanZoom | undefined,
  /** 当前是否处于放大模式 */
  isZoomed: false,

  /** 是否强制显示侧边栏 */
  showToolbar: false,
  /** 是否强制显示滚动条 */
  showScrollbar: false,
  /** 是否显示结束页 */
  showEndPage: false,
  /** 是否显示点击区域 */
  showTouchArea: false,
  /** 结束页状态。showEndPage 更改时自动计算 */
  endPageType: undefined as undefined | 'start' | 'end',

  /** 评论列表 */
  commentList: undefined as string[] | undefined,

  /** 快捷键配置 */
  hotkeys: {} as Record<string, string[]>,

  /** 点击结束页按钮时触发的回调 */
  onExit: undefined as ((isEnd?: boolean) => void) | undefined,
  /** 点击上一话按钮时触发的回调 */
  onPrev: undefined as (() => void | Promise<void>) | undefined,
  /** 点击下一话按钮时触发的回调 */
  onNext: undefined as (() => void | Promise<void>) | undefined,

  /** 图片加载状态发生变化时触发的回调 */
  onLoading: undefined as
    | ((imgList: ComicImg[], img?: ComicImg) => void | Promise<void>)
    | undefined,
  /** 配置发生变化时触发的回调 */
  onOptionChange: undefined as
    | ((option: Partial<Option>) => void | Promise<void>)
    | undefined,
  /** 快捷键配置发生变化时触发的回调 */
  onHotkeysChange: undefined as
    | ((option: Record<string, string[]>) => void | Promise<void>)
    | undefined,

  editButtonList: (list: ToolbarButtonList) => list,
  editSettingList: (list: SettingList) => list,

  prevRef: undefined as HTMLButtonElement | undefined,
  nextRef: undefined as HTMLButtonElement | undefined,
  exitRef: undefined as HTMLButtonElement | undefined,

  flag: {
    /** 是否需要自动判断开启卷轴模式 */
    autoScrollMode: true,
    /** 是否需要自动将未加载图片类型设为跨页图 */
    autoWide: true,
  },
};
