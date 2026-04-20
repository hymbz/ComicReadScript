/**
 * Cotrans 翻译服务设置界面
 */
import { type Component } from 'solid-js';

import { t } from 'helper';

import type { Option } from '../../../../store/option';

import {
  bindOption as _bindOption,
  type SetOptionsFunction,
} from '../../..';
import { SettingsItemSelect } from '../../../../components/SettingsItemSelect';
import { cotransTranslators, targetLanguageOptions } from './options';

const bindOption: SetOptionsFunction<Option['translation']['cotrans']> = (
  ...args: [any]
) => _bindOption('translation', 'cotrans', ...args);

/** Cotrans 设置组件 */
export const cotransSettings: Component = () => (
  <>
    {/* eslint-disable-next-line solid/no-innerhtml */}
    <blockquote innerHTML={t('setting.translation.cotrans_tip')} />

    <SettingsItemSelect
      name={t('setting.translation.options.target_language')}
      options={targetLanguageOptions}
      {...bindOption('translator', 'target_lang')}
    />
    <SettingsItemSelect
      name={t('setting.translation.options.translator')}
      options={cotransTranslators.map((name) => [
        name,
        t(`translation.translator.${name}`) || name,
      ])}
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
  </>
);
