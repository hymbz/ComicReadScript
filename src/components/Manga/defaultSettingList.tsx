import MdOutlineFormatTextdirectionLToR from '@material-design-icons/svg/round/format_textdirection_l_to_r.svg';
import MdOutlineFormatTextdirectionRToL from '@material-design-icons/svg/round/format_textdirection_r_to_l.svg';
import { Show, type Component } from 'solid-js';
import { lang, setLang, t, clamp, throttle, needDarkMode } from 'helper';

import { SettingsItem } from './components/SettingsItem';
import { SettingsItemSwitch } from './components/SettingsItemSwitch';
import { SettingHotkeys } from './components/SettingHotkeys';
import { SettingTranslation } from './components/SettingTranslation';
import { SettingsShowItem } from './components/SettingsShowItem';
import { SettingsItemSelect } from './components/SettingsItemSelect';
import {
  autoPageNum,
  createStateSetFn,
  getImgEle,
  saveScrollProgress,
  setOption,
  switchDir,
  switchFitToWidth,
  updateImgLoadType,
  zoom,
  zoomScrollModeImg,
} from './actions';
import { _setState, store } from './store';
import classes from './index.module.css';
import { SettingsItemNumber } from './components/SettingsItemNumber';
import { areaArrayMap } from './components/TouchArea';
import { handleImgRecognition } from './actions/imageRecognition';

export type SettingList = Array<
  [string, Component] | [string, Component, boolean]
>;

/** 默认菜单项 */
export const defaultSettingList: () => SettingList = () => [
  [
    t('setting.option.paragraph_dir'),
    () => (
      <SettingsItem
        name={
          store.option.dir === 'rtl'
            ? t('setting.option.dir_rtl')
            : t('setting.option.dir_ltr')
        }
      >
        <button
          class={classes.SettingsItemIconButton}
          type="button"
          on:click={switchDir}
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
    t('setting.option.paragraph_scrollbar'),
    () => (
      <>
        <SettingsItemSelect
          name={t('setting.option.scrollbar_position')}
          options={[
            ['auto', t('setting.option.scrollbar_position_auto')],
            ['right', t('setting.option.scrollbar_position_right')],
            ['top', t('setting.option.scrollbar_position_top')],
            ['bottom', t('setting.option.scrollbar_position_bottom')],
            ['hidden', t('setting.option.scrollbar_position_hidden')],
          ]}
          value={store.option.scrollbar.position}
          onChange={createStateSetFn('scrollbar.position')}
        />
        <SettingsShowItem when={store.option.scrollbar.position !== 'hidden'}>
          <Show when={!store.isMobile}>
            <SettingsItemSwitch
              name={t('setting.option.scrollbar_auto_hidden')}
              value={store.option.scrollbar.autoHidden}
              onChange={createStateSetFn('scrollbar.autoHidden')}
            />
          </Show>
          <SettingsItemSwitch
            name={t('setting.option.scrollbar_show_img_status')}
            value={store.option.scrollbar.showImgStatus}
            onChange={createStateSetFn('scrollbar.showImgStatus')}
          />
          <Show when={store.option.scrollMode.enabled}>
            <SettingsItemSwitch
              name={t('setting.option.scrollbar_easy_scroll')}
              value={store.option.scrollbar.easyScroll}
              onChange={createStateSetFn('scrollbar.easyScroll')}
            />
          </Show>
        </SettingsShowItem>
      </>
    ),
  ],
  [
    t('setting.option.paragraph_operation'),
    () => (
      <>
        <SettingsItemSwitch
          name={t('setting.option.jump_to_next_chapter')}
          value={store.option.jumpToNext}
          onChange={createStateSetFn('jumpToNext')}
        />

        <SettingsItemSwitch
          name={t('setting.option.click_page_turn_enabled')}
          value={store.option.clickPageTurn.enabled}
          onChange={createStateSetFn('clickPageTurn.enabled')}
        />
        <SettingsShowItem when={store.option.clickPageTurn.enabled}>
          <SettingsItemSelect
            name={t('setting.option.click_page_turn_area')}
            options={Object.keys(areaArrayMap).map(
              (key) => [key, t(`touch_area.type.${key}`)] as [string, string],
            )}
            value={store.option.clickPageTurn.area}
            onChange={createStateSetFn('clickPageTurn.area')}
          />
          <SettingsItemSwitch
            name={t('setting.option.click_page_turn_swap_area')}
            value={store.option.clickPageTurn.reverse}
            onChange={createStateSetFn('clickPageTurn.reverse')}
          />
        </SettingsShowItem>

        <SettingsItemSwitch
          name={t('setting.option.show_clickable_area')}
          value={store.show.touchArea}
          onChange={() => _setState('show', 'touchArea', !store.show.touchArea)}
        />
      </>
    ),
  ],
  [
    t('setting.option.paragraph_display'),
    () => (
      <>
        <SettingsItemSwitch
          name={t('setting.option.dark_mode')}
          value={store.option.darkMode}
          onChange={createStateSetFn('darkMode')}
        />

        <Show when={!store.option.scrollMode.enabled}>
          <SettingsItemSwitch
            name={t('setting.option.disable_auto_enlarge')}
            value={store.option.disableZoom}
            onChange={createStateSetFn('disableZoom')}
          />
        </Show>

        <SettingsItemSwitch
          name={t('setting.option.auto_switch_page_mode')}
          value={store.option.autoSwitchPageMode}
          onChange={(val) => {
            setOption((draftOption, state) => {
              draftOption.autoSwitchPageMode = val;
              state.option.pageNum = val ? 0 : autoPageNum();
            });
          }}
        />

        <Show when={store.option.scrollMode.enabled}>
          <SettingsItemSwitch
            name={t('setting.option.abreast_mode')}
            value={store.option.scrollMode.abreastMode}
            onChange={(val) => {
              const jump = saveScrollProgress();
              setOption((draftOption) => {
                draftOption.scrollMode.abreastMode = val;
              });
              jump();
            }}
          />
          <SettingsItemNumber
            name={t('setting.option.scroll_mode_img_scale')}
            maxLength={3}
            suffix="%"
            step={5}
            onChange={(val) => {
              if (!Number.isNaN(val)) zoomScrollModeImg(val / 100, true);
            }}
            value={Math.round(store.option.scrollMode.imgScale * 100)}
          />
          <SettingsItemNumber
            name={t('setting.option.scroll_mode_img_spacing')}
            maxLength={5}
            onChange={(val) => {
              if (Number.isNaN(val)) return;
              const newVal = clamp(0, val, Number.POSITIVE_INFINITY);
              setOption((draftOption) => {
                draftOption.scrollMode.spacing = newVal;
              });
            }}
            value={Math.round(store.option.scrollMode.spacing)}
          />
          <Show when={store.option.scrollMode.abreastMode}>
            <SettingsItemNumber
              name={t('setting.option.abreast_duplicate')}
              maxLength={3}
              suffix="%"
              step={5}
              onChange={(val) => {
                if (Number.isNaN(val)) return;
                setOption((draftOption) => {
                  const newVal = clamp(0, val / 100, 0.95);
                  draftOption.scrollMode.abreastDuplicate = newVal;
                });
              }}
              value={Math.round(store.option.scrollMode.abreastDuplicate * 100)}
            />
          </Show>
          <Show when={!store.option.scrollMode.abreastMode}>
            <SettingsItemSwitch
              name={t('setting.option.fit_to_width')}
              value={store.option.scrollMode.fitToWidth}
              onChange={switchFitToWidth}
            />
          </Show>
        </Show>

        <Show when={!store.option.scrollMode.enabled}>
          <SettingsItemNumber
            name={t('setting.option.zoom')}
            maxLength={3}
            suffix="%"
            step={5}
            onChange={(val) => Number.isNaN(val) || zoom(val)}
            value={Math.round(store.option.zoom.ratio)}
          />
        </Show>
      </>
    ),
  ],
  [t('setting.option.paragraph_hotkeys'), SettingHotkeys, true],
  [
    t('setting.option.img_recognition'),
    () => (
      <>
        <SettingsItemSwitch
          name={t('other.enabled')}
          value={store.option.imgRecognition.enabled}
          onChange={() =>
            setOption((draftOption, state) => {
              const enabled = !draftOption.imgRecognition.enabled;
              draftOption.imgRecognition.enabled = enabled;

              if (!enabled) return;
              for (const img of Object.values(state.imgMap))
                if (!img.blobUrl) img.loadType = 'wait';
              updateImgLoadType();
            })
          }
        />

        <Show when={typeof Worker === 'undefined'}>
          <blockquote>
            {/* eslint-disable-next-line solid/no-innerhtml */}
            <p innerHTML={t('setting.option.img_recognition_warn')} />
          </blockquote>
        </Show>

        <Show when={!store.supportWorker}>
          <blockquote>
            {/* eslint-disable-next-line solid/no-innerhtml */}
            <p innerHTML={t('setting.option.img_recognition_warn_2')} />
          </blockquote>
        </Show>

        <SettingsShowItem when={store.option.imgRecognition.enabled}>
          <SettingsItemSwitch
            name={t('setting.option.img_recognition_background')}
            value={store.option.imgRecognition.background}
            onChange={() =>
              setOption((draftOption, state) => {
                const enabled = !draftOption.imgRecognition.background;
                draftOption.imgRecognition.background = enabled;

                if (!enabled) return;
                for (const img of Object.values(state.imgMap)) {
                  if (img.background === undefined && img.loadType === 'loaded')
                    handleImgRecognition(getImgEle(img.src)!, img.src);
                }
              })
            }
          />
          <SettingsItemSwitch
            name={t('setting.option.img_recognition_pageFill')}
            value={store.option.imgRecognition.pageFill}
            onChange={() =>
              setOption((draftOption, state) => {
                const enabled = !draftOption.imgRecognition.pageFill;
                draftOption.imgRecognition.pageFill = enabled;

                if (!enabled) return;
                for (const img of Object.values(state.imgMap)) {
                  if (
                    img.blankMargin === undefined &&
                    img.loadType === 'loaded'
                  )
                    handleImgRecognition(getImgEle(img.src)!, img.src);
                }
              })
            }
          />
        </SettingsShowItem>
      </>
    ),
    true,
  ],
  [t('setting.option.paragraph_translation'), SettingTranslation, true],
  [
    t('setting.option.paragraph_other'),
    () => (
      <>
        <SettingsItemSwitch
          name={t('setting.option.always_load_all_img')}
          value={store.option.alwaysLoadAllImg}
          onChange={createStateSetFn('alwaysLoadAllImg')}
        />

        <SettingsItemSwitch
          name={t('setting.option.first_page_fill')}
          value={store.option.firstPageFill}
          onChange={createStateSetFn('firstPageFill')}
        />

        <SettingsItemSwitch
          name={t('setting.option.show_comments')}
          value={store.option.showComment}
          onChange={createStateSetFn('showComment')}
        />

        <SettingsItemSwitch
          name={t('setting.option.swap_page_turn_key')}
          value={store.option.swapPageTurnKey}
          onChange={createStateSetFn('swapPageTurnKey')}
        />

        <SettingsItemNumber
          name={t('setting.option.preload_page_num')}
          maxLength={5}
          onChange={(val) => {
            if (Number.isNaN(val)) return;
            setOption((draftOption) => {
              draftOption.preloadPageNum = clamp(0, val, 99_999);
            });
          }}
          value={store.option.preloadPageNum}
        />

        <SettingsItem name={t('setting.option.background_color')}>
          <input
            type="color"
            style={{ width: '2em', 'margin-right': '.4em' }}
            value={
              store.option.customBackground ??
              (store.option.darkMode ? '#000000' : '#ffffff')
            }
            on:input={throttle((e) => {
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
            }, 20)}
          />
        </SettingsItem>

        <SettingsItemSelect
          name={t('setting.language')}
          options={[
            ['zh', '中文'],
            ['en', 'English'],
            ['ru', 'Русский'],
          ]}
          value={lang()}
          onChange={setLang}
        />
      </>
    ),
    true,
  ],
];
