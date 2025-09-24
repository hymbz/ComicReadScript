import { toast } from 'components/Toast';
import { log, sleep, t } from 'helper';

export type RequestDetails<T> = Partial<Tampermonkey.Request<T>> & {
  errorText?: string;
  noTip?: boolean;
  noCheckCode?: boolean;
  retryFetch?: boolean;
  onload?: (response: Response<T>) => void;
};

export type Response<T = any> = {
  readonly responseText: string;
  readonly response: T;
  readonly status: number;
  readonly statusText: string;
};

export type ErrorResponse = {
  readonly error: string;
} & Response;

// 将 xmlHttpRequest 包装为 Promise
const xmlHttpRequest = <T = any>(
  details: Tampermonkey.Request<T>,
): Promise<Tampermonkey.Response<T>> =>
  new Promise((resolve, reject) => {
    const handleError = (error?: Tampermonkey.ErrorResponse) => {
      details.onerror?.(error);
      console.error('GM_xmlhttpRequest Error', error);
      reject(new Error(error?.responseText || 'GM_xmlhttpRequest Error'));
    };
    const abort = GM_xmlhttpRequest<T>({
      ...details,
      onload(res) {
        details.onload?.call(res, res);
        resolve(res);
      },
      onerror: handleError,
      ontimeout: handleError,
      onabort: handleError,
    });
    details.signal?.addEventListener('abort', abort.abort);
  });

/** 发起请求 */
export const request = async <T = any>(
  url: string,
  details: RequestDetails<T> = {},
  retryNum = 0,
  errorNum = 0,
): Promise<Response<T>> => {
  const headers = { Referer: location.href };
  const errorText = `${
    details?.errorText ?? t('alert.comic_load_error')
  }\nurl: ${url}`;

  details.fetch ??= url.startsWith('/') || url.startsWith(location.origin);

  try {
    // 虽然 GM_xmlhttpRequest 有 fetch 选项，但在 stay 上不太稳定
    // 为了支持 ios 端只能自己实现一下了
    if (details.fetch || typeof GM_xmlhttpRequest === 'undefined') {
      const res = await fetch(url, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout?.(details.timeout ?? 1000 * 10),
        body: details.data,
        ...details,
      });
      if (!details.noCheckCode && res.status !== 200) {
        log.error(errorText, res);
        throw new Error(errorText);
      }

      let response = null as T;
      switch (details.responseType) {
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

      const _res: Response<T> = {
        status: res.status,
        statusText: res.statusText,
        response,
        responseText: response ? '' : await res.text(),
      };
      details.onload?.call(_res, _res);
      return _res;
    }

    let targetUrl = url;
    // https://github.com/hymbz/ComicReadScript/issues/195
    // 在某些情况下 Tampermonkey 无法正确处理相对协议的 url
    // 实际 finalUrl 会变成 `///xxx.xxx` 莫名多了一个斜杠
    // 然而在修改代码发出正确的请求后，就再也无法复现了
    // 不过以防万一还是在这里手动处理下
    if (url.startsWith('//')) targetUrl = `http:${url}`;
    // stay 没法处理相对路径，也得转换一下
    else if (url.startsWith('/')) targetUrl = `${location.origin}${url}`;

    const res = await xmlHttpRequest<T>({
      method: 'GET',
      url: targetUrl,
      headers,
      timeout: 1000 * 10,
      ...details,
    });
    if (!details.noCheckCode && res.status !== 200) {
      log.error(errorText, res);
      throw new Error(errorText);
    }

    // stay 好像没有正确处理 json，只能再单独判断处理一下
    if (
      details.responseType === 'json' &&
      res.responseText &&
      (typeof res.response !== 'object' ||
        Object.keys(res.response as object).length === 0)
    ) {
      try {
        Reflect.set(res, 'response', JSON.parse(res.responseText));
      } catch {}
    }

    return res;
  } catch (error) {
    if (details && details.retryFetch && retryNum === 0) {
      console.warn('retryFetch', url);
      details.fetch = !details.fetch;
      return request(url, details, retryNum + 1, errorNum);
    }
    if (errorNum >= retryNum) {
      (details.noTip ? console.error : toast.error)(
        `${errorText}\nerror: ${(error as Error).message}`,
      );
      throw new Error(errorText, { cause: error });
    }

    log.error(errorText, error);
    await sleep(1000);
    return request(url, details, retryNum, errorNum + 1);
  }
};

if (isDevMode)
  Object.assign((window as any).unsafeWindow ?? window, { request });

/** 轮流向多个 api 发起请求 */
export const eachApi = async <T = any>(
  url: string,
  baseUrlList: string[],
  details?: RequestDetails<T>,
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
