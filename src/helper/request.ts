import { sleep } from '.';
import { toast } from '../components/useComponents/Toast';
import { t } from './i18n';
import { log } from './logger';

// 将 xmlHttpRequest 包装为 Promise
const xmlHttpRequest = (
  details: Tampermonkey.Request<any>,
): Promise<Tampermonkey.Response<any>> =>
  new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      ...details,
      onload: resolve,
      onerror: reject,
      ontimeout: reject,
    });
  });

export type RequestDetails = Partial<Tampermonkey.Request<any>> & {
  errorText?: string;
  noTip?: true;
};

/** 发起请求 */
export const request = async <T = any>(
  url: string,
  details?: RequestDetails,
  errorNum = 0,
): Promise<Tampermonkey.Response<T>> => {
  const errorText = `${
    details?.errorText ?? t('alert.comic_load_error')
  } - ${url}`;
  try {
    const res = await xmlHttpRequest({
      method: 'GET',
      url,
      headers: { Referer: window.location.href },
      fetch: url.startsWith('/') || url.startsWith(window.location.origin),
      timeout: 1000 * 10,
      ...details,
    });
    if (res.status !== 200) {
      log.error(errorText, res);
      throw new Error(errorText);
    }
    return res;
  } catch (error) {
    if (errorNum >= 0) {
      if (!details?.noTip) toast.error(errorText);
      throw new Error(errorText);
    }
    log.error(errorText, error);
    await sleep(1000);
    return request(url, details, errorNum + 1);
  }
};

/** 轮流向多个 api 发起请求 */
export const eachApi = async <T = any>(
  url: string,
  baseUrlList: string[],
  details?: RequestDetails,
) => {
  for (let i = 0; i < baseUrlList.length; i++) {
    const baseUrl = baseUrlList[i];
    try {
      return await request<T>(`${baseUrl}${url}`, { ...details, noTip: true });
    } catch (_) {}
  }

  const errorText = details?.errorText ?? t('alert.comic_load_error');
  if (!details?.noTip) toast.error(errorText);
  log.error('所有 api 请求均失败', url, baseUrlList, details);
  throw new Error(errorText);
};
