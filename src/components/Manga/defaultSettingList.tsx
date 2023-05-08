import MdOutlineFormatTextdirectionLToR from '@material-design-icons/svg/round/format_textdirection_l_to_r.svg';
import MdOutlineFormatTextdirectionRToL from '@material-design-icons/svg/round/format_textdirection_r_to_l.svg';

import type { Component } from 'solid-js';

import { SettingsItem } from './components/SettingsItem';
import { SettingsItemSwitch } from './components/SettingsItemSwitch';
import { setOption } from './hooks/useStore/slice';
import { setState, store } from './hooks/useStore';
import { needDarkMode } from '../../helper';

import classes from './index.module.css';

export type SettingList = [string, Component][];

/** 默认菜单项 */
export const defaultSettingList: SettingList = [
  [
    '阅读方向',
    () => {
      const isRtl = () => store.option.dir === 'rtl';

      const toggleEditDir = () =>
        setOption((draftOption) => {
          draftOption.dir = draftOption.dir === 'rtl' ? 'ltr' : 'rtl';
        });

      return (
        <SettingsItem name={isRtl() ? '从右到左（日漫）' : '从左到右（美漫）'}>
          <button
            class={classes.SettingsItemIconButton}
            type="button"
            onClick={toggleEditDir}
          >
            {isRtl() ? (
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
      const toggleEnable = () => {
        setOption((draftOption) => {
          draftOption.scrollbar.enabled = !draftOption.scrollbar.enabled;
        });
      };

      const toggleAutoHidden = () => {
        setOption((draftOption) => {
          draftOption.scrollbar.autoHidden = !draftOption.scrollbar.autoHidden;
        });
      };

      const toggleShowProgress = () => {
        setOption((draftOption) => {
          draftOption.scrollbar.showProgress =
            !draftOption.scrollbar.showProgress;
        });
      };

      return (
        <>
          <SettingsItemSwitch
            name="显示滚动条"
            value={store.option.scrollbar.enabled}
            onChange={toggleEnable}
          />
          <SettingsItemSwitch
            name="自动隐藏滚动条"
            value={store.option.scrollbar.autoHidden}
            classList={{ [classes.hidden]: store.option.scrollbar.enabled }}
            onChange={toggleAutoHidden}
          />
          <SettingsItemSwitch
            name="显示图片加载状态"
            value={store.option.scrollbar.showProgress}
            classList={{ [classes.hidden]: store.option.scrollbar.enabled }}
            onChange={toggleShowProgress}
          />
        </>
      );
    },
  ],
  [
    '点击翻页',
    () => {
      const toggleClickPages = () => {
        setOption((draftOption) => {
          draftOption.clickPage.enabled = !draftOption.clickPage.enabled;
        });
      };

      const toggleShowTouchArea = () => {
        setState((state) => {
          state.showTouchArea = !state.showTouchArea;
        });
      };

      const toggleOverturn = () => {
        setOption((draftOption) => {
          draftOption.clickPage.overturn = !draftOption.clickPage.overturn;
        });
      };

      return (
        <>
          <SettingsItemSwitch
            name="启用点击翻页"
            value={store.option.clickPage.enabled}
            onChange={toggleClickPages}
          />
          <SettingsItemSwitch
            name="左右反转点击区域"
            value={store.option.clickPage.overturn}
            classList={{ [classes.hidden]: store.option.clickPage.enabled }}
            onChange={toggleOverturn}
          />
          <SettingsItemSwitch
            name="显示点击区域提示"
            value={store.showTouchArea}
            classList={{ [classes.hidden]: store.option.clickPage.enabled }}
            onChange={toggleShowTouchArea}
          />
        </>
      );
    },
  ],
  [
    '其他',
    () => {
      const handleDarkMode = () => {
        setOption((draftOption) => {
          draftOption.darkMode = !draftOption.darkMode;
        });
      };

      const handleBgColor: EventHandler<HTMLInputElement>['onChange'] = (e) => {
        setOption((draftOption) => {
          // 在拉到纯黑或纯白时改回初始值
          draftOption.customBackground =
            e.target.value === '#000000' || e.target.value === '#ffffff'
              ? undefined
              : e.target.value;
          draftOption.darkMode = needDarkMode(e.target.value);
        });
      };

      const handleDisableZoom = () => {
        setOption((draftOption) => {
          draftOption.disableZoom = !draftOption.disableZoom;
        });
      };

      const handleFlipToNext = () => {
        setOption((draftOption) => {
          draftOption.flipToNext = !draftOption.flipToNext;
        });
      };

      return (
        <>
          <SettingsItemSwitch
            name="翻页至上/下一话"
            value={store.option.flipToNext}
            onChange={handleFlipToNext}
          />

          <SettingsItemSwitch
            name="启用夜间模式"
            value={store.option.darkMode}
            onChange={handleDarkMode}
          />

          <SettingsItemSwitch
            name="禁止放大图片"
            value={store.option.disableZoom}
            onChange={handleDisableZoom}
          />

          <SettingsItem name="背景颜色">
            <input
              type="color"
              value={
                store.option.customBackground ??
                (store.option.darkMode ? 'black' : 'white')
              }
              onChange={handleBgColor}
              style={{ width: '2em', 'margin-right': '.4em' }}
            />
          </SettingsItem>
        </>
      );
    },
  ],
  [
    '关于',
    () => (
      <>
        <SettingsItem name="版本号">
          <a href="https://github.com/hymbz/ComicReadScript">0.0.1</a>
        </SettingsItem>
        <SettingsItem name="反馈">
          <div>
            <a
              href="https://github.com/hymbz/ComicReadScript/issues"
              style={{ 'margin-right': '.5em' }}
            >
              Github
            </a>
            <a href="https://greasyfork.org/zh-CN/scripts/374903-comicread/feedback">
              Greasy Fork
            </a>
          </div>
        </SettingsItem>
      </>
    ),
  ],
];
