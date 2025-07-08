import { querySelectorAll } from 'helper';

type EscHandler = { (): true | unknown; order: number }[];
export const escHandler: EscHandler = [];

export const setEscHandler = (order: number, handler: () => true | unknown) => {
  escHandler.push(Object.assign(handler, { order }));
  escHandler.sort((a, b) => b.order - a.order);
};

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

export * from './context';
