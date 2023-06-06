import { request } from '.';
import { toast } from '../main';
import dmzjDecrypt from './dmzjDecrypt';

type Text = number | string;

interface chapterData {
  id: Text;
  title: string;
  updatetime: Text;
}

/** dmzj 的漫画详情 */
export interface ComicDetail {
  title: string;
  last_updatetime: Text;
  last_update_chapter_id: number | null;
  chapters: {
    name: string;
    list: chapterData[];
  }[];
}

/** dmzj 的章节信息 */
export interface ChapterInfo {
  folder: string;
  chapter_name: string;
  next_chap_id?: number;
  prev_chap_id?: number;
  comic_id: number;
  page_url: string[];
  updatetime: number;
}

/** 根据漫画 id 和章节 id 获取章节数据 */
export const getChapterInfo = async (comicId: Text, chapterId: Text) => {
  const res = await request<ChapterInfo>(
    `https://m.dmzj.com/chapinfo/${comicId}/${chapterId}.html`,
    { errorText: '获取漫画数据失败' },
  );

  return JSON.parse(res.responseText) as ChapterInfo;
};

const getComicDetail_base = async (comicId: string): Promise<ComicDetail> => {
  const res = await request(
    `https://api.dmzj.com/dynamic/comicinfo/${comicId}.json`,
  );
  const {
    info: { last_updatetime, title },
    list,
  } = JSON.parse(res.responseText).data as {
    info: {
      last_updatetime: string;
      title: string;
    };
    list: Array<{
      id: string;
      chapter_name: string;
      updatetime: string;
    }>;
  };

  return {
    title,
    last_updatetime,
    last_update_chapter_id: null,
    chapters: [
      {
        name: '连载',
        list: list.map(({ id, chapter_name, updatetime }) => ({
          id,
          title: chapter_name,
          updatetime,
        })),
      },
    ],
  };
};

const getComicDetail_v4Api = async (comicId: string): Promise<ComicDetail> => {
  const res = await request(
    `https://v4api.idmzj.com/comic/detail/${comicId}?uid=2665531&disable_level=1`,
  );

  const {
    comicInfo: { last_update_chapter_id, last_updatetime, chapters, title },
  } = dmzjDecrypt(res.responseText);

  Object.values(chapters).forEach((chapter) => {
    chapter.data.sort((a, b) => a.chapter_order - b.chapter_order);
  });

  return {
    title,
    last_updatetime,
    last_update_chapter_id,
    chapters: chapters.map(({ data, title: name }) => ({
      name,
      list: data.map(({ chapter_id, chapter_title, updatetime }) => ({
        id: chapter_id,
        title: chapter_title,
        updatetime,
      })),
    })),
  };
};

const getComicDetail_traversal = async (
  comicId: string,
  chapterId: Text,
): Promise<Pick<ComicDetail, 'chapters'>> => {
  const list: chapterData[] = [];
  let nextId: Text | undefined = chapterId;

  toast.warn('正在通过遍历获取所有章节，耗时可能较长', {
    id: 'traversalTip',
    duration: Infinity,
  });

  while (nextId) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const { chapter_name, updatetime, prev_chap_id } = await getChapterInfo(
        comicId,
        nextId,
      );
      list.push({ id: nextId, title: chapter_name, updatetime });

      toast.warn(
        `正在遍历获取所有章节，耗时可能较长，已获取 ${list.length} 个章节`,
        { id: 'traversalTip' },
      );
      nextId = prev_chap_id;
    } catch (_) {
      nextId = undefined;
    }
  }

  toast.dismiss('traversalTip');

  return { chapters: [{ name: '连载', list }] };
};

/** 根据漫画 id 获取章节等数据 */
export const getComicDetail = async (comicId: string): Promise<ComicDetail> => {
  const data = {} as ComicDetail;
  const apiFn = [
    getComicDetail_v4Api,
    getComicDetail_base,
    () =>
      data.last_update_chapter_id &&
      getComicDetail_traversal(comicId, data.last_update_chapter_id),
  ];

  for (let i = 0; i < apiFn.length; i++) {
    try {
      // eslint-disable-next-line no-await-in-loop
      Object.assign(data, await apiFn[i](comicId));
      if (data.chapters.some((chapter) => chapter.list.length)) return data;
    } catch (_) {}
  }

  toast.error('漫画数据获取失败', { duration: Infinity });
  throw new Error('漫画数据获取失败');
};
