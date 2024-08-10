import type { ToolbarButtonList } from '../defaultButtonList';
import type { SettingList } from '../defaultSettingList';

import type { Option } from './option';

interface PropState {
  /** 评论列表 */
  commentList: string[] | undefined;

  /** 快捷键配置 */
  hotkeys: Record<string, string[]>;
  prop: {
    /** 点击结束页按钮时触发的回调 */
    Exit: ((isEnd?: boolean) => void) | undefined;
    /** 点击上一话按钮时触发的回调 */
    Prev: (() => void | Promise<void>) | undefined;
    /** 点击下一话按钮时触发的回调 */
    Next: (() => void | Promise<void>) | undefined;

    /** 图片加载状态发生变化时触发的回调 */
    Loading:
      | ((imgList: ComicImg[], img?: ComicImg) => void | Promise<void>)
      | undefined;
    /** 配置发生变化时触发的回调 */
    OptionChange:
      | ((option: Partial<Option>) => void | Promise<void>)
      | undefined;
    /** 快捷键配置发生变化时触发的回调 */
    HotkeysChange:
      | ((hotkeys: Record<string, string[]>) => void | Promise<void>)
      | undefined;

    editButtonList: (list: ToolbarButtonList) => ToolbarButtonList;
    editSettingList: (list: SettingList) => SettingList;
  };
}

export const propState: PropState = {
  commentList: undefined,

  hotkeys: {},

  prop: {
    Exit: undefined,
    Prev: undefined,
    Next: undefined,

    Loading: undefined,
    OptionChange: undefined,
    HotkeysChange: undefined,

    editButtonList: (list) => list,
    editSettingList: (list) => list,
  },
};
