import { throttle } from 'lodash';
import type { ChangeEvent } from 'react';
import { useCallback } from 'react';
import {
  MdOutlineFormatTextdirectionRToL,
  MdOutlineFormatTextdirectionLToR,
} from 'react-icons/md';
import { useStore } from './hooks/useStore';
import { SettingsItem } from './components/SettingsItem';
import { SettingsItemSwitch } from './components/SettingsItemSwitch';

import classes from './index.module.css';

/** 默认菜单项 */
export const defaultSettingsList: [string, React.FC][] = [
  [
    '阅读',
    () => {
      const dir = useStore((state) => state.option.dir);
      const handelEditDir = useCallback(() => {
        useStore.setState((draftState) => {
          draftState.option.dir =
            draftState.option.dir === 'rtl' ? 'ltr' : 'rtl';
        });
      }, []);

      return (
        <>
          <SettingsItem
            name={dir === 'rtl' ? '从右到左（日漫）' : '从左到右（美漫）'}
          >
            <button
              className={classes.SettingsItemIconButton}
              type="button"
              onClick={handelEditDir}
            >
              {dir === 'rtl' ? (
                <MdOutlineFormatTextdirectionRToL />
              ) : (
                <MdOutlineFormatTextdirectionLToR />
              )}
            </button>
          </SettingsItem>
          {/* <SettingsItemSwitch
            name="显示滚动条"
            value={enabled}
            onChange={handelEnable}
          /> */}
        </>
      );
    },
  ],
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
      const clickPage = useStore((state) => state.option.clickPage);
      const handelClickPages = useCallback(() => {
        useStore.setState((draftState) => {
          draftState.option.clickPage = !draftState.option.clickPage;
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
            value={clickPage}
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
          state.option.customBackground || state.styles.normal.backgroundColor,
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const handelBgColor = useCallback(
        throttle((event: ChangeEvent<HTMLInputElement>) => {
          useStore.setState((draftState) => {
            draftState.option.customBackground = event.target.value;
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
