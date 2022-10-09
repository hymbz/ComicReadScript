import MdOutlineFormatTextdirectionLToR from '@material-design-icons/svg/round/format_textdirection_l_to_r.svg';
import MdOutlineFormatTextdirectionRToL from '@material-design-icons/svg/round/format_textdirection_r_to_l.svg';

import { throttle } from 'throttle-debounce';
import type { ChangeEvent } from 'react';
import { useCallback } from 'react';
import clsx from 'clsx';
import { useStore } from './hooks/useStore';
import { SettingsItem } from './components/SettingsItem';
import { SettingsItemSwitch } from './components/SettingsItemSwitch';

import classes from './index.module.css';

export type DefaultSettingList = [string, React.FC][];

/** 默认菜单项 */
export const defaultSettingList: DefaultSettingList = [
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
          <SettingsItemSwitch
            name="自动隐藏滚动条"
            value={autoHidden}
            className={clsx(enabled || classes.hidden)}
            onChange={handelAutoHidden}
          />
        </>
      );
    },
  ],
  [
    '点击翻页',
    () => {
      /** 是否启用点击翻页功能 */
      const clickPage = useStore((state) => state.option.clickPage.enabled);
      const handelClickPages = useCallback(() => {
        useStore.setState((draftState) => {
          draftState.option.clickPage.enabled =
            !draftState.option.clickPage.enabled;
        });
      }, []);

      /** 是否显示点击区域 */
      const showTouchArea = useStore((state) => state.showTouchArea);
      const handelShowTouchArea = useCallback(() => {
        useStore.setState((draftState) => {
          draftState.showTouchArea = !draftState.showTouchArea;
        });
      }, []);

      /** 是否左右反转点击区域 */
      const overturn = useStore((state) => state.option.clickPage.overturn);
      const handelOverturn = useCallback(() => {
        useStore.setState((draftState) => {
          draftState.option.clickPage.overturn =
            !draftState.option.clickPage.overturn;
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
            name="左右反转点击区域"
            value={overturn}
            className={clsx(!clickPage && classes.hidden)}
            onChange={handelOverturn}
          />
          <SettingsItemSwitch
            name="显示点击区域提示"
            value={showTouchArea}
            className={clsx(!clickPage && classes.hidden)}
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const handelBgColor = useCallback(
        throttle(100, (event: ChangeEvent<HTMLInputElement>) => {
          useStore.setState((draftState) => {
            draftState.option.customBackground = event.target.value;
          });
        }),
        [],
      );

      const disableZoom = useStore((state) => state.option.disableZoom);
      const handelDisableZoom = useCallback(() => {
        useStore.setState((draftState) => {
          draftState.option.disableZoom = !draftState.option.disableZoom;
        });
      }, []);

      return (
        <>
          <SettingsItemSwitch
            name="启用夜间模式"
            value={darkMode}
            onChange={handelDarkMode}
          />

          <SettingsItemSwitch
            name="禁止放大图片"
            value={disableZoom}
            onChange={handelDisableZoom}
          />

          <SettingsItem name="背景颜色">
            <input
              type="color"
              // TODO: 待实现
              // value={backgroundColor}
              onChange={handelBgColor}
              style={{ width: '2em', marginRight: '.4em' }}
            />
          </SettingsItem>
        </>
      );
    },
  ],
];
