import { toast } from 'components/Toast';
import { type GalleryMetadata } from 'ehentai-api';
import { log, querySelector, t } from 'helper';
import { type RequestDetails, request } from 'request';

import { setNl } from '.';
import { type GalleryPageContext } from './context';

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
  pageCtx: GalleryPageContext,
  i: number,
  nextLink?: true,
) => {
  const imgPageUrl = pageCtx.pageList[i];

  // api 使用的 nl 只要 - 前面的数字，但通过 url 获取新图地址时需要完整的 nl
  const { imgkey, gid, page, nl } =
    /\/s\/(?<imgkey>\S+)\/(?<gid>\d+)-(?<page>\d+)(?=$|\?nl=(?<nl>\d+))/u.exec(
      imgPageUrl,
    )!.groups;
  const data: Record<string, string> = { gid, page, imgkey };
  if (nl) data.nl = nl;

  if (pageCtx.mpvkey) {
    const res = await ehApi(
      { method: 'imagedispatch', ...data, mpvkey: pageCtx.mpvkey },
      { noTip: true },
    );
    if (nextLink) setNl(pageCtx, i, res.s);
    return res.i as string;
  }

  const res = await ehApi(
    { method: 'showpage', ...data, showkey: pageCtx.showkey },
    { noTip: true },
  );
  if (nextLink)
    setNl(pageCtx, i, /nl\('(?<nl>\d+-\d+)'\)/u.exec(res.i3)!.groups.nl);
  return /src="(?<src>\S+)"/u.exec(res.i3)!.groups.src;
};

/** 获取画廊数据 */
export const getGalleryData = async (...urls: string[]) => {
  const gidlist = urls.map((url) =>
    /\/g\/(?<gid>[^/]+)\/(?<token>[^/]+)/u.exec(url)!.slice(1),
  );
  const res = await ehApi({ method: 'gdata', namespace: 1, gidlist });
  return res.gmetadata as GalleryMetadata[];
};

/** 检查 showkey */
export const checkShowkey = async (
  pageCtx: GalleryPageContext,
  imgPageUrl: string,
) => {
  if (pageCtx.showkey) return;

  const { responseText: html } = await request(imgPageUrl, { fetch: true }, 10);
  pageCtx.showkey = /showkey="(?<showkey>\S+)"/u.exec(html)!.groups.showkey;
};

/** 检查 mpvkey */
export const checkMpvKey = async (pageCtx: GalleryPageContext) => {
  if (pageCtx.mpvkey) return;

  const mpvUrl = `${location.origin}${location.pathname}`.replace(
    '/g/',
    '/mpv/',
  );
  const mpvButton = querySelector<HTMLButtonElement>(`.g2 a[href="${mpvUrl}"]`);
  if (!mpvButton) return;

  const { responseText: html } = await request(mpvUrl, { fetch: true });
  const mpvkey = /mpvkey = "(?<key>\S+)"/u.exec(html)?.groups?.key;
  if (!mpvkey) return;
  pageCtx.mpvkey = mpvkey;
};

/** 检查 IP 是否被封禁 */
export const checkIpBanned = (text: string) =>
  text.includes('IP address has been temporarily banned') &&
  toast.error(t('site.ehentai.ip_banned'), {
    throw: true,
    duration: Infinity,
  });

/** 从图片页获取图片地址 */
export const getImgUrl = async (
  pageCtx: GalleryPageContext,
  i: number,
): Promise<string> => {
  try {
    return await getImgUrlByApi(pageCtx, i);
  } catch (error) {
    log.warn('getImgUrlByApi failed', error);
  }

  const res = await request(
    pageCtx.pageList[i],
    {
      fetch: true,
      errorText: t('site.ehentai.fetch_img_page_source_failed'),
    },
    10,
  );
  checkIpBanned(res.responseText);
  try {
    return /id="img" src="(?<src>.+?)"/u.exec(res.responseText)!.groups.src;
  } catch {
    throw new Error(t('site.ehentai.fetch_img_url_failed'));
  }
};

/** 从详情页获取图片页的地址 */
export const getImgPageUrl = async (
  pageNum = 0,
): Promise<[string, string][]> => {
  const res = await request(
    `${location.pathname}${pageNum ? `?p=${pageNum}` : ''}`,
    {
      fetch: true,
      errorText: t('site.ehentai.fetch_img_page_url_failed'),
    },
  );
  checkIpBanned(res.responseText);
  const pageList: [string, string][] = [
    ...res.responseText.matchAll(
      // 缩略图有三种显示方式：
      // 使用 img 的旧版，不显示页码的单个 div，显示页码的嵌套 div
      /<a href="(?<url>.{20,50})"><(?<img>img alt=.+?|div><div |div )title=".+?: (?<fileName>.+?)"/gu,
    ),
  ].map(({ groups: { url, fileName } }) => [url, fileName]);
  if (pageList.length === 0)
    throw new Error(t('site.ehentai.fetch_img_page_url_failed'));
  return pageList;
};

/** 获取新的图片页地址 */
export const updatePageUrl = async (pageCtx: GalleryPageContext, i: number) => {
  try {
    return await getImgUrlByApi(pageCtx, i, true);
  } catch {}

  const res = await request(pageCtx.pageList[i], {
    errorText: t('site.ehentai.fetch_img_page_source_failed'),
  });
  checkIpBanned(res.responseText);
  const nl = /nl\('(?<nl>.+?)'\)/u.exec(res.responseText)?.groups?.nl;
  if (!nl) throw new Error(t('site.ehentai.fetch_img_url_failed'));
  setNl(pageCtx, i, nl);
};

/** 按需加载第 i 张图所在分页的详情页 URL */
export const ensureImgPageUrl = async (
  pageCtx: GalleryPageContext,
  index: number,
) => {
  if (pageCtx.pageList[index]) return;

  const pageNum = Math.floor(index / pageCtx.imagesPerPage) || 0;
  const pageList = await getImgPageUrl(pageNum);

  // 将第一页的图片数作为 imagesPerPage 来初始化
  pageCtx.imagesPerPage ||= pageList.length;

  const startIndex = pageNum * pageCtx.imagesPerPage;
  for (let i = 0; i < pageList.length; i++)
    [pageCtx.pageList[startIndex + i], pageCtx.fileNameList[startIndex + i]] =
      pageList[i];
};
