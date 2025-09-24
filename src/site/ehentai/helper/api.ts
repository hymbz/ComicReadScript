import type { GalleryMetadata } from 'ehentai-api';

import { log, querySelector } from 'helper';
import { request, type RequestDetails } from 'request';

import type { GalleryContext } from './context';

import { setNl } from '.';

// https://github.com/tommy351/ehreader-android/wiki/E-Hentai-JSON-API

export const ehApi = async <T extends Record<string, any>>(
  data: Record<string, any>,
  details?: RequestDetails<any>,
) => {
  const res = await request<T>(`/api.php`, {
    fetch: false,
    method: 'POST',
    responseType: 'json',
    cookie: document.cookie,
    data: JSON.stringify(data),
    ...details,
  });

  if (res.response.error) {
    log.error(res.response.error);
    throw new Error(res.response.error);
  }

  return res.response;
};

/** 使用 api 获取图片链接 */
export const getImgUrlByApi = async (
  context: GalleryContext,
  i: number,
  nextLink?: true,
) => {
  const imgPageUrl = context.pageList[i];

  // api 使用的 nl 只要 - 前面的数字，但通过 url 获取新图地址时需要完整的 nl
  const [, imgkey, gid, page, nl] =
    /\/s\/(\S+)\/(\d+)-(\d+)(?=$|\?nl=(\d+))/.exec(imgPageUrl)!;
  const data: Record<string, string> = { gid, page, imgkey };
  if (nl) data.nl = nl;

  if (context.mpvkey) {
    const res = await ehApi(
      { method: 'imagedispatch', ...data, mpvkey: context.mpvkey },
      { noTip: true },
    );
    if (nextLink) setNl(context, i, res.s);
    return res.i;
  }

  const res = await ehApi(
    { method: 'showpage', ...data, showkey: context.showkey },
    { noTip: true },
  );
  if (nextLink) setNl(context, i, /nl\('(\d+-\d+)'\)/.exec(res.i3)![1]);
  return /src="(\S+)"/.exec(res.i3)![1];
};

/** 获取画廊数据 */
export const getGalleryData = async (...urls: string[]) => {
  const gidlist = urls.map((url) =>
    /\/g\/([^/]+)\/([^/]+)/.exec(url)!.slice(1),
  );
  const res = await ehApi({ method: 'gdata', namespace: 1, gidlist });
  return res.gmetadata as GalleryMetadata[];
};

/** 检查 showkey */
export const checkShowkey = async (
  context: GalleryContext,
  imgPageUrl: string,
) => {
  if (context.showkey) return;

  const res = await request(imgPageUrl, { fetch: true }, 10);
  const [, showkey] = /showkey="(\S+)"/.exec(res.responseText)!;
  context.showkey = showkey;
};

/** 检查 mpvkey */
export const checkMpvKey = async (context: GalleryContext) => {
  if (context.mpvkey) return;

  const mpvUrl = `${location.origin}${location.pathname}`.replace(
    '/g/',
    '/mpv/',
  );
  const mpvButton = querySelector<HTMLButtonElement>(`.g2 a[href="${mpvUrl}"]`);
  if (!mpvButton) return;

  const res = await request(mpvUrl, { fetch: true });
  const reRes = /mpvkey = "(\S+)"/.exec(res.responseText);
  if (!reRes) return;
  const [, mpvkey] = reRes;
  context.mpvkey = mpvkey;
};
