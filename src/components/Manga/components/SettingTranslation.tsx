import { createMemo, Show } from 'solid-js';

import { t } from 'helper/i18n';
import { SettingsItemSwitch } from './SettingsItemSwitch';
import { SettingsItemSelect } from './SettingsItemSelect';
import { activeImgIndex, createStateSetFn, setOption } from '../actions';
import {
  setImgTranslationEnbale,
  translatorOptions,
} from '../actions/translation';
import { setState, store } from '../store';

import classes from '../index.module.css';
import { SettingsShowItem } from './SettingsShowItem';

export const SettingTranslation = () => {
  const isTranslationEnable = createMemo(
    () =>
      store.option.translation.server !== 'disable' &&
      translatorOptions().length > 0,
  );

  /** 是否正在翻译全部图片 */
  const isTranslationAll = createMemo(
    () =>
      isTranslationEnable() &&
      store.imgList.every(
        (img) =>
          img.translationType === 'show' || img.translationType === 'wait',
      ),
  );

  /** 是否正在翻译当前页以后的全部图片 */
  const isTranslationAfterCurrent = createMemo(
    () =>
      isTranslationEnable() &&
      store.imgList
        .slice(activeImgIndex())
        .every(
          (img) =>
            img.translationType === 'show' || img.translationType === 'wait',
        ),
  );

  return (
    <>
      <SettingsItemSelect
        name={t('setting.translation.server')}
        options={[
          ['disable', t('other.disable')],
          ['selfhosted', t('setting.translation.server_selfhosted')],
          ['cotrans'],
        ]}
        value={store.option.translation.server}
        onChange={createStateSetFn('translation.server')}
      />

      <SettingsShowItem when={store.option.translation.server === 'cotrans'}>
        {/* eslint-disable-next-line solid/no-innerhtml */}
        <blockquote innerHTML={t('setting.translation.cotrans_tip')} />
      </SettingsShowItem>

      <SettingsShowItem when={store.option.translation.server !== 'disable'}>
        <SettingsItemSelect
          name={t('setting.translation.options.detection_resolution')}
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
          name={t('setting.translation.options.text_detector')}
          options={[['default'], ['ctd', 'Comic Text Detector']]}
          value={store.option.translation.options.detector}
          onChange={createStateSetFn('translation.options.detector')}
        />
        <SettingsItemSelect
          name={t('setting.translation.options.translator')}
          options={translatorOptions()}
          value={store.option.translation.options.translator}
          onChange={createStateSetFn('translation.options.translator')}
          onClick={() => {
            if (store.option.translation.server !== 'selfhosted') return;
            // 通过手动触发变更，以便在点击时再获取一下翻译列表
            setState((state) => {
              state.option.translation.server = 'disable';
              state.option.translation.server = 'selfhosted';
            });
          }}
        />
        <SettingsItemSelect
          name={t('setting.translation.options.direction')}
          options={[
            ['auto', t('setting.translation.options.direction_auto')],
            ['h', t('setting.translation.options.direction_horizontal')],
            ['v', t('setting.translation.options.direction_vertical')],
          ]}
          value={store.option.translation.options.direction}
          onChange={createStateSetFn('translation.options.direction')}
        />
        <SettingsItemSelect
          name={t('setting.translation.options.target_language')}
          options={[
            ['CHS', '简体中文'],
            ['CHT', '繁體中文'],
            ['JPN', '日本語'],
            ['ENG', 'English'],
            ['KOR', '한국어'],
            ['VIN', 'Tiếng Việt'],
            ['CSY', 'čeština'],
            ['NLD', 'Nederlands'],
            ['FRA', 'français'],
            ['DEU', 'Deutsch'],
            ['HUN', 'magyar nyelv'],
            ['ITA', 'italiano'],
            ['PLK', 'polski'],
            ['PTB', 'português'],
            ['ROM', 'limba română'],
            ['RUS', 'русский язык'],
            ['ESP', 'español'],
            ['TRK', 'Türk dili'],
          ]}
          value={store.option.translation.options.targetLanguage}
          onChange={createStateSetFn('translation.options.targetLanguage')}
        />

        <SettingsItemSwitch
          name={t('setting.translation.options.forceRetry')}
          value={store.option.translation.forceRetry}
          onChange={createStateSetFn('translation.forceRetry')}
        />

        <Show when={store.option.translation.server === 'selfhosted'}>
          <SettingsItemSwitch
            name={t('setting.translation.translate_all_img')}
            value={isTranslationAll()}
            onChange={() => {
              setImgTranslationEnbale(
                store.imgList.map((_, i) => i),
                !isTranslationAll(),
              );
            }}
          />

          <SettingsItemSwitch
            name={t('setting.translation.translate_after_current')}
            value={isTranslationAfterCurrent()}
            onChange={() => {
              setImgTranslationEnbale(
                store.pageList.slice(store.activePageIndex).flat(),
                !isTranslationAfterCurrent(),
              );
            }}
          />

          <SettingsItemSwitch
            name={t('setting.translation.options.localUrl')}
            value={store.option.translation.localUrl !== undefined}
            onChange={(val) => {
              setOption((draftOption) => {
                draftOption.translation.localUrl = val ? '' : undefined;
              });
            }}
          />

          <Show when={store.option.translation.localUrl !== undefined}>
            <input
              type="url"
              class={classes.SettingsItem}
              value={store.option.translation.localUrl}
              onChange={(e) => {
                setOption((draftOption) => {
                  // 删掉末尾的斜杠
                  const url = e.target.value.replace(/\/$/, '');
                  draftOption.translation.localUrl = url;
                });
              }}
            />
          </Show>
        </Show>

        <SettingsItemSwitch
          name={t('setting.translation.options.onlyDownloadTranslated')}
          value={store.option.translation.onlyDownloadTranslated}
          onChange={createStateSetFn('translation.onlyDownloadTranslated')}
        />
      </SettingsShowItem>
    </>
  );
};
