import {
  createEffect,
  createMemo,
  createRoot,
  createSignal,
  on,
} from 'solid-js';
import { byPath } from 'helper';
import { log } from './logger';
import type { Languages } from './languages';
import { getInitLang, setSaveLang } from './languages';
import zh from '../../locales/zh.json' assert { type: 'json' };
import en from '../../locales/en.json' assert { type: 'json' };
import ru from '../../locales/ru.json' assert { type: 'json' };

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

  // eslint-disable-next-line solid/reactivity
  return (keys: string, variables?: Record<string, unknown>) => {
    let text = byPath<string>(locales(), keys) ?? '';
    if (variables)
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replaceAll(`{{${k}}}`, `${v}`);
      });
    if (isDevMode && !text) log.warn('unknown i18n key', keys);
    return text;
  };
});
