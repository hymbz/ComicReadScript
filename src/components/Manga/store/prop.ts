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
    onExit?: (isEnd?: boolean) => void;
    /** 点击上一话按钮时触发的回调 */
    onPrev?: () => void | Promise<void>;
    /** 点击下一话按钮时触发的回调 */
    onNext?: () => void | Promise<void>;

    /** 图片加载状态发生变化时触发的回调 */
    onLoading?: (imgList: ComicImg[], img?: ComicImg) => void | Promise<void>;
    /** 图片加载失败时触发的回调 */
    onImgError?: (url: string) => void | Promise<void>;
    /** 配置发生变化时触发的回调 */
    onOptionChange?: (option: Partial<Option>) => void | Promise<void>;
    /** 快捷键配置发生变化时触发的回调 */
    onHotkeysChange?: (
      hotkeys: Record<string, string[]>,
    ) => void | Promise<void>;
    /** 显示图片发生变化时触发的回调 */
    onShowImgsChange?: (
      showImgs: Set<number>,
      imgList: ComicImg[],
    ) => void | Promise<void>;

    editButtonList: (list: ToolbarButtonList) => ToolbarButtonList;
    editSettingList: (list: SettingList) => SettingList;
  };
}

export const propState: PropState = {
  commentList: undefined,

  hotkeys: {},

  prop: {
    onExit: undefined,
    onPrev: undefined,
    onNext: undefined,

    onLoading: undefined,
    onOptionChange: undefined,
    onHotkeysChange: undefined,

    editButtonList: (list) => list,
    editSettingList: (list) => list,
  },
};
