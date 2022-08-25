import { throttle } from 'lodash';
import { useEffect } from 'react';
import { useStore } from './useStore';

const defaultSettingsList: InitSettingsMap = new Map();
defaultSettingsList.set('滚动条', [
  {
    type: 'switch',
    name: '显示滚动条',
    hiddenOther: true,
    checked: (state) => state.option.scrollbar.enable,
    onChange: (checked, set) => {
      set((draftState) => {
        draftState.option.scrollbar.enable = checked;
      });
    },
  },
  {
    type: 'switch',
    name: '自动隐藏滚动条',
    checked: (state) => state.option.scrollbar.autoHidden,
    onChange: (checked, set) => {
      set((draftState) => {
        draftState.option.scrollbar.autoHidden = checked;
      });
    },
  },
]);
defaultSettingsList.set('点击翻页', [
  {
    type: 'switch',
    name: '启用点击翻页',
    hiddenOther: true,
    checked: (state) => state.option.点击翻页,
    onChange: (checked, set) => {
      set((draftState) => {
        draftState.option.点击翻页 = checked;
      });
    },
  },
  {
    type: 'switch',
    name: '显示点击区域提示',
    checked: (state) => state.showTouchArea,
    onChange: (checked, set) => {
      set((draftState) => {
        draftState.showTouchArea = checked;
      });
    },
  },
]);
defaultSettingsList.set('其他', [
  {
    type: 'switch',
    name: '启用夜间模式',
    hiddenOther: true,
    checked: (state) => state.option.darkMode,
    onChange: (checked, set) => {
      set((draftState) => {
        draftState.option.darkMode = checked;
      });
    },
  },
  {
    type: 'color',
    name: '背景颜色',
    value: (state) =>
      state.option.自定义背景 || state.styles.normal.backgroundColor,
    onChange: throttle<InitSettingsListItemColor['onChange']>(
      (newColor, set, get) => {
        if (newColor !== get().styles.normal.backgroundColor) {
          set((state) => {
            state.option.自定义背景 = newColor;
          });
        }
      },
      100,
    ),
  },
]);

const selector = ({
  //
  settingsMap,
  initSettingsMap,
}: SelfState) => ({
  settingsMap,
  initSettingsMap,
});

/**
 * 初始化设置项列表
 *
 * @param settingsList 设置项列表
 * @returns settingsMap
 */
export const useSettingsList = (settingsList = defaultSettingsList) => {
  const { settingsMap, initSettingsMap } = useStore(selector);

  useEffect(() => {
    initSettingsMap(settingsList);
  }, [initSettingsMap, settingsList]);

  return [...settingsMap.keys()];
};
