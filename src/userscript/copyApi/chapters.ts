import { pcApi } from './client';
import { decryptData } from './decrypt';

/** 章节目录获取失败的统一错误提示 */
const errorText = '加載漫畫目錄失敗';

export type ChaptersGroup = {
  name: string;
  path_word: string;
  chapters: { type: number; name: string; id: string }[];
  last_chapter: {
    comic_id: string;
    name: string;
    datetime_created: string;
    uuid: string;
  };
};

export type Chapters = {
  build: { type: { id: number; name: string }[] };
  groups: Record<string, ChaptersGroup>;
};

/**
 * 获取漫画目录
 *
 * 会受反爬机制影响返回空数据，因此仅作为备用
 */
export const getChaptersLegacy = async (
  comicName: string,
): Promise<Chapters> => {
  const {
    response: { results },
  } = await pcApi.get<{ results: string }>(
    `/comicdetail/${comicName}/chapters`,
    { errorText },
  );
  return decryptData<Chapters>(results);
};

type Group = { path_word: string; name: string };
type GroupChapter = {
  type: number;
  name: string;
  uuid: string;
  path_word: string;
  comic_id: string;
  size?: number;
  ordered?: number;
  datetime_created?: string;
  next?: string | null;
};

const typeNameMap: Record<number, string> = { 1: '話', 2: '卷', 3: '番外篇' };

/** 获取漫画目录 */
export const getChaptersByApi = async (comicName: string) => {
  const groupsRes = await pcApi.eachGet<{
    results: { groups?: Group[] | Record<string, Group> };
  }>(`/api/v3/comic2/${comicName}`, { errorText });
  const rawGroups = groupsRes.response.results.groups;
  const groups = (
    Array.isArray(rawGroups) ? rawGroups : Object.values(rawGroups ?? {})
  ).filter(({ path_word }) => path_word);
  // 无 groups 时兜底为一个组
  if (groups.length === 0) groups.push({ path_word: 'default', name: '默认' });

  const chaptersByGroup: { group: Group; list: GroupChapter[] }[] = [];
  for (const group of groups) {
    let page: GroupChapter[] = [];
    let offset = 0;
    const list: GroupChapter[] = [];
    do {
      const res = await pcApi.eachGet<{
        results: { total: number; list: GroupChapter[] };
      }>(
        `/api/v3/comic/${comicName}/group/${group.path_word}/chapters?limit=100&offset=${offset}&_update=true`,
        { errorText },
      );
      page = res.response.results.list;
      list.push(...page);
      offset += 100;
    } while (page.length >= 100);
    chaptersByGroup.push({ group, list });
  }

  return { groups, chaptersByGroup };
};

/** 将接口返回数据转换为统一的目录结构 */
const transformFromGetChaptersByApi = (raw: {
  groups: Group[];
  chaptersByGroup: { group: Group; list: GroupChapter[] }[];
}): Chapters => {
  const build: Chapters['build'] = {
    type: Object.entries(typeNameMap).map(([id, name]) => ({
      id: Number(id),
      name,
    })),
  };

  const groups: Record<string, ChaptersGroup> = {};
  for (const { group, list } of raw.chaptersByGroup) {
    const chapters = list.map(({ type, name, uuid }) => ({
      type,
      name,
      id: uuid,
    }));
    // 最新一章：以 next === null 定位，没有则取最后一个
    const lastRaw = list.find((ch) => ch.next === null) ?? list.at(-1);
    groups[group.path_word] = {
      path_word: group.path_word,
      name: group.name,
      chapters,
      last_chapter: lastRaw
        ? {
            comic_id: lastRaw.comic_id,
            name: lastRaw.name,
            datetime_created: lastRaw.datetime_created ?? '',
            uuid: lastRaw.uuid,
          }
        : { comic_id: '', name: '', datetime_created: '', uuid: '' },
    };
  }

  return { build, groups };
};

/** 获取漫画目录（优先新接口，失败时用旧接口兜底） */
export const getChapters = async (comicName: string): Promise<Chapters> => {
  try {
    return transformFromGetChaptersByApi(await getChaptersByApi(comicName));
  } catch {
    return getChaptersLegacy(comicName);
  }
};
