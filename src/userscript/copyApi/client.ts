import { type RequestDetails, eachApi, request } from 'request';

export const token = document.cookie
  .split('; ')
  .find((cookie) => cookie.startsWith('token='))
  ?.replace('token=', '');

export const mobileApi = new (class {
  // 静态字段需与构建插件 APP_HEADERS（scripts/plugin/copyMangaApi/hosts.ts）保持一致
  headers = {
    webp: '1',
    region: '1',
    'User-Agent': 'COPY/3.0.0',
    // 版本号由 copyApi 插件在构建时自动注入官方最新值
    version: 'appVersion#copyManga',
    source: 'copyApp',
    referer: 'com.copymanga.app-3.0.0',
    Authorization: token ? `Token ${token}` : '',
  };

  get: typeof request = (url, details, ...args) =>
    request(
      url,
      { responseType: 'json', headers: this.headers, ...details },
      ...args,
    );

  // 官方 APP 专有功能（评论、阅读记录等）只由官方 API 域名提供，且要求新版 APP 请求头
  // 主机列表由 copyApi 构建插件在构建时注入
  eachGet = <T = any>(url: string, details?: RequestDetails<T>) =>
    eachApi<T>(url, ['apiList#copyMangaMobile'], {
      responseType: 'json',
      headers: { ...this.headers, accept: 'application/json' },
      fetch: false,
      ...details,
    });
})();

export const pcApi = new (class {
  // 静态字段需与构建插件 HEADERS（scripts/plugin/copyMangaApi/hosts.ts）保持一致
  headers = {
    'User-Agent':
      'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36 Edg/141.0.0.0',
    'x-requested-with': 'com.manga2020.app',
    dnts: '3',
    platform: '3',
    version: '2024.4.28',
    webp: '1',
    accept: 'application/json',
    referer: location.href,
    Authorization: token ? `Token ${token}` : '',
  };

  get: typeof request = (url, details, ...args) =>
    request(
      url,
      { responseType: 'json', headers: this.headers, ...details },
      ...args,
    );

  eachGet = <T = any>(url: string, details?: RequestDetails<T>) =>
    eachApi<T>(url, ['apiList#copyManga'], {
      responseType: 'json',
      headers: this.headers,
      fetch: false,
      ...details,
    });
})();
