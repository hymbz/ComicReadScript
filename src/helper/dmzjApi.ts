import { createMutable } from 'solid-js/store';
import { onMount } from 'solid-js';

import { toast, request } from 'main';
import dmzjDecrypt from 'dmzjDecrypt';

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
    { errorText: '获取章节数据失败' },
  );

  return JSON.parse(res.responseText) as ChapterInfo;
};

/** 根据漫画 id 和章节 id 获取章节评论 */
export const getViewpoint = async (comicId: Text, chapterId: Text) => {
  try {
    const res = await request<ChapterInfo>(
      `https://manhua.dmzj.com/tpi/api/viewpoint/getViewpoint?type=0&type_id=${comicId}&chapter_id=${chapterId}&more=1`,
      { errorText: '获取章节评论失败' },
    );

    // 还有另一个 api
    // http://v3api.dmzj.com/viewPoint/0/${comic_id}/${chapter_id}.json

    return JSON.parse(res.responseText).data.list.map(
      ({ title, num }) => `${title} [+${num}]`,
    ) as string[];
  } catch (_) {
    return [];
  }
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
  draftData: Partial<ComicDetail>,
) => {
  let nextId = draftData.last_update_chapter_id;
  if (!nextId) {
    console.warn('last_update_chapter_id 为空，无法通过遍历获取章节');
    return;
  }

  draftData.chapters![0] = { name: '连载', list: [] };

  toast.warn('正在通过遍历获取所有章节，耗时可能较长', {
    id: 'traversalTip',
    duration: Infinity,
  });

  while (nextId) {
    try {
      const { chapter_name, updatetime, prev_chap_id } = await getChapterInfo(
        comicId,
        nextId,
      );
      draftData.chapters![0].list.push({
        id: nextId,
        title: chapter_name,
        updatetime,
      });
      nextId = prev_chap_id;
    } catch (_) {
      nextId = undefined;
    }
  }

  toast.dismiss('traversalTip');
};

/** 返回可变 store 类型的漫画数据 */
export const useComicDetail = (comicId: string) => {
  const data = createMutable<Partial<ComicDetail>>({});

  const apiFn = [
    getComicDetail_v4Api,
    getComicDetail_base,
    getComicDetail_traversal,
  ];

  onMount(async () => {
    for (let i = 0; i < apiFn.length; i++) {
      try {
        Object.assign(data, await apiFn[i](comicId, data));
        if (data.chapters?.some((chapter) => chapter.list.length)) return;
      } catch (_) {}
    }

    toast.error('漫画数据获取失败', { duration: Infinity });
    console.error('漫画数据获取失败');
  });

  return data;
};

/** 根据漫画拼音简称找到对应的 id */
export const getComicId = async (py: string) => {
  const res = await request(
    `https://manhua.dmzj.com/api/v1/comic2/comic/detail?${new URLSearchParams({
      channel: 'pc',
      app_name: 'comic',
      version: '1.0.0',
      timestamp: `${Date.now()}`,
      uid: '',
      comic_py: py,
    }).toString()}`,
  );
  return JSON.parse(res.responseText).data?.comicInfo?.id as string;
};
