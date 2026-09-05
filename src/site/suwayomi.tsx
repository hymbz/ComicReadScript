import { toast } from 'components/Toast';
import { setup } from 'core';
import { debounce, gql, querySelector, range, sleep, t } from 'helper';
import { downloadImg, downloadImgHeaders, request } from 'request';

// Suwayomi-Server 的 `server.authMode` 有多个可选项：
// - none: 无需处理
// - basic_auth: 使用浏览器内置的 HTTP Basic Auth 机制来认证
// - simple_login: 使用 cookie 来认证
// - ui_login: 使用 JWT 来认证
//
// 其中，basic_auth、simple_login 都是只要使用同源 fetch，
// 浏览器就会自行加上 Authorization，因此无需特殊处理，图片也可以直接加载
// 但，ui_login 需要手动管理 access token，并在所有请求上添加 Authorization
// 就连图片也需要使用带有 Authorization 的 fetch 来获取

type GraphqlRes<T> = {
  data?: T;
  errors?: { message: string }[];
};

const auth = new (class Auth {
  private token = '';

  /** 是否处于需要认证的 ui_login 模式 */
  get needAuth() {
    return Boolean(localStorage.getItem('auth-refresh-token'));
  }

  get authorization() {
    return this.token ? `Bearer ${this.token}` : '';
  }

  /** 确保已有 access token，换取失败时提示并中断 */
  async ensureToken() {
    if (!this.needAuth || this.token) return;
    if (!(await this.refresh()))
      toast.error(t('other.login_expired'), { throw: true });
  }

  /** 用 refresh token 换取 access token，返回是否成功 */
  async refresh() {
    const refreshToken = localStorage.getItem('auth-refresh-token');
    if (!refreshToken) return false;
    const res = await request<
      GraphqlRes<{ refreshToken: { accessToken: string } }>
    >('/api/graphql', {
      method: 'POST',
      data: JSON.stringify({
        query: `mutation USER_REFRESH($refreshToken: String!) { refreshToken(input: { refreshToken: $refreshToken }) { accessToken } }`,
        variables: { refreshToken },
      }),
      responseType: 'json',
      noCheckCode: true,
      noTip: true,
    });
    const token = res.response.data?.refreshToken.accessToken;
    if (res.status !== 200 || !token) {
      this.clear();
      return false;
    }
    this.token = token;
    downloadImgHeaders.Authorization = `Bearer ${token}`;
    return true;
  }

  clear() {
    this.token = '';
    delete downloadImgHeaders.Authorization;
  }
})();

const graphql = async <T,>(
  query: string,
  variables: Record<string, unknown> = {},
  retry = true,
): Promise<T> => {
  await auth.ensureToken();

  const {
    status,
    response: { data, errors },
  } = await request<GraphqlRes<T>>('/api/graphql', {
    method: 'POST',
    data: JSON.stringify({ query, variables }),
    responseType: 'json',
    noCheckCode: true,
    headers: auth.authorization
      ? { Authorization: auth.authorization }
      : undefined,
  });

  // access token 过期时清空缓存重新换取
  if (
    retry &&
    auth.needAuth &&
    (status === 401 ||
      errors?.some(({ message }) => /unauthorized/iu.test(message)))
  ) {
    auth.clear();
    await auth.ensureToken();
    return graphql(query, variables, false);
  }

  if (errors?.length) {
    toast.error(errors[0].message.split(/\r?\n/u)[0]);
    throw new Error(errors[0].message);
  }

  return data as T;
};

const getChapters = async (mangaId: number, chapterId: number) => {
  type ChapterDataRes = {
    chapters: { nodes: { pageCount: number }[] };
    manga: { chapters: { totalCount: number } };
  };
  const data = await graphql<ChapterDataRes>(
    gql`
      query GET_CHAPTERS($mangaId: Int!, $chapterId: Int!) {
        chapters(condition: { mangaId: $mangaId, sourceOrder: $chapterId }) {
          nodes {
            pageCount
          }
        }
        manga(id: $mangaId) {
          chapters {
            totalCount
          }
        }
      }
    `,
    { mangaId, chapterId },
  );

  // 可能因为是在点开指定话数后才去获取数据的
  // 所以如果有时候会拿不到数据需要等一下
  if (data.chapters.nodes[0].pageCount <= 0) {
    await sleep(200);
    return getChapters(mangaId, chapterId);
  }

  return data;
};

const jump = (mangaId: number, chapterId: number) => {
  location.pathname = `/manga/${mangaId}/chapter/${chapterId}`;
};

setup({
  name: 'Suwayomi',
  isMangaPage: () => {
    const match = /\/manga\/(?<mangaId>\d+)\/chapter\/(?<chapterId>\d+)/u.exec(
      location.pathname,
    )?.groups;
    if (!match) return false;
    return {
      mangaId: Number(match.mangaId),
      chapterId: Number(match.chapterId),
    };
  },
  async getImgList({ setState, dynamicLazyLoad }, { mangaId, chapterId }) {
    const data = await getChapters(mangaId, chapterId);
    const [{ pageCount }] = data.chapters.nodes;
    const chapterCount = data.manga.chapters.totalCount;

    setState('manga', {
      onPrev: chapterId > 0 ? () => jump(mangaId, chapterId - 1) : undefined,
      onNext:
        chapterId < chapterCount
          ? () => jump(mangaId, chapterId + 1)
          : undefined,
    });

    const getImgUrl = (i: number) =>
      `/api/v1/manga/${mangaId}/chapter/${chapterId}/page/${i}`;

    if (!auth.needAuth) return range(pageCount, getImgUrl);

    // ui_login 认证模式下图片同样需要 Authorization 头，但 <img> 无法携带
    // 因此需要改用 downloadImg 下载并转成 blob URL 加载
    return dynamicLazyLoad({
      length: pageCount,
      loadImg: async (i) =>
        URL.createObjectURL(await downloadImg(getImgUrl(i))),
    });
  },
  handler: ({ setState }) =>
    setState('manga', {
      // 跟随阅读进度滚动页面，避免确保能触发进度记录
      onShowImgsChange: debounce((showImgs, imgList) => {
        const lastImgUrl = imgList[[...showImgs].at(-1)!].src;
        querySelector(`img[src$="${lastImgUrl}"]`)?.scrollIntoView({
          behavior: 'instant',
          block: 'end',
        });
      }, 500),
    }),
});
