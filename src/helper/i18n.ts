import { type Languages, getInitLang, setSaveLang } from 'helper/languages';
import {
  createEffect,
  createMemo,
  createRoot,
  createSignal,
  on,
} from 'solid-js';

import zh from '../../locales/zh.json' assert { type: 'json' };
import en from '../../locales/en.json' assert { type: 'json' };
import ru from '../../locales/ru.json' assert { type: 'json' };
import ta from '../../locales/ta.json' assert { type: 'json' };

import { byPath } from './other';
import { log } from './logger';

export const [lang, setLang] = createSignal<Languages>('zh');

export const setInitLang = async () => setLang(await getInitLang());

export const t = createRoot(() => {
  createEffect(on(lang, async () => setSaveLang(lang()), { defer: true }));

  const locales = createMemo(() => {
    switch (lang()) {
      case 'en':
        return en;
      case 'ru':
        return ru;
      case 'ta':
        return ta;
      default:
        return zh;
    }
  });

  return (keys: string, variables?: Record<string, unknown>) => {
    let text = byPath<string>(locales(), keys) ?? '';
    if (variables)
      for (const [k, v] of Object.entries(variables))
        text = text.replaceAll(`{{${k}}}`, `${String(v)}`);

    if (isDevMode && !text) log.warn('unknown i18n key', keys);
    return text;
  };
});
