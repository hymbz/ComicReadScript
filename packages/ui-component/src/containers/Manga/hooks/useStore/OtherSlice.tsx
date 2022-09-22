import type { DefaultButtonList } from '../../defaultButtonList';
import type { DefaultSettingList } from '../../defaultSettingList';

export interface OtherSlice {
  /** 是否强制显示侧边栏 */
  showToolbar: boolean;
  /** 是否强制显示滚动条 */
  showScrollbar: boolean;
  /** 是否显示结束页 */
  showEndPage: boolean;

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
