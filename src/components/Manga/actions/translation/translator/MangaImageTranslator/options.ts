/**
 * MangaImageTranslator 翻译服务配置选项
 */
import { lang } from 'helper';

/** MangaImageTranslator 翻译配置 */
export type MitOptions = {
  /** 自定义服务器地址，为空则使用默认地址 */
  localUrl: string | undefined;

  detector: {
    detector: string;
    detection_size: string;
    box_threshold: number;
    unclip_ratio: number;
  };
  render: { direction: string };
  translator: { translator: string; target_lang: string };
  inpainter: { inpainter: string; inpainting_size: string };
  mask_dilation_offset: number;
};

/**
 * 默认配置
 *
 * 部分参数使用文档推荐值:
 * @see https://github.com/zyddnys/manga-image-translator?tab=readme-ov-file#recommended-options
 */
export const mitDefaultOptions = (): MitOptions => ({
  localUrl: undefined,

  detector: {
    detector: 'ctd',
    detection_size: '1536',
    box_threshold: 0.7,
    unclip_ratio: 2.3,
  },
  render: { direction: 'auto' },
  translator: {
    translator: 'gpt3.5',
    target_lang: { zh: 'CHS', en: 'ENG', ru: 'RUS' }[lang()] ?? 'CHS',
  },
  inpainter: { inpainter: 'lama_large', inpainting_size: '2048' },
  mask_dilation_offset: 30,
});

/** 分辨率映射 */
export const sizeDict: Record<string, string> = {
  '1024': 'S',
  '1536': 'M',
  '2048': 'L',
  '2560': 'X',
};

/** 目标语言选项 */
export const targetLanguageOptions: [string, string][] = [
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
];
