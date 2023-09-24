import {
  createEffect,
  createMemo,
  createRoot,
  createSignal,
  on,
} from 'solid-js';
import { byPath } from 'helper';
import zh from '../../locales/zh.json' assert { type: 'json' };
import en from '../../locales/en.json' assert { type: 'json' };
import { log } from './logger';

const langList = ['zh', 'en'] as const;
type Languages = (typeof langList)[number];

/** 判断传入的字符串是否是支持的语言类型代码 */
const isLanguages = (lang?: string): lang is Languages =>
  langList.includes(lang as Languages);

export const [lang, setLang] = createSignal<Languages>('zh');

/** 根据浏览器的偏好语言自动设置语言 */
export const autoSetLang = () => {
  let newLang: Languages = 'zh';

  for (let i = 0; i < navigator.languages.length; i++) {
    const language = navigator.languages[i];
    const matchLang = langList.find(
      (l) => l === language || l === language.split('-')[0],
    );
    if (matchLang) {
      newLang = matchLang;
      break;
    }
  }

  if (newLang !== lang()) setLang(newLang);
};

export const setInitLang = async () => {
  const saveLang = await GM.getValue<string>('Languages');

  if (isLanguages(saveLang)) {
    if (saveLang !== lang()) setLang(saveLang);
  } else {
    autoSetLang();
    await GM.setValue('Languages', lang());
  }
};

export const t = createRoot(() => {
  createEffect(
    on(lang, () => GM.setValue('Languages', lang()), { defer: true }),
  );

  const locales = createMemo(() => {
    switch (lang()) {
      case 'en':
        return en;
      default:
        return zh;
    }
  });

  // eslint-disable-next-line solid/reactivity
  return (keys: string, variables?: Record<string, unknown>) => {
    const text = byPath<string>(locales(), keys) ?? '';
    if (variables)
      Object.entries(variables).forEach(([k, v]) => {
        text.replaceAll(`{{${k}}}`, `${v}`);
      });
    if (!text) log.warn('unknown i18n key', keys);
    return text;
  };
});
