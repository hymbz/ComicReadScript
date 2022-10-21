import type { DefaultButtonList } from '../../defaultButtonList';
import type { DefaultSettingList } from '../../defaultSettingList';
import type { SelfStateCreator } from '.';

export interface OtherSlice {
  /** 是否强制显示侧边栏 */
  showToolbar: boolean;
  /** 是否强制显示滚动条 */
  showScrollbar: boolean;
  /** 是否显示结束页 */
  showEndPage: boolean;

  /** 点击结束页按钮时触发的回调 */
  onExit?: (isEnd?: boolean) => void;
  /** 点击上一话按钮时触发的回调 */
  onPrev?: () => void;
  /** 点击下一话按钮时触发的回调 */
  onNext?: () => void;

  editButtonList: (list: DefaultButtonList) => DefaultButtonList;
  editSettingList: (list: DefaultSettingList) => DefaultSettingList;
}

export const otherSlice: SelfStateCreator<OtherSlice> = () => ({
  showToolbar: false,
  showScrollbar: false,
  showEndPage: false,

  editButtonList: (list: DefaultButtonList) => list,
  editSettingList: (list: DefaultSettingList) => list,
});
