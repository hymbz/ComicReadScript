import { toast } from '../components/useComponents/Toast';

import { t } from './i18n';
import { log } from './logger';

import { sleep } from '.';

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
  noCheckCode?: true;
};

export type Response<T = any> = {
  readonly responseText: string;
  readonly response: T;
  readonly status: number;
  readonly statusText: string;
};

/** 发起请求 */
export const request = async <T = any>(
  url: string,
  details?: RequestDetails,
  retryNum = 0,
  errorNum = 0,
): Promise<Response<T>> => {
  const headers = { Referer: window.location.href };
  const errorText = `${
    details?.errorText ?? t('alert.comic_load_error')
  }\nurl: ${url}`;

  try {
    // 虽然 GM_xmlhttpRequest 有 fetch 选项，但在 stay 上不太稳定
    // 为了支持 ios 端只能自己实现一下了
    if (
      details?.fetch ??
      (url.startsWith('/') || url.startsWith(window.location.origin))
    ) {
      const res = await fetch(url, {
        method: 'GET',
        headers,
        ...details,
        // eslint-disable-next-line unicorn/no-invalid-fetch-options
        body: details?.data,
        signal: AbortSignal.timeout?.(details?.timeout ?? 1000 * 10),
      });
      if (!details?.noCheckCode && res.status !== 200) {
        log.error(errorText, res);
        throw new Error(errorText);
      }

      let response = null as T;
      switch (details?.responseType) {
        case 'arraybuffer':
          response = (await res.arrayBuffer()) as T;
          break;
        case 'blob':
          response = (await res.blob()) as T;
          break;
        case 'json':
          response = (await res.json()) as T;
          break;
      }

      return {
        status: res.status,
        statusText: res.statusText,
        response,
        responseText: response ? '' : await res.text(),
      };
    }

    const res = await xmlHttpRequest({
      method: 'GET',
      url,
      headers,
      timeout: 1000 * 10,
      ...details,
    });
    if (!details?.noCheckCode && res.status !== 200) {
      log.error(errorText, res);
      throw new Error(errorText);
    }

    return res;
  } catch (error) {
    if (errorNum >= retryNum) {
      (details?.noTip ? console.error : toast.error)(errorText);
      throw new Error(errorText);
    }

    log.error(errorText, error);
    await sleep(1000);
    return request(url, details, retryNum, errorNum + 1);
  }
};

/** 轮流向多个 api 发起请求 */
export const eachApi = async <T = any>(
  url: string,
  baseUrlList: string[],
  details?: RequestDetails,
) => {
  for (const baseUrl of baseUrlList) {
    try {
      return await request<T>(`${baseUrl}${url}`, { ...details, noTip: true });
    } catch {}
  }

  const errorText = details?.errorText ?? t('alert.comic_load_error');
  if (!details?.noTip) toast.error(errorText);
  log.error('所有 api 请求均失败', url, baseUrlList, details);
  throw new Error(errorText);
};
