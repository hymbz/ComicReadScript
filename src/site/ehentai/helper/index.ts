import { querySelector, querySelectorAll } from 'helper';

import type { GalleryContext } from './context';

export * from './context';

export const escHandler = new Map(
  (['关闭显示标签定义', '取消选中当前标签', '关闭浮动标签栏'] as const).map(
    (name) => [name, (): unknown => true],
  ),
);

/** 获取所有标签 */
export const getTaglist = () => {
  const lockTags = new Set<string>();
  const weakTags = new Set<string>();
  for (const tag of querySelectorAll('#taglist table [id^=td_]')) {
    const [a] = tag.getElementsByTagName('a');
    // 跳过点踩的标签
    if (a.classList.contains('tdn')) continue;
    if (a.classList.contains('tup') || tag.classList.contains('gt'))
      lockTags.add(tag.id.slice(3));
    else if (tag.classList.contains('gtl')) weakTags.add(tag.id.slice(3));
  }
  return [lockTags, weakTags] as const;
};

const handleTagName = (tag: string) => {
  const [namespace, name] = tag.trim().split(':');
  if (!name) return ['', ''];
  return [namespace, name.replaceAll(/[^a-z-_ ]/gi, '')];
};

/** 命名空间缩写 */
const namespaceAbbr = [
  ['artist', 'a'],
  ['character', 'c', 'char'],
  ['cosplayer', 'c', 'os'],
  ['female', 'f'],
  ['group', 'g', 'circle'],
  ['language', 'l', 'lang'],
  ['male', 'm'],
  ['mixed', 'x'],
  ['other', 'o'],
  ['parody', 'p', 'series'],
  ['reclass', 'r'],
];
/** 获取标签的所有写法 */
export const getTagNameList = (tag: string) => {
  const [namespace, name] = handleTagName(tag);
  for (const target of namespaceAbbr)
    if (target.includes(namespace)) return target.map((t) => `${t}:${name}`);
  return [tag];
};

/** 获取标签的完整写法 */
export const getTagNameFull = (tag: string) => {
  const [namespace, name] = handleTagName(tag);
  for (const target of namespaceAbbr)
    if (target.includes(namespace)) return `${target[0]}:${name}`;
  return tag;
};

/** 画廊分类图标对应的 class。在列表页是「.ct2」，在画廊里是「.gt2」 */
const categoriesMap = {
  Western: 'ta',
  Misc: 't1',
  Doujinshi: 't2',
  Manga: 't3',
  'Artist CG': 't4',
  'Game CG': 't5',
  'Image Set': 't6',
  Cosplay: 't7',
  'Asian Porn': 't8',
  'Non-H': 't9',
} as const;

/** 判断是否当前画廊是否是指定的分类 */
export const isInCategories = (...name: (keyof typeof categoriesMap)[]) =>
  Boolean(
    querySelector(
      `#gdc > .cs:is(${name.map((c) => `.c${categoriesMap[c]}`).join(', ')})`,
    ),
  );

/** 更新 pagelist 里的 nl 参数 */
export const setNl = (context: GalleryContext, i: number, nl: string) => {
  const url = new URL(context.pageList[i]);
  url.searchParams.set('nl', nl);
  context.pageList[i] = url.href;
};
