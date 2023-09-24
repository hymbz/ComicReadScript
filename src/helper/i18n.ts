import { createMemo, createRoot, createSignal } from 'solid-js';
import { byPath } from 'helper';
import zh from '../../locales/zh.json' assert { type: 'json' };
import en from '../../locales/en.json' assert { type: 'json' };
import { log } from './logger';

const langList = ['zh', 'en'] as const;
type LangList = (typeof langList)[number];

let initLang: LangList | undefined;

for (let i = 0; i < navigator.languages.length; i++) {
  const language = navigator.languages[i];
  const matchLang = langList.find(
    (l) => l === language || l === language.split('-')[0],
  );
  if (matchLang) {
    initLang = matchLang;
    break;
  }
}

export const [lang, setLang] = createSignal<LangList>(initLang ?? 'zh');

export const t = createRoot(() => {
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
