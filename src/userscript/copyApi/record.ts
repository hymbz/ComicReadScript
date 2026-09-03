import { mobileApi } from './client';

export type LastChapter = {
  results?: {
    browse: {
      chapter_id: string | null;
      chapter_name: string | null;
    } | null;
  };
};

/** 获取最后阅读记录 */
export const getLastChapter = (comicName: string) =>
  mobileApi.eachGet<LastChapter>(
    `/api/v3/comic2/${comicName}/query?platform=3`,
    { errorText: '獲取閱讀記錄失敗' },
  );
