import { throttle } from 'lodash';
import type { ChangeEvent } from 'react';
import { useCallback } from 'react';
import { useStore } from './hooks/useStore';
import { SettingsItem } from './components/SettingsItem';
import { SettingsItemSwitch } from './components/SettingsItemSwitch';

/** 默认菜单项 */
export const defaultSettingsList: [string, React.FC][] = [
  [
    '滚动条',
    () => {
      const enabled = useStore((state) => state.option.scrollbar.enabled);
      const handelEnable = useCallback(() => {
        useStore.setState((draftState) => {
          draftState.option.scrollbar.enabled =
            !draftState.option.scrollbar.enabled;
        });
      }, []);

      const autoHidden = useStore((state) => state.option.scrollbar.autoHidden);
      const handelAutoHidden = useCallback(() => {
        useStore.setState((draftState) => {
          draftState.option.scrollbar.autoHidden =
            !draftState.option.scrollbar.autoHidden;
        });
      }, []);

      return (
        <>
          <SettingsItemSwitch
            name="显示滚动条"
            value={enabled}
            onChange={handelEnable}
          />
          {enabled ? (
            <SettingsItemSwitch
              name="自动隐藏滚动条"
              value={autoHidden}
              onChange={handelAutoHidden}
            />
          ) : undefined}
        </>
      );
    },
  ],
  [
    '点击翻页',
    () => {
      const 点击翻页 = useStore((state) => state.option.点击翻页);
      const handelClickPages = useCallback(() => {
        useStore.setState((draftState) => {
          draftState.option.点击翻页 = !draftState.option.点击翻页;
        });
      }, []);

      const showTouchArea = useStore((state) => state.showTouchArea);
      const handelShowTouchArea = useCallback(() => {
        useStore.setState((draftState) => {
          draftState.showTouchArea = !draftState.showTouchArea;
        });
      }, []);

      return (
        <>
          <SettingsItemSwitch
            name="启用点击翻页"
            value={点击翻页}
            onChange={handelClickPages}
          />
          <SettingsItemSwitch
            name="显示点击区域提示"
            value={showTouchArea}
            onChange={handelShowTouchArea}
          />
        </>
      );
    },
  ],
  [
    '其他',
    () => {
      const darkMode = useStore((state) => state.option.darkMode);
      const handelDarkMode = useCallback(() => {
        useStore.setState((draftState) => {
          draftState.option.darkMode = !draftState.option.darkMode;
        });
      }, []);

      const backgroundColor = useStore(
        (state) =>
          state.option.自定义背景 || state.styles.normal.backgroundColor,
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const handelBgColor = useCallback(
        throttle((event: ChangeEvent<HTMLInputElement>) => {
          useStore.setState((draftState) => {
            draftState.option.自定义背景 = event.target.value;
          });
        }, 100),
        [],
      );

      return (
        <>
          <SettingsItemSwitch
            name="启用夜间模式"
            value={darkMode}
            onChange={handelDarkMode}
          />

          <SettingsItem name="背景颜色">
            <input
              type="color"
              value={backgroundColor}
              onChange={handelBgColor}
              style={{ width: '2em', marginRight: '.4em' }}
            />
          </SettingsItem>
        </>
      );
    },
  ],
];
