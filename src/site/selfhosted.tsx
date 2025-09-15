import { clamp, debounce, querySelector, range, sleep, wait } from 'helper';
import { request } from 'request';

import type { InitOptions } from '../userscript/main';
import { setState } from 'components/Manga';

declare let options: InitOptions; // oxlint-disable-line no-unused-vars

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

  options = {
    name: 'Tachidesk',
    SPA: {
      isMangaPage: () => /\/manga\/\d+\/chapter\/\d+/.test(location.pathname),
    },
    async getImgList({ setState }) {
      const [, , mangaId, , chapterId] = location.pathname
        .split('/')
        .map(Number);
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
    // 跟随阅读进度滚动页面，避免确保能触发 Tachidesk 的进度记录
    onShowImgsChange: debounce((showImgs, imgList) => {
      const lastImgUrl = imgList[[...showImgs].at(-1)!].src;
      querySelector(`img[src$="${lastImgUrl}"]`)?.scrollIntoView({
        behavior: 'instant',
        block: 'end',
      });
    }, 500),
  };
}

// LANraragi

declare let Reader:
  | {
      id: string;
      pages: string[];
      currentPage: number;
      maxPage: number;
      updateProgress: () => void;
    }
  | undefined;

if (
  location.pathname === '/reader' &&
  document
    .querySelector('.ip > a[href="https://github.com/Difegue/LANraragi"]')
    ?.textContent.trim() === 'LANraragi.'
) {
  let initFlag = true;

  options = {
    name: 'LANraragi',
    getImgList: () => wait(() => Reader?.pages),
    onShowImgsChange: debounce((showImgs, imgList) => {
      if (!Reader) return;

      // 在刚打开时跳到 LANraragi 记录的进度
      if (imgList.length > 0 && initFlag) {
        initFlag = false;
        setState((state) => {
          state.activePageIndex = state.pageList.findIndex((page) =>
            page.includes(Reader.currentPage),
          );
        });
      }

      // 同步更新阅读进度
      Reader.currentPage = clamp(0, [...showImgs].at(-1)!, Reader.maxPage);
      Reader.updateProgress();
    }, 200),
  };
}
