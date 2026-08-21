import { request } from 'request';

// by: https://greasyfork.org/zh-CN/scripts/582867

/** 获取再漫画吐槽列表 */
export const getZaiManHuaCommentList = async (
  comicId: string | number,
  chapterId: string | number,
) => {
  const res = await request(
    `https://v4api.zaimanhua.com/app/v1/viewpoint/list?type=0&comicId=${comicId}&chapterId=${chapterId}`,
    { responseType: 'json' },
  );
  const {
    errno,
    errmsg,
    data: { list = [] } = {},
  } = res.response as {
    errno?: number;
    errmsg?: string;
    data?: { list?: string[][] };
  };
  if (errno) throw new Error(errmsg || '获取吐槽列表失败');
  return list.map((comment) => comment[7]).filter(Boolean);
};

/** 从 localStorage / sessionStorage / cookie 中获取再漫画 JWT Token */
export const getZaiManHuaToken = () => {
  const findToken = (values: Iterable<string>) => {
    for (const value of values) {
      const match =
        /\beyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/u.exec(value);
      if (match) return match[0];
    }
  };

  return (
    findToken(Object.values(localStorage)) ??
    findToken(Object.values(sessionStorage)) ??
    findToken([document.cookie])
  );
};

/** 发送再漫画吐槽 */
export const sendZaiManHuaComment = async (
  comicId: string | number,
  chapterId: string | number,
  content: string,
) => {
  const token = getZaiManHuaToken();
  if (!token) throw new Error('未登录或 token 失效');

  const body = new URLSearchParams({
    type: '0',
    comicId: String(comicId),
    chapterId: String(chapterId),
    page: '0',
    content,
    modeType: '4',
    modeFontSize: '18',
    modeFontColor: '',
    modeSource: '0',
  }).toString();

  const res = await request(
    'https://v4api.zaimanhua.com/app/v1/viewpoint/add',
    {
      method: 'POST',
      responseType: 'json',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: body,
      errorText: '发送吐槽失败',
    },
  );

  const { errno, errmsg } = res.response as {
    errno?: number;
    errmsg?: string;
  };
  if (errno) throw new Error(errmsg || '发送吐槽失败');
};
