/**
 * MangaImageTranslator 翻译服务设置界面
 */
import { type Component, Show } from 'solid-js';

import { t } from 'helper';

import type { Option } from '../../../../store/option';

import { mitTranslators, updateMitTranslators } from '.';
import {
  bindOption as _bindOption,
  setOption,
  type SetOptionsFunction,
} from '../../..';
import { SettingsItemNumber } from '../../../../components/SettingsItemNumber';
import { SettingsItemSelect } from '../../../../components/SettingsItemSelect';
import { SettingsItemSwitch } from '../../../../components/SettingsItemSwitch';
import { store } from '../../../../store';
import { targetLanguageOptions } from './options';

const bindOption: SetOptionsFunction<Option['translation']['mit']> = (
  ...args: [any]
) => _bindOption('translation', 'mit', ...args);

/** MangaImageTranslator 设置组件 */
export const mitSettings: Component = () => (
  <>
    <SettingsItemSelect
      name={t('setting.translation.options.target_language')}
      options={targetLanguageOptions}
      {...bindOption('translator', 'target_lang')}
    />
    <SettingsItemSelect
      name={t('setting.translation.options.translator')}
      options={mitTranslators()}
      onClick={updateMitTranslators}
      {...bindOption('translator', 'translator')}
    />
    <SettingsItemSelect
      name={t('setting.translation.options.direction')}
      options={[
        ['auto', t('setting.translation.options.direction_auto')],
        ['horizontal', t('setting.translation.options.direction_horizontal')],
        ['vertical', t('setting.translation.options.direction_vertical')],
      ]}
      {...bindOption('render', 'direction')}
    />
    <SettingsItemSelect
      name={t('setting.translation.options.detection_resolution')}
      options={[
        ['1024', '1024px'],
        ['1536', '1536px'],
        ['2048', '2048px'],
        ['2560', '2560px'],
      ]}
      {...bindOption('detector', 'detection_size')}
    />
    <SettingsItemSelect
      name={t('setting.translation.options.text_detector')}
      options={[['default'], ['ctd', 'Comic Text Detector']]}
      {...bindOption('detector', 'detector')}
    />
    <SettingsItemSelect
      name={t('setting.translation.options.inpainting_size')}
      options={[
        ['516', '516px'],
        ['1024', '1024px'],
        ['2048', '2048px'],
        ['2560', '2560px'],
      ]}
      {...bindOption('inpainter', 'inpainting_size')}
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
      {...bindOption('inpainter', 'inpainter')}
    />
    <SettingsItemNumber
      name={t('setting.translation.options.unclip_ratio')}
      step={0.01}
      {...bindOption('detector', 'unclip_ratio')}
    />
    <SettingsItemNumber
      name={t('setting.translation.options.box_threshold')}
      step={0.01}
      {...bindOption('detector', 'box_threshold')}
    />
    <SettingsItemNumber
      name={t('setting.translation.options.mask_dilation_offset')}
      {...bindOption('mask_dilation_offset')}
    />

    <SettingsItemSwitch
      name={t('setting.translation.options.local_url')}
      value={store.option.translation.mit.localUrl !== undefined}
      onChange={(val) => {
        setOption((draftOption) => {
          draftOption.translation.mit.localUrl = val ? '' : undefined;
        });
      }}
    />
    <Show when={store.option.translation.mit.localUrl !== undefined}>
      <input
        type="url"
        value={store.option.translation.mit.localUrl}
        onChange={(e) => {
          setOption((draftOption) => {
            const url = e.target.value.replace(/\/$/, '');
            draftOption.translation.mit.localUrl = url;
          });
        }}
      />
    </Show>
  </>
);
