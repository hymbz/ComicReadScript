import MdOutlineFormatTextdirectionLToR from '@material-design-icons/svg/round/format_textdirection_l_to_r.svg';
import MdOutlineFormatTextdirectionRToL from '@material-design-icons/svg/round/format_textdirection_r_to_l.svg';

import type { Component } from 'solid-js';

import { throttle } from 'throttle-debounce';
import { SettingsItem } from './components/SettingsItem';
import { SettingsItemSwitch } from './components/SettingsItemSwitch';
import { setOption, updateImgLoadType } from './hooks/useStore/slice';
import { setState, store } from './hooks/useStore';
import { needDarkMode } from '../../helper';

import classes from './index.module.css';

export type SettingList = [string, Component][];

/** 默认菜单项 */
export const defaultSettingList: SettingList = [
  [
    '阅读方向',
    () => (
      <SettingsItem
        name={
          store.option.dir === 'rtl' ? '从右到左（日漫）' : '从左到右（美漫）'
        }
      >
        <button
          class={classes.SettingsItemIconButton}
          type="button"
          onClick={() =>
            setOption((draftOption) => {
              draftOption.dir = draftOption.dir === 'rtl' ? 'ltr' : 'rtl';
            })
          }
        >
          {store.option.dir === 'rtl' ? (
            <MdOutlineFormatTextdirectionRToL />
          ) : (
            <MdOutlineFormatTextdirectionLToR />
          )}
        </button>
      </SettingsItem>
    ),
  ],
  [
    '滚动条',
    () => (
      <>
        <SettingsItemSwitch
          name="显示滚动条"
          value={store.option.scrollbar.enabled}
          onChange={() => {
            setOption((draftOption) => {
              draftOption.scrollbar.enabled = !draftOption.scrollbar.enabled;
            });
          }}
        />
        <SettingsItemSwitch
          name="自动隐藏滚动条"
          value={store.option.scrollbar.autoHidden}
          classList={{ [classes.hidden]: !store.option.scrollbar.enabled }}
          onChange={() => {
            setOption((draftOption) => {
              draftOption.scrollbar.autoHidden =
                !draftOption.scrollbar.autoHidden;
            });
          }}
        />
        <SettingsItemSwitch
          name="显示图片加载状态"
          value={store.option.scrollbar.showProgress}
          classList={{ [classes.hidden]: !store.option.scrollbar.enabled }}
          onChange={() => {
            setOption((draftOption) => {
              draftOption.scrollbar.showProgress =
                !draftOption.scrollbar.showProgress;
            });
          }}
        />
      </>
    ),
  ],
  [
    '点击翻页',
    () => (
      <>
        <SettingsItemSwitch
          name="启用点击翻页"
          value={store.option.clickPage.enabled}
          onChange={() => {
            setOption((draftOption) => {
              draftOption.clickPage.enabled = !draftOption.clickPage.enabled;
            });
          }}
        />
        <SettingsItemSwitch
          name="左右反转点击区域"
          value={store.option.clickPage.overturn}
          classList={{ [classes.hidden]: !store.option.clickPage.enabled }}
          onChange={() => {
            setOption((draftOption) => {
              draftOption.clickPage.overturn = !draftOption.clickPage.overturn;
            });
          }}
        />
        <SettingsItemSwitch
          name="显示点击区域提示"
          value={store.showTouchArea}
          classList={{ [classes.hidden]: !store.option.clickPage.enabled }}
          onChange={() => {
            setState((state) => {
              state.showTouchArea = !state.showTouchArea;
            });
          }}
        />
      </>
    ),
  ],
  [
    '其他',
    () => (
      <>
        <SettingsItemSwitch
          name="翻页至上/下一话"
          value={store.option.flipToNext}
          onChange={() => {
            setOption((draftOption) => {
              draftOption.flipToNext = !draftOption.flipToNext;
            });
          }}
        />

        <SettingsItemSwitch
          name="启用夜间模式"
          value={store.option.darkMode}
          onChange={() => {
            setOption((draftOption) => {
              draftOption.darkMode = !draftOption.darkMode;
            });
          }}
        />

        <SettingsItemSwitch
          name="始终加载所有图片"
          value={store.option.alwaysLoadAllImg}
          onChange={() => {
            setOption((draftOption) => {
              draftOption.alwaysLoadAllImg = !draftOption.alwaysLoadAllImg;
            });
            setState(updateImgLoadType);
          }}
        />

        <SettingsItemSwitch
          name="禁止放大图片"
          value={store.option.disableZoom}
          onChange={() => {
            setOption((draftOption) => {
              draftOption.disableZoom = !draftOption.disableZoom;
            });
          }}
        />

        <SettingsItemSwitch
          name="左右翻页键交换"
          value={store.option.swapTurnPage}
          onChange={() => {
            setOption((draftOption) => {
              draftOption.swapTurnPage = !draftOption.swapTurnPage;
            });
          }}
        />

        <SettingsItem name="背景颜色">
          <input
            type="color"
            style={{ width: '2em', 'margin-right': '.4em' }}
            value={
              store.option.customBackground ??
              (store.option.darkMode ? '#000000' : '#ffffff')
            }
            onInput={throttle(20, (e) => {
              setOption((draftOption) => {
                // 在拉到纯黑或纯白时改回初始值
                draftOption.customBackground =
                  e.target.value === '#000000' || e.target.value === '#ffffff'
                    ? undefined
                    : e.target.value;
                draftOption.darkMode = needDarkMode(e.target.value);
              });
            })}
          />
        </SettingsItem>
      </>
    ),
  ],
  [
    '关于',
    () => (
      <>
        <SettingsItem name="版本号">
          <a href="https://github.com/hymbz/ComicReadScript" target="_blank">
            0.0.1
          </a>
        </SettingsItem>
        <SettingsItem name="反馈">
          <div>
            <a
              href="https://github.com/hymbz/ComicReadScript/issues"
              target="_blank"
              style={{ 'margin-right': '.5em' }}
            >
              Github
            </a>
            <a
              href="https://greasyfork.org/zh-CN/scripts/374903-comicread/feedback"
              target="_blank"
            >
              Greasy Fork
            </a>
          </div>
        </SettingsItem>
      </>
    ),
  ],
];
