/**
 * MangaImageTranslator 辅助函数
 *
 * 提供 API 请求、URL 构建等通用功能。
 */
import { createRootMemo } from 'helper';
import { request, type RequestDetails } from 'request';

import { store } from '../../../../store';

/** 获取 API 基础 URL，优先使用自定义地址 */
export const apiUrl = () =>
  store.option.translation.mit?.localUrl?.replace(/\/$/, '') ||
  'http://127.0.0.1:5003';

/** ngrok 代理需要的特殊请求头 */
export const headers = createRootMemo(() => {
  if (apiUrl().includes('.ngrok-free.'))
    return { 'ngrok-skip-browser-warning': '69420' };
});

/** 旧版 API 任务状态 */
export type TaskState = {
  state: 'saved' | 'finished' | 'error' | 'error-lang';
  finished: boolean;
  waiting: number;
};

/**
 * 发送 API 请求
 * @param url API 路径（不含基础 URL）
 * @param details 请求配置
 * @param retryNum 重试次数
 */
export const api = async <T = string>(
  url: string,
  details?: RequestDetails<T>,
  retryNum = 0,
) =>
  request<T>(
    `${apiUrl()}${url}`,
    { ...details, headers: { ...details?.headers, ...headers() } },
    retryNum,
  );
