import MdOutlineFormatTextdirectionLToR from '@material-design-icons/svg/round/format_textdirection_l_to_r.svg';
import MdOutlineFormatTextdirectionRToL from '@material-design-icons/svg/round/format_textdirection_r_to_l.svg';

import { createMemo, type Component, Show } from 'solid-js';

import { throttle } from 'throttle-debounce';
import { SettingsItem } from './components/SettingsItem';
import { SettingsItemSwitch } from './components/SettingsItemSwitch';
import {
  createStateSetFn,
  setOption,
  switchOption,
  updateImgLoadType,
} from './hooks/useStore/slice';
import {
  setImgTranslationEnbale,
  translatorOptions,
} from './hooks/useStore/slice/Translation';
import { setState, store } from './hooks/useStore';
import { needDarkMode } from '../../helper';

import classes from './index.module.css';
import { SettingsItemSelect } from './components/SettingsItemSelect';

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
          onChange={() => switchOption('scrollbar.enabled')}
        />
        <Show when={store.option.scrollbar.enabled}>
          <SettingsItemSwitch
            name="自动隐藏滚动条"
            value={store.option.scrollbar.autoHidden}
            onChange={() => switchOption('scrollbar.autoHidden')}
          />
          <SettingsItemSwitch
            name="显示图片加载状态"
            value={store.option.scrollbar.showProgress}
            onChange={() => switchOption('scrollbar.showProgress')}
          />
        </Show>
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
          onChange={() => switchOption('clickPage.enabled')}
        />
        <Show when={store.option.clickPage.enabled}>
          <SettingsItemSwitch
            name="左右反转点击区域"
            value={store.option.clickPage.overturn}
            onChange={() => switchOption('clickPage.overturn')}
          />
          <SettingsItemSwitch
            name="显示点击区域提示"
            value={store.showTouchArea}
            onChange={() => {
              setState((state) => {
                state.showTouchArea = !state.showTouchArea;
              });
            }}
          />
        </Show>
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
          onChange={() => switchOption('clickPageflipToNext')}
        />

        <SettingsItemSwitch
          name="左右翻页键交换"
          value={store.option.swapTurnPage}
          onChange={() => switchOption('swapTurnPage')}
        />
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
          onChange={() => switchOption('darkMode')}
        />

        <SettingsItemSwitch
          name="禁止放大图片"
          value={store.option.disableZoom}
          onChange={() => switchOption('disableZoom')}
        />

        <SettingsItemSwitch
          name="在结束页显示评论"
          value={store.option.showComment}
          onChange={() => switchOption('showComment')}
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
    '其他',
    () => (
      <>
        <SettingsItemSwitch
          name="始终加载所有图片"
          value={store.option.alwaysLoadAllImg}
          onChange={() => {
            switchOption('alwaysLoadAllImg');
            setState(updateImgLoadType);
          }}
        />

        <SettingsItemSwitch
          name="默认启用首页填充"
          value={store.option.firstPageFill}
          onChange={() => switchOption('firstPageFill')}
        />
      </>
    ),
  ],
  [
    '翻译',
    () => {
      /** 是否正在翻译全部图片 */
      const isTranslationAll = createMemo(() =>
        store.imgList.every(
          (img) =>
            img.translationType === 'show' || img.translationType === 'wait',
        ),
      );

      return (
        <>
          <SettingsItemSelect
            name="翻译服务器"
            options={[['禁用'], ['本地部署'], ['cotrans']]}
            value={store.option.translation.server}
            onChange={createStateSetFn('translation.server')}
          />

          <Show when={store.option.translation.server === 'cotrans'}>
            <blockquote>
              <p>
                将使用{' '}
                <a href="https://cotrans.touhou.ai" target="_blank">
                  Cotrans
                </a>{' '}
                提供的接口翻译图片，该服务器由维护者用爱发电自费维护
              </p>
              <p>
                所以还请<b>注意用量</b>，并去{' '}
                <a
                  href="https://github.com/zyddnys/manga-image-translator/blob/main/README_CN.md"
                  target="_blank"
                >
                  Github
                </a>{' '}
                上支持下
              </p>
              <p>更推荐使用本地部署的项目，不抢服务器资源也不需要排队</p>
            </blockquote>
          </Show>

          <Show when={store.option.translation.server !== '禁用'}>
            <SettingsItemSelect
              name="文本扫描清晰度"
              options={[
                ['S', '1024px'],
                ['M', '1536px'],
                ['L', '2048px'],
                ['X', '2560px'],
              ]}
              value={store.option.translation.options.size}
              onChange={createStateSetFn('translation.options.size')}
            />
            <SettingsItemSelect
              name="文本扫描器"
              options={[['default'], ['ctd', 'Comic Text Detector']]}
              value={store.option.translation.options.detector}
              onChange={createStateSetFn('translation.options.detector')}
            />
            <SettingsItemSelect
              name="翻译服务"
              options={translatorOptions()}
              value={store.option.translation.options.translator}
              onChange={createStateSetFn('translation.options.translator')}
            />
            <SettingsItemSelect
              name="渲染字体方向"
              options={[
                ['auto', '自动'],
                ['h', '水平'],
                ['v', '垂直'],
              ]}
              value={store.option.translation.options.direction}
              onChange={createStateSetFn('translation.options.direction')}
            />

            <SettingsItemSwitch
              name="忽略缓存强制重试"
              value={store.option.translation.forceRetry}
              onChange={() => switchOption('translation.forceRetry')}
            />

            <Show when={store.option.translation.server === '本地部署'}>
              <SettingsItemSwitch
                name="翻译全部图片"
                value={isTranslationAll()}
                onChange={() =>
                  setImgTranslationEnbale(
                    store.imgList.map((_, i) => i),
                    !isTranslationAll(),
                  )
                }
              />
            </Show>
          </Show>
        </>
      );
    },
  ],
];
