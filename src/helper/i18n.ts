import {
  createEffect,
  createMemo,
  createRoot,
  createSignal,
  on,
} from 'solid-js';

import type { Languages } from 'helper/languages';

import { getInitLang, setSaveLang } from 'helper/languages';

import en from '../../locales/en.json' with { type: 'json' };
import ru from '../../locales/ru.json' with { type: 'json' };
import zh from '../../locales/zh.json' with { type: 'json' };
import { log } from './logger';
import { byPath } from './other';

export const [lang, setLang] = createSignal<Languages>('zh');

export const setInitLang = async () => setLang(await getInitLang());

export const t = createRoot(() => {
  createEffect(on(lang, () => setSaveLang(lang()), { defer: true }));

  const locales = createMemo(() => {
    switch (lang()) {
      case 'en':
        return en;
      case 'ru':
        return ru;
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
