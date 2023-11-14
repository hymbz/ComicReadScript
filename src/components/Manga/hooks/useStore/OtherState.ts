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
  switch_grid_mode: [],
  switch_single_double_page_mode: [],
  switch_dir: [],
  switch_auto_enlarge: [],
};

export const OtherState = {
  /** 当前设备是否是移动端 */
  isMobile: false,

  /** 网格模式 */
  gridMode: false,

  /** 评论列表 */
  commentList: undefined as string[] | undefined,

  /** 快捷键配置 */
  hotkeys: {} as Record<string, string[]>,

  show: {
    /** 是否强制显示工具栏 */
    toolbar: false,
    /** 是否强制显示滚动条 */
    scrollbar: false,
    /** 是否显示点击区域 */
    touchArea: false,
    /** 结束页状态 */
    endPage: undefined as undefined | 'start' | 'end',
  },

  prop: {
    /** 点击结束页按钮时触发的回调 */
    Exit: undefined as ((isEnd?: boolean) => void) | undefined,
    /** 点击上一话按钮时触发的回调 */
    Prev: undefined as (() => void | Promise<void>) | undefined,
    /** 点击下一话按钮时触发的回调 */
    Next: undefined as (() => void | Promise<void>) | undefined,

    /** 图片加载状态发生变化时触发的回调 */
    Loading: undefined as
      | ((imgList: ComicImg[], img?: ComicImg) => void | Promise<void>)
      | undefined,
    /** 配置发生变化时触发的回调 */
    OptionChange: undefined as
      | ((option: Partial<Option>) => void | Promise<void>)
      | undefined,
    /** 快捷键配置发生变化时触发的回调 */
    HotkeysChange: undefined as
      | ((option: Record<string, string[]>) => void | Promise<void>)
      | undefined,

    editButtonList: (list: ToolbarButtonList) => list,
    editSettingList: (list: SettingList) => list,
  },

  // 自动更新不能手动修改的变量
  memo: {
    /** 当前显示的页面 */
    showPageList: [] as number[],
    /** 要渲染的页面 */
    renderPageList: [] as PageList,
  },

  flag: {
    /** 是否需要自动判断开启卷轴模式 */
    autoScrollMode: true,
    /** 是否需要自动将未加载图片类型设为跨页图 */
    autoWide: true,
  },
};
