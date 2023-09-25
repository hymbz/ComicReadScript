export const langList = ['zh', 'en', 'ru'] as const;
export type Languages = (typeof langList)[number];

/** 判断传入的字符串是否是支持的语言类型代码 */
export const isLanguages = (
  lang: string | undefined | null,
): lang is Languages => !!lang && langList.includes(lang as Languages);

/** 返回浏览器偏好语言 */
const getBrowserLang = () => {
  let newLang: Languages | undefined;

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

  return newLang;
};

const getSaveLang = () =>
  window?.GM?.getValue
    ? GM.getValue<string>('Languages')
    : localStorage.getItem('Languages');

export const setSaveLang = (val: string) =>
  window?.GM?.setValue
    ? GM.setValue('Languages', val)
    : localStorage.setItem('Languages', val);

export const getInitLang = async () => {
  const saveLang = await getSaveLang();
  if (isLanguages(saveLang)) return saveLang;

  const lang = getBrowserLang() ?? 'zh';
  setSaveLang(lang);
  return lang;
};
