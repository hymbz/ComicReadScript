import { t } from 'helper';
import { request } from 'main';

type PageInfo = {
  number: number;
  path: string;
  width: number;
  height: number;
  thumbnail: string;
  thumbnail_width: number;
  thumbnail_height: number;
};

type GalleryTitle = {
  english: string;
  japanese?: string | null;
  pretty?: string;
};

export type ComicInfo = {
  id: number;
  media_id: string;
  num_pages: number;
  title: GalleryTitle;
  pages: PageInfo[];
};

const resolvePageUrl = (page: PageInfo) => {
  const path = page.path || '';

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('/')) {
    return `https://i.nhentai.net${path}`;
  }

  if (path) {
    return `https://i.nhentai.net/${path}`;
  }
};

// 只要带上 cf_clearance cookie 就能通过 Cloudflare 验证，但其是 httpOnly
// 目前暴力猴还不支持 GM_Cookie，篡改猴也需要去设置里手动设置才能支持 httpOnly
// 所以暂不处理，就嗯等
// https://github.com/violentmonkey/violentmonkey/issues/603

export const getNhentaiData = async (id: string) => {
  const { response } = await request<ComicInfo>(
    `https://nhentai.net/api/v2/galleries/${id}`,
    {
      responseType: 'json',
      errorText: t('site.ehentai.nhentai_error'),
      noTip: true,
      headers: { 'User-Agent': navigator.userAgent },
      fetch: false,
    },
  );
  return response;
};

export const searchNhentai = async (title: string) => {
  const { response } = await request<{
    result: Array<{
      id: number;
      media_id: string;
      english_title: string;
      japanese_title?: string | null;
    }>;
  }>(
    `https://nhentai.net/api/v2/search?query=${encodeURIComponent(title)}`,
    {
      responseType: 'json',
      errorText: t('site.ehentai.nhentai_error'),
      noTip: true,
      headers: { 'User-Agent': navigator.userAgent },
      fetch: false,
    },
  );
  return response.result;
};

export const toImgList = (data: ComicInfo) =>
  data.pages.map((page) => resolvePageUrl(page));

export const getNhentaiImageUrl = (data: ComicInfo, index: number) => {
  const page = data.pages[index];
  if (!page) throw new Error('nhentai page data missing at index ' + index);
  return resolvePageUrl(page);
};
