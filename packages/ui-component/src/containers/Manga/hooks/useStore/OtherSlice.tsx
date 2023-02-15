import type { ToolbarButtonList } from '../../defaultButtonList';
import type { SettingList } from '../../defaultSettingList';
import type { SelfStateCreator } from '.';

export interface OtherSlice {
  /** 是否强制显示侧边栏 */
  showToolbar: boolean;
  /** 是否强制显示滚动条 */
  showScrollbar: boolean;
  /** 是否显示结束页 */
  showEndPage: boolean;
  /** 结束页状态。showEndPage 更改时自动计算 */
  endPageType: undefined | 'start' | 'end';

  /** 点击结束页按钮时触发的回调 */
  onExit?: (isEnd?: boolean) => void;
  /** 点击上一话按钮时触发的回调 */
  onPrev?: () => void;
  /** 点击下一话按钮时触发的回调 */
  onNext?: () => void;

  editButtonList: (list: ToolbarButtonList) => ToolbarButtonList;
  editSettingList: (list: SettingList) => SettingList;
}

export const otherSlice: SelfStateCreator<OtherSlice> = () => ({
  showToolbar: false,
  showScrollbar: false,
  showEndPage: false,
  endPageType: undefined,

  editButtonList: (list: ToolbarButtonList) => list,
  editSettingList: (list: SettingList) => list,
});
