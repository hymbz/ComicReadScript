import type { ToolbarButtonList } from '../defaultButtonList';
import type { SettingList } from '../defaultSettingList';
import type { Option } from './option';

export const PropState = {
  /** 评论列表 */
  commentList: undefined as string[] | undefined,

  /** 快捷键配置 */
  hotkeys: {} as Record<string, string[]>,

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
};
