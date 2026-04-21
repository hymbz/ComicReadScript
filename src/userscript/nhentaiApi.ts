import { t } from 'helper';
import { request } from 'main';

import type { ComicImgData } from '../components/Manga';
import type { RequestDetails } from '../request';

// API 文档详见：https://nhentai.net/api/v2/docs

type PageInfo = {
  number: number;
  path: string;
  width: number;
  height: number;
  thumbnail: string;
};

type GalleryTitle = {
  english: string;
  japanese?: string;
};

export type ComicInfo = {
  id: number;
  /** 对应作品的 eh 画廊 id */
  media_id: string;
  num_pages: number;
  pages: PageInfo[];
};

const nhApi = <T>(url: string, details?: RequestDetails<T>) =>
  request<T>(url, {
    responseType: 'json',
    headers: { 'User-Agent': navigator.userAgent },
    fetch: false,
    ...details,
  });

export const getNhentaiData = async (id: string) => {
  const { response } = await nhApi<ComicInfo & { title: GalleryTitle }>(
    `https://nhentai.net/api/v2/galleries/${id}`,
    {
      errorText: t('site.ehentai.nhentai_error'),
      noTip: true,
    },
  );
  return response;
};

export const searchNhentai = async (title: string) => {
  const { response } = await nhApi<{
    result: (ComicInfo & { english_title: string; japanese_title?: string })[];
  }>(`https://nhentai.net/api/v2/search?query=${encodeURIComponent(title)}`, {
    errorText: t('site.ehentai.nhentai_error'),
    noTip: true,
  });
  return response.result;
};

export const toImgList = (data: ComicInfo): ComicImgData[] =>
  data.pages.map((page) => ({
    src: `https://i.nhentai.net/${page.path}`,
    width: page.width,
    height: page.height,
  }));
