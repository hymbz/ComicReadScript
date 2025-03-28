import { createSignal, Show, type Component } from 'solid-js';
import { createEffectOn, descRange, extractRange, t } from 'helper';

import {
  bindOption as _bindOption,
  imgList,
  setOption,
  type SetOptionsFunction,
} from '../actions';
import {
  isTranslatingToEnd,
  isTranslatingAll,
  translateToEnd,
  translateAll,
  translatorOptions,
  setImgTranslationEnbale,
  translationImgs,
} from '../actions/translation';
import { store } from '../store';
import { updateSelfhostedOptions } from '../actions/translation/selfhosted';
import { RangeInput } from '../../RangeInput';
import classes from '../index.module.css';
import type { Option } from '../store/option';

import { SettingsItemSelect } from './SettingsItemSelect';
import { SettingsItemSwitch } from './SettingsItemSwitch';
import { SettingsItemNumber } from './SettingsItemNumber';
import { SettingsItem } from './SettingsItem';

const bindOption: SetOptionsFunction<Option['translation']> = (
  ...args: [any]
) => _bindOption('translation', ...args);

const TranslateRange: Component = () => {
  const [rangeText, setRangeText] = createSignal('');

  createEffectOn(rangeText, () => {
    const imgImgs = extractRange(rangeText(), store.imgList.length);

    const openImgs = [...imgImgs].filter((i) => {
      // 过滤掉翻译完成和等待翻译的图片，避免因为范围变化而重新发起翻译
      switch (imgList()[i].translationType) {
        case 'show':
        case 'wait':
          return false;
        default:
          return true;
      }
    });
    if (openImgs.length > 0) setImgTranslationEnbale(openImgs, true);

    const closeImgs = new Set<number>();
    for (let i = 0; i < store.imgList.length; i++)
      if (!imgImgs.has(i)) closeImgs.add(i);
    if (closeImgs.size > 0) setImgTranslationEnbale(closeImgs, false);

    setRangeText(descRange(imgImgs, store.imgList.length));
  });

  // 实时更新翻译范围
  createEffectOn(translationImgs, (imgs) =>
    setRangeText(descRange(imgs, store.imgList.length)),
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
      {...bindOption('server')}
    />

    <Show when={store.option.translation.server === 'cotrans'}>
      {/* eslint-disable-next-line solid/no-innerhtml */}
      <blockquote innerHTML={t('setting.translation.cotrans_tip')} />
    </Show>

    <Show when={store.option.translation.server === 'selfhosted'}>
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

      <hr style={{ margin: '1em 0' }} />
    </Show>

    <Show when={store.option.translation.server !== 'disable'}>
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
          ['IND', 'Indonesia'],
        ]}
        {...bindOption('options', 'translator', 'target_lang')}
      />
      <SettingsItemSelect
        name={t('setting.translation.options.translator')}
        options={translatorOptions()}
        onClick={updateSelfhostedOptions}
        {...bindOption('options', 'translator', 'translator')}
      />
      <SettingsItemSelect
        name={t('setting.translation.options.direction')}
        options={[
          ['auto', t('setting.translation.options.direction_auto')],
          ['horizontal', t('setting.translation.options.direction_horizontal')],
          ['vertical', t('setting.translation.options.direction_vertical')],
        ]}
        {...bindOption('options', 'render', 'direction')}
      />
      <SettingsItemSelect
        name={t('setting.translation.options.detection_resolution')}
        options={[
          ['1024', '1024px'],
          ['1536', '1536px'],
          ['2048', '2048px'],
          ['2560', '2560px'],
        ]}
        {...bindOption('options', 'detector', 'detection_size')}
      />
      <SettingsItemSelect
        name={t('setting.translation.options.text_detector')}
        options={[['default'], ['ctd', 'Comic Text Detector']]}
        {...bindOption('options', 'detector', 'detector')}
      />

      <Show when={store.option.translation.server === 'selfhosted'}>
        <SettingsItemSelect
          name={t('setting.translation.options.inpainting_size')}
          options={[
            ['516', '516px'],
            ['1024', '1024px'],
            ['2048', '2048px'],
            ['2560', '2560px'],
          ]}
          {...bindOption('options', 'inpainter', 'inpainting_size')}
        />
        <SettingsItemSelect
          name={t('setting.translation.options.inpainter')}
          options={[
            ['default', 'Default'],
            ['lama_large', 'Lama Large'],
            ['lama_mpe', 'Lama MPE'],
            ['sd', 'SD'],
            ['none', 'None'],
            ['original', 'Original'],
          ]}
          {...bindOption('options', 'inpainter', 'inpainter')}
        />
        <SettingsItemNumber
          name={t('setting.translation.options.unclip_ratio')}
          step={0.01}
          {...bindOption('options', 'detector', 'unclip_ratio')}
        />
        <SettingsItemNumber
          name={t('setting.translation.options.box_threshold')}
          step={0.01}
          {...bindOption('options', 'detector', 'box_threshold')}
        />
        <SettingsItemNumber
          name={t('setting.translation.options.mask_dilation_offset')}
          {...bindOption('options', 'mask_dilation_offset')}
        />
      </Show>
    </Show>

    <Show when={store.option.translation.server !== 'disable'}>
      <hr style={{ margin: '1em 0' }} />

      <SettingsItemSwitch
        name={t('setting.translation.options.force_retry')}
        {...bindOption('forceRetry')}
      />
      <SettingsItemSwitch
        name={t('setting.translation.options.only_download_translated')}
        {...bindOption('onlyDownloadTranslated')}
      />
      <Show when={store.option.translation.server === 'selfhosted'}>
        <SettingsItemSwitch
          name={t('setting.translation.options.local_url')}
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
      </Show>
    </Show>
  </>
);
