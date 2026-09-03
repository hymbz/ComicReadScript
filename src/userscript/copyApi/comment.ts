import { mobileApi } from './client';

/** 获取漫画评论 */
export const getComments = async (chapterId: string, list: string[] = []) => {
  const res = await mobileApi.eachGet<Blob>(
    `/api/v3/roasts?chapter_id=${chapterId}&limit=100&offset=${list.length}&_update=true`,
    { errorText: '獲取漫畫評論失敗', responseType: 'blob' },
  );
  const { list: newList, total } = JSON.parse(
    await res.response.text(),
  ).results;
  for (const { comment } of newList) list.push(comment);
  if (list.length < total) return getComments(chapterId, list);
  return list;
};
