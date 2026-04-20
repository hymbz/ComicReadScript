import type { Component } from 'solid-js';

import { createSignal, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { createEffectOn, descRange, extractRange, t } from 'helper';

import type { SetOptionsFunction } from '../actions';
import type { Option } from '../store/option';

import { RangeInput } from '../../RangeInput';
import {
  allowBatchTranslation,
  bindOption as _bindOption,
  cotransSettings,
  imgList,
  isTranslatingAll,
  isTranslatingToEnd,
  mitSettings,
  setImgTranslationEnbale,
  translateAll,
  translateToEnd,
  translationImgs,
} from '../actions';
import classes from '../index.module.css';
import { store } from '../store';
import { SettingsItem } from './SettingsItem';
import { SettingsItemSelect } from './SettingsItemSelect';
import { SettingsItemSwitch } from './SettingsItemSwitch';

const bindOption: SetOptionsFunction<Option['translation']> = (
  ...args: [any]
) => _bindOption('translation', ...args);

const [rangeText, setRangeText] = createSignal('');
// 实时更新翻译范围
createEffectOn(translationImgs, (imgs) =>
  setRangeText(descRange(imgs, store.imgList.length)),
);

const TranslateRange: Component = () => {
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

const settingsMap = {
  'manga-image-translator': mitSettings,
  cotrans: cotransSettings,
} satisfies Partial<Record<Option['translation']['provider'], Component>>;

export const SettingTranslation = () => (
  <>
    <SettingsItemSwitch
      name={t('other.enabled')}
      {...bindOption('enabled')}
    />

    <Show when={store.option.translation.enabled}>
      <SettingsItemSelect
        name={t('setting.translation.provider')}
        options={[
          ['manga-image-translator', 'Manga Image Translator'],
          ['cotrans', 'Cotrans'],
        ]}
        {...bindOption('provider')}
      />

      <Show when={allowBatchTranslation()}>
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

      <Dynamic component={settingsMap[store.option.translation.provider]} />

      <hr style={{ margin: '1em 0' }} />

      <SettingsItemSwitch
        name={t('setting.translation.options.force_retry')}
        {...bindOption('forceRetry')}
      />
      <SettingsItemSwitch
        name={t('setting.translation.options.only_download_translated')}
        {...bindOption('onlyDownloadTranslated')}
      />
    </Show>
  </>
);
