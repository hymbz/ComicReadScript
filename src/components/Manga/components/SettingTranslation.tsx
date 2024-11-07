import { createSignal, Show, type Component } from 'solid-js';
import { createEffectOn, descRange, extractRange, t } from 'helper';

import { createStateSetFn, imgList, setOption } from '../actions';
import {
  isTranslatingToEnd,
  isTranslatingAll,
  translateToEnd,
  translateAll,
  translatorOptions,
  setImgTranslationEnbale,
} from '../actions/translation';
import { store } from '../store';
import { updateSelfhostedOptions } from '../actions/translation/selfhosted';
import { RangeInput } from '../../RangeInput';
import classes from '../index.module.css';

import { SettingsItemSelect } from './SettingsItemSelect';
import { SettingsItemSwitch } from './SettingsItemSwitch';
import { SettingsShowItem } from './SettingsShowItem';
import { SettingsItem } from './SettingsItem';

const TranslateRange: Component = () => {
  const [rangeText, setRangeText] = createSignal('');

  createEffectOn(rangeText, () => {
    const imgImgs = extractRange(rangeText(), store.imgList.length);
    setImgTranslationEnbale(imgImgs, true);

    const closeImgs: number[] = [];
    for (let i = 0; i < store.imgList.length; i++)
      if (!imgImgs.has(i)) closeImgs.push(i);
    setImgTranslationEnbale(closeImgs, false);

    setRangeText(descRange(imgImgs, store.imgList.length));
  });

  // 实时更新翻译范围
  createEffectOn(
    () => {
      const list = new Set<number>();
      for (const [i, img] of imgList().entries()) {
        switch (img.translationType) {
          case 'error':
          case 'show':
          case 'wait':
            list.add(i);
            break;
        }
      }
      return list;
    },
    (translationImgs) => {
      setRangeText(descRange(translationImgs, store.imgList.length));
    },
  );

  return (
    <>
      <SettingsItem name={t('setting.translation.range')} />
      <RangeInput
        class={classes.SettingsItem}
        placeholder={t('other.page_range')}
        value={rangeText()}
        onChange={setRangeText}
      />
    </>
  );
};

export const SettingTranslation = () => (
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
        onClick={() => updateSelfhostedOptions(false)}
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

      <SettingsItemSwitch
        name={t('setting.translation.options.onlyDownloadTranslated')}
        value={store.option.translation.onlyDownloadTranslated}
        onChange={createStateSetFn('translation.onlyDownloadTranslated')}
      />

      <Show when={store.option.translation.server === 'selfhosted'}>
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

        <SettingsItemSwitch
          name={t('setting.translation.translate_all')}
          value={isTranslatingAll()}
          onChange={translateAll}
        />
        <SettingsItemSwitch
          name={t('setting.translation.translate_to_end')}
          value={isTranslatingToEnd()}
          onChange={translateToEnd}
        />
        <TranslateRange />
      </Show>
    </SettingsShowItem>
  </>
);
