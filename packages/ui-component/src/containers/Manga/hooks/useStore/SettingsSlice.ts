import type { Draft } from 'immer';
import { produce } from 'immer';
import type { SetState, GetState } from 'zustand';

declare global {
  // 初始化开关设置项
  interface InitSettingsListItemSwitch {
    type: 'switch';
    name: string;
    /**
     * 设置为 True 时，在按钮关闭时会隐藏其后的列表项
     */
    hiddenOther?: true;
    /**
     * state 选择器
     */
    checked: (state: DraftSelfState) => boolean;
    onChange: (
      checked: boolean,
      set: SelfStateSet,
      get: SelfStateGet,
      event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
  }
  // 开关设置项
  interface SettingsListItemSwitch {
    type: 'switch';
    name: string;
    checked: boolean;
    hiddenOther?: boolean;
    onChange: (
      event: React.ChangeEvent<HTMLInputElement>,
      checked: boolean,
    ) => void;
  }

  // 颜色选择器设置项
  interface InitSettingsListItemColor {
    type: 'color';
    name: string;
    value: (state: DraftSelfState) => string;
    onChange: (
      newColor: string,
      set: SelfStateSet,
      get: SelfStateGet,
      event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
  }
  // 设置列表项颜色
  interface SettingsListItemColor {
    type: 'color';
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }

  type InitSettingsListItem =
    | InitSettingsListItemSwitch
    | InitSettingsListItemColor;
  type InitSettingsList = InitSettingsListItem[];
  type InitSettingsMap = Map<string, InitSettingsList>;

  type SettingsListItem = SettingsListItemSwitch | SettingsListItemColor;
  type SettingsList = Array<SettingsListItem>;
  type SettingsMap = Map<string, SettingsList>;
}

export interface SettingsSlice {
  settingsMap: SettingsMap;
  initSettingsMap: (settingsList: InitSettingsMap) => void;

  [key: string]: unknown;
}

// 为不同类型的设置项进行初始化的处理函数
interface HandleListItemFunc<
  T extends InitSettingsListItem,
  U extends SettingsListItem,
> {
  (
    state: Draft<DraftSelfState>,
    listName: string,
    initSettingsListItem: T,
    i: number,
  ): U;
}

export const settingsSlice: SelfStateCreator<SettingsSlice> = (set, get) => {
  // 处理开关类的设置项
  const handleSwitch: HandleListItemFunc<
    InitSettingsListItemSwitch,
    SettingsListItemSwitch
  > = (state, listName, { type, name, checked, onChange, hiddenOther }, i) => ({
    type,
    name,
    checked: checked(state),
    hiddenOther: hiddenOther ? !checked(state) : undefined,

    onChange: (event, _checked) => {
      onChange(_checked, set, get, event);
      set((draftState) => {
        draftState.settingsMap.set(
          listName,
          produce(
            draftState.settingsMap.get(listName)!,
            (draftListData: SettingsListItemSwitch[]) => {
              draftListData[i].checked = checked(draftState);
              if (draftListData[i].hiddenOther !== undefined)
                draftListData[i].hiddenOther = !draftListData[i].checked;
            },
          ),
        );
      });
    },
  });

  // 处理颜色选择器类的设置项
  const handleColor: HandleListItemFunc<
    InitSettingsListItemColor,
    SettingsListItemColor
  > = (state, _, { type, name, value, onChange }) => ({
    type,
    name,
    value: value(state),

    onChange: (event) => {
      onChange(event.target.value, set, get, event);
    },
  });

  return {
    settingsMap: new Map(),

    initSettingsMap: (settingsList: InitSettingsMap) => {
      set((state) => {
        [...settingsList.entries()].forEach(([listName, listData]) => {
          state.settingsMap.set(
            listName,
            listData
              .map((listItem, i) => {
                // 为不同类型的设置项进行初始化
                switch (listItem.type) {
                  case 'switch':
                    return handleSwitch(state, listName, listItem, i);
                  case 'color':
                    return handleColor(state, listName, listItem, i);

                  default:
                    return undefined;
                }
              })
              .filter<SettingsListItem>(
                (item): item is SettingsListItem => item !== undefined,
              ),
          );
        });
      });
    },
  };
};
