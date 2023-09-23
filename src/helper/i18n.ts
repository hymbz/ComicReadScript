import { createMemo, createRoot, createSignal } from 'solid-js';
import zh from '../../locales/zh.json' assert { type: 'json' };
import en from '../../locales/en.json' assert { type: 'json' };

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
    const path = keys.split('.');
    let target: any = locales();
    let key = path.shift();
    while (key) {
      // 兼容含有「.」的 key
      while (!target[key] && path.length) key += `.${path.shift()!}`;
      target = target[key];
      key = path.shift();
    }
    const text = (target as string) ?? '';
    if (variables)
      Object.entries(variables).forEach(([k, v]) => {
        text.replaceAll(`{{${k}}}`, `${v}`);
      });
    if (!text) console.warn('unknown i18n key', keys);
    return text;
  };
});
