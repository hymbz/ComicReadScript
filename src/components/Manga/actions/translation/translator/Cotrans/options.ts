/**
 * Cotrans 翻译服务配置选项
 */
import { lang } from 'helper';

/** Cotrans 翻译配置 */
export type CotransOptions = {
  detector: {
    detector: string;
    detection_size: string;
  };
  render: { direction: string };
  translator: { translator: string; target_lang: string };
};

export { sizeDict, targetLanguageOptions } from '../MangaImageTranslator/options';

/** Cotrans 支持的翻译器列表 */
export const cotransTranslators = [
  'google',
  'youdao',
  'baidu',
  'deepl',
  'gpt3.5',
  'offline',
  'none',
];

/** Cotrans 默认配置 */
export const cotransDefaultOptions = (): CotransOptions => ({
  detector: {
    detector: 'ctd',
    detection_size: '1536',
  },
  render: { direction: 'auto' },
  translator: {
    translator: 'gpt3.5',
    target_lang: { zh: 'CHS', en: 'ENG', ru: 'RUS' }[lang()] ?? 'CHS',
  },
});
