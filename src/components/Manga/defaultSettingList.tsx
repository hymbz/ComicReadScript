import MdOutlineFormatTextdirectionLToR from '@material-design-icons/svg/round/format_textdirection_l_to_r.svg';
import MdOutlineFormatTextdirectionRToL from '@material-design-icons/svg/round/format_textdirection_r_to_l.svg';

import { type Component } from 'solid-js';

import { throttle } from 'throttle-debounce';
import { SettingsItem } from './components/SettingsItem';
import { SettingsItemSwitch } from './components/SettingsItemSwitch';
import { SettingHotKeys } from './components/SettingHotKeys';
import { SettingTranslation } from './components/SettingTranslation';
import {
  createStateSetFn,
  setOption,
  updateImgLoadType,
} from './hooks/useStore/slice';
import { setState, store } from './hooks/useStore';
import { needDarkMode } from '../../helper';

import classes from './index.module.css';
import { SettingsShowItem } from './components/SettingsShowItem';

export type SettingList = (
  | [string, Component]
  | [string, Component, boolean]
)[];

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
          on:click={() =>
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
          onChange={createStateSetFn('scrollbar.enabled')}
        />
        <SettingsShowItem when={store.option.scrollbar.enabled}>
          <SettingsItemSwitch
            name="自动隐藏滚动条"
            value={store.option.scrollbar.autoHidden}
            onChange={createStateSetFn('scrollbar.autoHidden')}
          />
          <SettingsItemSwitch
            name="显示图片加载状态"
            value={store.option.scrollbar.showProgress}
            onChange={createStateSetFn('scrollbar.showProgress')}
          />
        </SettingsShowItem>
      </>
    ),
  ],
  [
    '操作',
    () => (
      <>
        <SettingsItemSwitch
          name="翻页至上/下一话"
          value={store.option.flipToNext}
          onChange={createStateSetFn('flipToNext')}
        />

        <SettingsItemSwitch
          name="启用点击翻页"
          value={store.option.clickPage.enabled}
          onChange={createStateSetFn('clickPage.enabled')}
        />
        <SettingsShowItem when={store.option.clickPage.enabled}>
          <SettingsItemSwitch
            name="左右反转点击区域"
            value={store.option.clickPage.overturn}
            onChange={createStateSetFn('clickPage.overturn')}
          />
          <SettingsItemSwitch
            name="显示点击区域"
            value={store.showTouchArea}
            onChange={() => {
              setState((state) => {
                state.showTouchArea = !state.showTouchArea;
              });
            }}
          />
        </SettingsShowItem>
      </>
    ),
  ],
  [
    '显示',
    () => (
      <>
        <SettingsItemSwitch
          name="启用夜间模式"
          value={store.option.darkMode}
          onChange={createStateSetFn('darkMode')}
        />

        <SettingsItemSwitch
          name="禁止放大图片"
          value={store.option.disableZoom}
          onChange={createStateSetFn('disableZoom')}
        />
      </>
    ),
  ],
  ['快捷键', SettingHotKeys, true],
  ['翻译', SettingTranslation, true],
  [
    '其他',
    () => (
      <>
        <SettingsItemSwitch
          name="始终加载所有图片"
          value={store.option.alwaysLoadAllImg}
          onChange={(val) => {
            setOption((draftOption) => {
              draftOption.alwaysLoadAllImg = val;
            });
            setState(updateImgLoadType);
          }}
        />

        <SettingsItemSwitch
          name="默认启用首页填充"
          value={store.option.firstPageFill}
          onChange={createStateSetFn('firstPageFill')}
        />

        <SettingsItemSwitch
          name="在结束页显示评论"
          value={store.option.showComment}
          onChange={createStateSetFn('showComment')}
        />

        <SettingsItemSwitch
          name="左右翻页键反转"
          value={store.option.swapTurnPage}
          onChange={createStateSetFn('swapTurnPage')}
        />

        <SettingsItem name="背景颜色">
          <input
            type="color"
            style={{ width: '2em', 'margin-right': '.4em' }}
            value={
              store.option.customBackground ??
              (store.option.darkMode ? '#000000' : '#ffffff')
            }
            on:input={throttle(20, (e) => {
              if (!e.target.value) return;
              setOption((draftOption) => {
                // 在拉到纯黑或纯白时改回初始值
                draftOption.customBackground =
                  e.target.value === '#000000' || e.target.value === '#ffffff'
                    ? undefined
                    : e.target.value;
                if (draftOption.customBackground)
                  draftOption.darkMode = needDarkMode(
                    draftOption.customBackground,
                  );
              });
            })}
          />
        </SettingsItem>
      </>
    ),
    true,
  ],
];
