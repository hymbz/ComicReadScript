import type { DefaultButtonList } from '../../defaultButtonList';
import type { DefaultSettingList } from '../../defaultSettingList';

export interface OtherSlice {
  editButtonList: (list: DefaultButtonList) => DefaultButtonList;
  editSettingList: (list: DefaultSettingList) => DefaultSettingList;
}

export const otherSlice: SelfStateCreator<OtherSlice> = () => ({
  editButtonList: (list: DefaultButtonList) => list,
  editSettingList: (list: DefaultSettingList) => list,
});
