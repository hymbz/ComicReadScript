import { pcApi } from './client';
import { mapImgUrl } from './decrypt';

/** 章节图片获取失败的统一错误提示 */
const errorText = '加載章節圖片失敗';

type ChapterDetail = {
  message: string;
  results: {
    chapter: {
      contents: { url: string }[];
      name: string;
      next: string | null;
      prev: string | null;
    };
    comic: { name: string; path_word: string };
  };
};

type Chapter2Detail = {
  message: string;
  results: {
    chapter: {
      contents: { url: string }[];
      name: string;
      next: string | null;
      prev: string | null;
      words: number[]; // 相比另一个接口，多了这个字段用于排序
    };
    comic: { name: string; path_word: string };
  };
};

export const getChapterDetail = <T = ChapterDetail>(
  comicName: string,
  chapterId: string,
) =>
  pcApi.eachGet<T>(
    `/api/v3/comic/${comicName}/chapter/${chapterId}?platform=3`,
    { noCheckCode: true, errorText },
  );

const getChapter2Detail = <T = Chapter2Detail>(
  comicName: string,
  chapterId: string,
) =>
  pcApi.eachGet<T>(`/api/v3/comic/${comicName}/chapter2/${chapterId}`, {
    noCheckCode: true,
    errorText,
  });

/** 统一的章节图片数据 */
export type ChapterData = {
  status: number;
  message?: string;
  urls: string[];
  chapter: { name: string; next: string | null; prev: string | null };
  comicName: string;
};

/** 获取章节图片数据 */
export const getChapterData = async (
  comicName: string,
  chapterId: string,
): Promise<ChapterData> => {
  // 新版接口
  try {
    const res = await getChapter2Detail(comicName, chapterId);
    if (res.status === 200) {
      const { contents, words, name, next, prev } =
        res.response.results.chapter;
      const urls = contents
        .map(({ url }, i) => ({ url, order: words[i] ?? i }))
        .toSorted((a, b) => a.order - b.order)
        .map(({ url }) => mapImgUrl(url));
      return {
        status: res.status,
        urls,
        chapter: { name, next, prev },
        comicName: res.response.results.comic.name,
      };
    }
  } catch {}

  // 旧版接口兜底
  const {
    status,
    response: {
      results: {
        chapter,
        comic: { name },
      },
      message,
    },
  } = await getChapterDetail(comicName, chapterId);
  return {
    status,
    message,
    urls: chapter.contents.map(({ url }) => mapImgUrl(url)),
    chapter,
    comicName: name,
  };
};
