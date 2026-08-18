import { setState as setMangaStore } from 'components/Manga';
import { setup } from 'core';
import { debounce, querySelector, range, sleep } from 'helper';
import { request } from 'request';

// Tachidesk

if (
  document.querySelector(
    `head > meta[content="A manga reader that runs tachiyomi's extensions"]`,
  )
) {
  const jump = (mangaId: number, chapterId: number) => {
    location.pathname = `/manga/${mangaId}/chapter/${chapterId}`;
  };

  const getChapters = async (mangaId: number, chapterId: number) => {
    type ChapterDataRes = {
      data: {
        chapters: { nodes: { pageCount: number }[] };
        manga: { chapters: { totalCount: number } };
      };
    };
    const res = await request<ChapterDataRes>('/api/graphql', {
      method: 'POST',
      data: JSON.stringify({
        operationName: 'GET_CHAPTERS',
        query: `query GET_CHAPTERS($mangaId: Int!, $chapterId: Int!) {
                chapters(condition: {
                  mangaId: $mangaId, sourceOrder: $chapterId}
                ) { nodes { pageCount } }
                manga(id: $mangaId) { chapters { totalCount } }
              }`,
        variables: { mangaId, chapterId },
      }),
      responseType: 'json',
    });
    // 可能因为 Tachidesk 是在点开指定话数后才去获取数据的
    // 所以如果有时候会拿不到数据需要等一下
    if (res.response.data.chapters.nodes[0].pageCount <= 0) {
      await sleep(200);
      return getChapters(mangaId, chapterId);
    }
    return res.response.data;
  };

  setup({
    name: 'Tachidesk',
    isMangaPage: () => {
      const match =
        /\/manga\/(?<mangaId>\d+)\/chapter\/(?<chapterId>\d+)/u.exec(
          location.pathname,
        )?.groups;
      if (!match) return false;
      return {
        mangaId: Number(match.mangaId),
        chapterId: Number(match.chapterId),
      };
    },
    async getImgList({ setState }, { mangaId, chapterId }) {
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

      return range(
        pageCount,
        (i) => `/api/v1/manga/${mangaId}/chapter/${chapterId}/page/${i}`,
      );
    },
    handler: ({ setState }) =>
      setState('manga', {
        // 跟随阅读进度滚动页面，避免确保能触发 Tachidesk 的进度记录
        onShowImgsChange: debounce((showImgs, imgList) => {
          const lastImgUrl = imgList[[...showImgs].at(-1)!].src;
          querySelector(`img[src$="${lastImgUrl}"]`)?.scrollIntoView({
            behavior: 'instant',
            block: 'end',
          });
        }, 500),
      }),
  });
}

// LANraragi
// test: https://lrr.tvc-16.science/reader?id=fa74bc15e7dd2b6ec0dc2e10cc7cd4942867318a
// 文档: https://sugoi.gitbook.io/lanraragi/dev/api-documentation/archive-api

if (
  location.pathname === '/reader' &&
  document
    .querySelector('.ip > a[href="https://github.com/Difegue/LANraragi"]')
    ?.textContent.trim() === 'LANraragi.'
) {
  let initFlag = true;
  /** 是否由服务器来跟踪进度 */
  let isServerTracksProgress: undefined | boolean;

  const checkServerTracksProgress = async () => {
    if (isServerTracksProgress !== undefined) return;
    const res = await request<{ server_tracks_progress: boolean }>(
      '/api/info',
      { responseType: 'json', fetch: true, noTip: true },
    );
    isServerTracksProgress = res.response.server_tracks_progress;
  };

  const getProgress = async (id: string) => {
    await checkServerTracksProgress();
    if (!isServerTracksProgress)
      return Number(localStorage.getItem(`${id}-reader`)) - 1 || 0;

    const res = await request<{
      progress: number;
    }>(`/api/archives/${id}/metadata`, {
      responseType: 'json',
      errorText: 'Error fetching progress',
      fetch: true,
    });
    return res.response.progress - 1;
  };

  const updateProgress = async (id: string, pageNum: number) => {
    await checkServerTracksProgress();
    if (isServerTracksProgress)
      await request(`/archives/${id}/progress/${pageNum + 1}`, {
        method: 'PUT',
        fetch: true,
        noTip: true,
      });
    else localStorage.setItem(`${id}-reader`, `${pageNum + 1}`);
  };

  setup({
    name: 'LANraragi',
    isMangaPage: () => {
      if (location.pathname !== '/reader') return;
      const id = new URLSearchParams(location.search).get('id');
      if (id) return { id };
    },
    getImgList: async (_, { id }) => {
      await checkServerTracksProgress();
      const res = await request<{ pages: string[] }>(
        `/api/archives/${id}/files`,
        { responseType: 'json', errorText: 'Error fetching image list' },
      );
      return res.response.pages;
    },
    handler: ({ setState }, { id }) => {
      setState('manga', {
        onShowImgsChange: debounce((showImgs, imgList) => {
          // 在刚打开时跳到 LANraragi 记录的进度
          if (imgList.length > 0 && initFlag) {
            initFlag = false;
            (async () => {
              const progress = await getProgress(id);
              setMangaStore((state) => {
                state.activePageIndex = state.pageList.findIndex((page) =>
                  page.includes(progress),
                );
              });
            })();
            return;
          }

          // 同步更新阅读进度
          void updateProgress(id, [...showImgs].at(-1)!);
        }, 200),
      });
    },
  });
}
