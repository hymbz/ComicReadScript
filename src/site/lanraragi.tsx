import { setState as setMangaStore } from 'components/Manga';
import { setup } from 'core';
import { debounce } from 'helper';
import { request } from 'request';

// LANraragi
// test: https://lrr.tvc-16.science/reader?id=fa74bc15e7dd2b6ec0dc2e10cc7cd4942867318a
// 文档: https://sugoi.gitbook.io/lanraragi/dev/api-documentation/archive-api

let initFlag = true;
/** 是否由服务器来跟踪进度 */
let isServerTracksProgress: undefined | boolean;

const checkServerTracksProgress = async () => {
  if (isServerTracksProgress !== undefined) return;
  const res = await request<{ server_tracks_progress: boolean }>('/api/info', {
    responseType: 'json',
    fetch: true,
    noTip: true,
  });
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
    await request(`/api/archives/${id}/progress/${pageNum + 1}`, {
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
