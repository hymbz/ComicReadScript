import { sleep } from '.';
import { toast } from '../components/useComponents/Toast';
import { t } from './i18n';

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

/** 发起请求 */
export const request = async <T = any>(
  url: string,
  details?: Partial<Tampermonkey.Request<any>> & {
    errorText?: string;
    noTip?: true;
  },
  errorNum = 0,
): Promise<Tampermonkey.Response<T>> => {
  const errorText = details?.errorText ?? t('alert.comic_load_error');
  try {
    const res = await xmlHttpRequest({
      method: 'GET',
      url,
      headers: { Referer: window.location.href },
      fetch: url.includes(window.location.origin),
      ...details,
    });
    if (res.status !== 200) throw new Error(errorText);
    return res;
  } catch (error) {
    if (errorNum >= 3) {
      if (errorText && !details?.noTip) toast.error(errorText);
      throw new Error(errorText);
    }
    console.error(errorText, error);
    await sleep(1000);
    return request(url, details, errorNum + 1);
  }
};
